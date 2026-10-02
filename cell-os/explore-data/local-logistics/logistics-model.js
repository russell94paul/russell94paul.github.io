/* Local Logistics & Delivery — in-memory simulation model.
   Ported from the pack's reference/demo_model.mjs (order reducer, dispatch eligibility,
   map visibility, metrics, campaign gate) and extended for the UI (shift, procurement, clock).
   Synthetic fixtures only. No network, auth, encryption, navigation or production authority. */
export class DemoError extends Error { constructor(code, message) { super(message); this.name = 'DemoError'; this.code = code; } }
const fail = (code, message) => { throw new DemoError(code, message); };
const clone = v => JSON.parse(JSON.stringify(v));
const ACTIVE_ASSIGNMENT = new Set(['ASSIGNED', 'IN_TRANSIT', 'DELIVERY_EXCEPTION']);
const PRE_PICKUP = new Set(['DRAFT', 'CONFIRMED', 'RESERVED', 'PICKING', 'READY', 'ASSIGNED', 'STOCK_EXCEPTION']);
const VALID_STATES = new Set([...PRE_PICKUP, 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'DELIVERY_EXCEPTION']);
const ms = v => Date.parse(v);
const stable = v => JSON.stringify(normalize(v));
function normalize(v) { if (Array.isArray(v)) return v.map(normalize); if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k => [k, normalize(v[k])])); return v; }
export function quantities(order) { const r = new Map(); for (const l of order.items) r.set(l.skuId, (r.get(l.skuId) || 0) + l.quantity); return r; }
function localDay(iso, tz) { const p = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(iso)); const g = k => p.find(x => x.type === k)?.value; return `${g('year')}-${g('month')}-${g('day')}`; }
export function assertState(state) {
  if (state?.meta?.mode !== 'simulation' || state.meta.allOperationalDataSynthetic !== true) fail('NOT_SYNTHETIC', 'Only synthetic simulation fixtures are accepted.');
  if (!Number.isFinite(ms(state.meta.clockIso))) fail('INVALID_CLOCK', 'A valid virtual clock is required.');
  const seen = new Set();
  for (const o of state.orders) {
    if (seen.has(o.id)) fail('DUPLICATE_ORDER', o.id); seen.add(o.id);
    if (!VALID_STATES.has(o.state)) fail('INVALID_STATE', o.state);
    if (!Number.isInteger(o.revision) || o.revision < 1) fail('INVALID_REVISION', o.id);
    if (!Array.isArray(o.items) || !o.items.length) fail('INVALID_ITEMS', o.id);
    for (const it of o.items) {
      if (!Object.prototype.hasOwnProperty.call(state.inventory, it.skuId)) fail('UNKNOWN_SKU', it.skuId);
      if (!Number.isInteger(it.quantity) || it.quantity <= 0) fail('INVALID_QUANTITY', o.id);
      if (!Number.isInteger(it.unitPriceMinor) || it.unitPriceMinor < 0) fail('INVALID_PRICE', o.id);
    }
    if (o.assignedWorkerId && !state.workers.some(w => w.id === o.assignedWorkerId)) fail('UNKNOWN_WORKER', o.id);
  }
  for (const [skuId, stock] of Object.entries(state.inventory)) {
    if (!Number.isInteger(stock.onHand) || !Number.isInteger(stock.reserved) || stock.reserved < 0 || stock.onHand < stock.reserved) fail('INVALID_STOCK', skuId);
    const held = state.orders.filter(o => o.reservationStatus === 'HELD').reduce((s, o) => s + (quantities(o).get(skuId) || 0), 0);
    if (held !== stock.reserved) fail('RESERVATION_MISMATCH', skuId);
  }
  return true;
}
export function createState(fixtures) { const s = clone(fixtures); s.purchases = s.purchases || []; s.supportCases = s.supportCases || []; assertState(s); return s; }
export function activeJobs(state, workerId) { return state.orders.filter(o => o.assignedWorkerId === workerId && ACTIVE_ASSIGNMENT.has(o.state)).length; }
export function candidateDecisions(state, orderId) {
  const order = state.orders.find(o => o.id === orderId); if (!order) fail('UNKNOWN_ORDER', orderId);
  return state.workers.map(w => {
    const reasons = [];
    if (w.status !== 'AVAILABLE') reasons.push(w.status === 'BREAK' ? 'ON_BREAK' : 'OFF_DUTY');
    const load = activeJobs(state, w.id);
    if (load >= w.capacity) reasons.push('AT_CAPACITY');
    if (!w.allowedZoneIds.includes(order.zoneId)) reasons.push('OUTSIDE_APPROVED_COVERAGE');
    const age = w.position ? (ms(state.meta.clockIso) - ms(w.position.observedAt)) / 1000 : NaN;
    if (!w.position) reasons.push('NO_POSITION');
    else if (!Number.isFinite(age) || age < 0 || age > state.policy.stalePositionSeconds) reasons.push('STALE_OR_INVALID_POSITION');
    const travel = w.travelMinutesByZone[order.zoneId];
    if (!Number.isFinite(travel) || travel < 0) reasons.push('NO_TRAVEL_FIXTURE');
    return { workerId: w.id, label: w.label, teamId: w.teamId, eligible: reasons.length === 0, reasons, travelMinutes: travel ?? null, activeJobs: load, remainingCapacity: Math.max(0, w.capacity - load), positionAgeSeconds: Number.isFinite(age) ? age : null };
  }).sort((a, b) => Number(b.eligible) - Number(a.eligible) || (a.travelMinutes ?? Infinity) - (b.travelMinutes ?? Infinity) || a.workerId.localeCompare(b.workerId));
}
function authorizeStaff(actor, order) { if (actor?.role === 'owner') return; if (actor?.role === 'team_lead' && actor.zoneId === order.zoneId) return; fail('FORBIDDEN', 'This demo role does not own this territory action.'); }
function authorizeEmployee(actor, order) { if (actor?.role !== 'employee' || !actor.workerId || actor.workerId !== order.assignedWorkerId) fail('FORBIDDEN', 'Only the assigned example employee can confirm this step.'); }
function requireState(order, expected) { if (!expected.includes(order.state)) fail('INVALID_TRANSITION', `${order.state} cannot perform this action.`); }
function releaseHeld(state, order) { if (order.reservationStatus !== 'HELD') return; for (const [skuId, n] of quantities(order)) state.inventory[skuId].reserved -= n; order.reservationStatus = 'NONE'; }
/** Pure reducer. Command: id, action, orderId, expectedRevision, actor (+workerId / reason). */
export function applyOrderAction(input, command) {
  assertState(input);
  if (!command || typeof command.id !== 'string' || !/^[A-Za-z0-9._:-]{1,128}$/.test(command.id)) fail('INVALID_COMMAND_ID', 'Use a nonempty local action identifier.');
  const key = `command:${command.id}`; const fp = stable(command);
  if (Object.prototype.hasOwnProperty.call(input.processedCommands, key)) { if (input.processedCommands[key] !== fp) fail('IDEMPOTENCY_CONFLICT', 'An action ID was reused with different contents.'); return clone(input); }
  const state = clone(input);
  const order = state.orders.find(o => o.id === command.orderId); if (!order) fail('UNKNOWN_ORDER', command.orderId);
  if (command.expectedRevision !== order.revision) fail('STALE_REVISION', 'Reload the current sample order revision.');
  const prior = order.state;
  switch (command.action) {
    case 'CONFIRM':
      if (command.actor?.role !== 'customer' || command.actor.customerId !== order.customerId) fail('FORBIDDEN', 'Only the matching sample customer confirms this cart.');
      requireState(order, ['DRAFT']); order.state = 'CONFIRMED'; order.submittedAt = state.meta.clockIso; order.paymentOutcome = 'SIMULATED_AUTHORIZED'; break;
    case 'RESERVE': {
      authorizeStaff(command.actor, order); requireState(order, ['CONFIRMED']);
      const req = quantities(order);
      const ok = [...req].every(([skuId, n]) => state.inventory[skuId].onHand - state.inventory[skuId].reserved >= n);
      if (!ok) { order.state = 'STOCK_EXCEPTION'; order.exceptionReason = 'INSUFFICIENT_AVAILABLE_STOCK'; }
      else { for (const [skuId, n] of req) state.inventory[skuId].reserved += n; order.reservationStatus = 'HELD'; order.state = 'RESERVED'; order.exceptionReason = null; }
      break;
    }
    case 'START_PICKING': authorizeStaff(command.actor, order); requireState(order, ['RESERVED']); order.state = 'PICKING'; break;
    case 'MARK_READY': authorizeStaff(command.actor, order); requireState(order, ['PICKING']); order.state = 'READY'; break;
    case 'ASSIGN': {
      authorizeStaff(command.actor, order); requireState(order, ['READY']);
      if (order.assignedWorkerId) fail('ALREADY_ASSIGNED', order.id);
      const c = candidateDecisions(state, order.id).find(x => x.workerId === command.workerId);
      if (!c?.eligible) fail('INELIGIBLE_WORKER', c?.reasons.join(', ') || 'Unknown worker');
      order.assignedWorkerId = command.workerId; order.state = 'ASSIGNED'; break;
    }
    case 'PICKUP': {
      authorizeEmployee(command.actor, order); requireState(order, ['ASSIGNED']);
      const w = state.workers.find(x => x.id === order.assignedWorkerId);
      if (w.status !== 'AVAILABLE') fail('WORKER_UNAVAILABLE', w.id);
      if (order.reservationStatus !== 'HELD') fail('MISSING_RESERVATION', order.id);
      for (const [skuId, n] of quantities(order)) { state.inventory[skuId].onHand -= n; state.inventory[skuId].reserved -= n; }
      order.reservationStatus = 'CONSUMED'; order.state = 'IN_TRANSIT'; break;
    }
    case 'DELIVER': authorizeEmployee(command.actor, order); requireState(order, ['IN_TRANSIT']); order.state = 'DELIVERED'; order.deliveredAt = state.meta.clockIso; break;
    case 'REPORT_EXCEPTION':
      authorizeEmployee(command.actor, order); requireState(order, ['IN_TRANSIT']);
      if (!['CUSTOMER_UNAVAILABLE', 'PACKAGE_REVIEW_REQUIRED'].includes(command.reason)) fail('INVALID_REASON', 'Choose a canned exception reason.');
      order.state = 'DELIVERY_EXCEPTION'; order.exceptionReason = command.reason; break;
    case 'CANCEL':
      if (command.actor?.role !== 'owner' && !(command.actor?.role === 'customer' && command.actor.customerId === order.customerId)) fail('FORBIDDEN', 'Cancellation requires owner or matching customer.');
      requireState(order, [...PRE_PICKUP]); releaseHeld(state, order); order.assignedWorkerId = null; order.state = 'CANCELLED'; order.exceptionReason = null; break;
    default: fail('UNKNOWN_ACTION', String(command.action));
  }
  order.revision += 1;
  state.audit.push({ id: `EVENT-${String(state.audit.length + 1).padStart(4, '0')}`, commandId: command.id, at: state.meta.clockIso, actorRole: command.actor.role, orderId: order.id, action: command.action, priorState: prior, nextState: order.state, revision: order.revision, reason: command.reason || null, synthetic: true });
  state.processedCommands[key] = fp;
  assertState(state);
  return state;
}
export function visibleWorkers(state, viewer) {
  const own = viewer?.role === 'customer' ? state.orders.find(o => o.id === viewer.orderId && o.customerId === viewer.customerId && o.state === 'IN_TRANSIT') : null;
  return state.workers.filter(w => {
    if (w.status !== 'AVAILABLE' || !w.position) return false;
    if (viewer?.role === 'owner') return true;
    if (viewer?.role === 'team_lead') return w.primaryZoneId === viewer.zoneId;
    if (viewer?.role === 'employee') return w.id === viewer.workerId;
    if (viewer?.role === 'customer') return own?.assignedWorkerId === w.id;
    return false;
  }).map(w => { const age = (ms(state.meta.clockIso) - ms(w.position.observedAt)) / 1000; return { workerId: w.id, label: viewer.role === 'customer' ? 'Your sample delivery' : w.label, x: w.position.x, y: w.position.y, observedAt: w.position.observedAt, stale: !Number.isFinite(age) || age < 0 || age > state.policy.stalePositionSeconds, assigned: activeJobs(state, w.id) > 0, synthetic: true }; });
}
export function metrics(state, { zoneId = null, workerId = null } = {}) {
  const day = localDay(state.meta.clockIso, state.meta.timezone);
  const submitted = state.orders.filter(o => o.submittedAt && localDay(o.submittedAt, state.meta.timezone) === day && (!zoneId || o.zoneId === zoneId) && (!workerId || o.assignedWorkerId === workerId));
  const completed = submitted.filter(o => o.state === 'DELIVERED');
  const active = submitted.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.state));
  const valid = completed.filter(o => [o.deliveredAt, o.promiseStart, o.promiseEnd].every(v => Number.isFinite(ms(v))) && ms(o.promiseStart) <= ms(o.promiseEnd));
  const onTime = valid.filter(o => ms(o.deliveredAt) >= ms(o.promiseStart) && ms(o.deliveredAt) <= ms(o.promiseEnd));
  const late = valid.map(o => Math.max(0, (ms(o.deliveredAt) - ms(o.promiseEnd)) / 60000)).sort((a, b) => a - b);
  return { period: day, timezone: state.meta.timezone, currency: state.meta.currency, submitted: submitted.length, active: active.length, completed: completed.length, cancelled: submitted.filter(o => o.state === 'CANCELLED').length, exceptions: active.filter(o => o.state.endsWith('_EXCEPTION')).length, overdueOpen: active.filter(o => ms(o.promiseEnd) < ms(state.meta.clockIso)).length, deliveredMerchandiseMinor: completed.reduce((t, o) => t + o.items.reduce((s, it) => s + it.quantity * it.unitPriceMinor, 0), 0), onTimeNumerator: onTime.length, onTimeDenominator: valid.length, onTimeRate: valid.length ? onTime.length / valid.length : null, invalidCompletedWindows: completed.length - valid.length, p90CompletedLatenessMinutes: late.length ? late[Math.ceil(0.9 * late.length) - 1] : null, smallSampleWarning: valid.length < 20, synthetic: true };
}
export function campaignGate(state, campaign, { requireApproval = true } = {}) {
  const reasons = []; const sku = state.catalogue.find(s => s.id === campaign.skuId); const stock = state.inventory[campaign.skuId];
  if (!Number.isInteger(campaign.unitsCap) || campaign.unitsCap <= 0) reasons.push('INVALID_UNIT_CAP');
  if (!Number.isInteger(campaign.discountBps) || campaign.discountBps < 0 || campaign.discountBps > 10000) reasons.push('INVALID_DISCOUNT');
  if (!Number.isInteger(campaign.budgetMinor) || campaign.budgetMinor < 0) reasons.push('INVALID_BUDGET');
  if (!sku || !stock) reasons.push('UNKNOWN_SKU'); else if (stock.onHand - stock.reserved < campaign.unitsCap) reasons.push('INSUFFICIENT_STOCK');
  if ((state.policy.campaignSlotsByZone[campaign.zoneId] ?? 0) < campaign.unitsCap) reasons.push('INSUFFICIENT_CAPACITY');
  const ev = state.events.find(e => e.id === campaign.eventId);
  if (!ev || ev.status !== 'SCHEDULED' || ev.zoneId !== campaign.zoneId || ms(ev.endsAt) <= ms(state.meta.clockIso)) reasons.push('EVENT_INVALID');
  else { const age = (ms(state.meta.clockIso) - ms(ev.checkedAt)) / 1000; if (!Number.isFinite(age) || age < 0 || age > state.policy.eventFreshnessSeconds) reasons.push('EVENT_STALE'); }
  if (!(campaign.audiencePermissionSummary?.eligible > 0)) reasons.push('NO_ELIGIBLE_AUDIENCE');
  const discountCostMinor = sku ? Math.round(sku.unitPriceMinor * campaign.discountBps / 10000) * campaign.unitsCap : null;
  if (discountCostMinor !== null && discountCostMinor > campaign.budgetMinor) reasons.push('DISCOUNT_BUDGET_EXCEEDED');
  if (requireApproval && (campaign.state !== 'APPROVED' || campaign.approvedRevision !== campaign.revision)) reasons.push('CURRENT_APPROVAL_REQUIRED');
  return { allowed: reasons.length === 0, reasons, discountCostMinor, effect: 'PREVIEW_ONLY_NO_SEND', assumptions: 'Illustrative stock, capacity, discount cost and audience counts; not a forecast or profitability model.' };
}
export function approveCampaign(state, campaign, actor) { if (actor?.role !== 'owner') fail('FORBIDDEN', 'Only the example owner approves a campaign.'); const g = campaignGate(state, campaign, { requireApproval: false }); if (!g.allowed) fail('CAMPAIGN_BLOCKED', g.reasons.join(', ')); return { ...clone(campaign), state: 'APPROVED', approvedRevision: campaign.revision }; }
export function editCampaign(campaign, patch, actor) { if (actor?.role !== 'owner') fail('FORBIDDEN', 'Only the example owner edits this reference campaign.'); const allowed = ['skuId', 'zoneId', 'unitsCap', 'discountBps', 'budgetMinor', 'eventId']; if (Object.keys(patch).some(k => !allowed.includes(k))) fail('INVALID_PATCH', 'Only proposed commercial terms may change.'); return { ...clone(campaign), ...clone(patch), revision: campaign.revision + 1, state: 'DRAFT', approvedRevision: null }; }
export function eventStatus(state, ev) { const age = (ms(state.meta.clockIso) - ms(ev.checkedAt)) / 1000; if (ev.status === 'CANCELLED') return 'CANCELLED'; if (ms(ev.endsAt) <= ms(state.meta.clockIso)) return 'ENDED'; if (!Number.isFinite(age) || age < 0 || age > state.policy.eventFreshnessSeconds) return 'STALE'; return 'CURRENT'; }

/* ---- UI extensions (pack-local proposals; not reference-tested by the pack) ---- */
export function advanceClock(input, minutes) { const s = clone(input); s.meta.clockIso = new Date(ms(s.meta.clockIso) + minutes * 60000).toISOString().replace('Z', '+00:00'); assertState(s); return s; }
/** Shift changes: START_SHIFT, BREAK, RESUME, END_SHIFT. An active assignment blocks leaving without handover. */
export function applyWorkerAction(input, { workerId, action, actor }) {
  if (actor?.role !== 'employee' || actor.workerId !== workerId) fail('FORBIDDEN', 'Only the example employee changes their own status.');
  const s = clone(input); const w = s.workers.find(x => x.id === workerId); if (!w) fail('UNKNOWN_WORKER', workerId);
  const jobs = activeJobs(s, w.id);
  switch (action) {
    case 'START_SHIFT': if (w.status !== 'OFF_DUTY') fail('INVALID_TRANSITION', 'Shift already started.'); w.status = 'AVAILABLE'; w.position = { x: w.id === 'worker-07' ? 300 : 500, y: w.id === 'worker-07' ? 560 : 350, observedAt: s.meta.clockIso, accuracyLabel: 'Illustrative zone-level marker' }; break;
    case 'BREAK': if (w.status !== 'AVAILABLE') fail('INVALID_TRANSITION', 'Only an available employee can pause.'); if (jobs > 0) fail('HANDOVER_REQUIRED', `${jobs} active assignment(s) need a handover before a break.`); w.status = 'BREAK'; break;
    case 'RESUME': if (w.status !== 'BREAK') fail('INVALID_TRANSITION', 'Not on a break.'); w.status = 'AVAILABLE'; if (w.position) w.position.observedAt = s.meta.clockIso; break;
    case 'END_SHIFT': if (w.status === 'OFF_DUTY') fail('INVALID_TRANSITION', 'Already off duty.'); if (jobs > 0) fail('HANDOVER_REQUIRED', `${jobs} active assignment(s) need a handover before ending the shift.`); w.status = 'OFF_DUTY'; w.position = null; break;
    default: fail('UNKNOWN_ACTION', String(action));
  }
  s.audit.push({ id: `EVENT-${String(s.audit.length + 1).padStart(4, '0')}`, commandId: `shift:${workerId}:${action}:${s.audit.length}`, at: s.meta.clockIso, actorRole: 'employee', workerId, action, nextState: w.status, synthetic: true });
  assertState(s); return s;
}
/** Procurement (guided preview): draft -> approve (owner, revision-bound) -> receive (stock rises only by accepted qty). */
export function draftPurchase(input, { skuId, supplierId, quantity, actor }) {
  if (actor?.role !== 'owner') fail('FORBIDDEN', 'Only the example owner drafts a purchase proposal.');
  const s = clone(input); const sup = s.suppliers.find(x => x.id === supplierId); if (!sup) fail('UNKNOWN_SUPPLIER', supplierId);
  if (!s.inventory[skuId]) fail('UNKNOWN_SKU', skuId); if (!Number.isInteger(quantity) || quantity <= 0) fail('INVALID_QUANTITY', String(quantity));
  const sku = s.catalogue.find(x => x.id === skuId);
  s.purchases.push({ id: `PO-DEMO-${String(s.purchases.length + 1).padStart(2, '0')}`, skuId, supplierId, quantity, assumedUnitCostMinor: Math.round(sku.unitPriceMinor * 0.55), leadDays: sup.illustrativeLeadDays, state: 'DRAFT', revision: 1, approvedRevision: null, receivedQuantity: 0, discrepancy: null, synthetic: true });
  return s;
}
export function approvePurchase(input, { purchaseId, actor }) { if (actor?.role !== 'owner') fail('FORBIDDEN', 'Only the example owner approves.'); const s = clone(input); const p = s.purchases.find(x => x.id === purchaseId); if (!p) fail('UNKNOWN_PURCHASE', purchaseId); if (p.state !== 'DRAFT') fail('INVALID_TRANSITION', 'Only a draft can be approved.'); p.state = 'APPROVED_SIMULATED'; p.approvedRevision = p.revision; return s; }
export function receivePurchase(input, { purchaseId, acceptedQuantity, actor }) {
  if (!['owner', 'team_lead'].includes(actor?.role)) fail('FORBIDDEN', 'Staff record a receipt.');
  const s = clone(input); const p = s.purchases.find(x => x.id === purchaseId); if (!p) fail('UNKNOWN_PURCHASE', purchaseId);
  if (p.state !== 'APPROVED_SIMULATED' || p.approvedRevision !== p.revision) fail('INVALID_TRANSITION', 'Receipt needs an approved current revision.');
  if (!Number.isInteger(acceptedQuantity) || acceptedQuantity < 0 || acceptedQuantity > p.quantity) fail('INVALID_QUANTITY', String(acceptedQuantity));
  s.inventory[p.skuId].onHand += acceptedQuantity; p.receivedQuantity = acceptedQuantity; p.state = acceptedQuantity === p.quantity ? 'RECEIVED' : 'RECEIVED_PARTIAL'; p.discrepancy = acceptedQuantity === p.quantity ? null : `${p.quantity - acceptedQuantity} unit(s) short — discrepancy open`;
  assertState(s); return s;
}
export function openSupportCase(input, { orderId, choice, actor }) {
  const s = clone(input); const o = s.orders.find(x => x.id === orderId); if (!o) fail('UNKNOWN_ORDER', orderId);
  if (actor?.role === 'customer' && actor.customerId !== o.customerId) fail('FORBIDDEN', 'Only the matching sample customer opens this case.');
  const canned = { STATUS: 'Check example status', LATER_WINDOW: 'Request later example window', CANCEL_FLOW: 'View cancellation flow', REDELIVER: 'Propose example redelivery' };
  if (!canned[choice]) fail('INVALID_REASON', 'Choose a canned support option.');
  s.supportCases.push({ id: `CASE-${String(s.supportCases.length + 1).padStart(3, '0')}`, orderId, choice, label: canned[choice], at: s.meta.clockIso, owner: 'Support staff (demo)', state: 'OPEN', changesOrder: false, synthetic: true });
  return s;
}
export function fmtCad(minor) { return 'CAD ' + (minor / 100).toFixed(2); }

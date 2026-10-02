// Presentation layouts, storyboard reveals, lenses and inspector notes for the 26 architecture scenes.
// Semantic nodes/edges come from arch-data/diagram_manifest.json (P01). Everything here is presentation (P01) — not a runtime schema.

export const SECTIONS = [
  { id: 'overview', label: 'Overview', q: 'What is the platform, and what is the proposed difference?', scenes: ['D01', 'D03', 'D04'] },
  { id: 'layers', label: 'Layers', q: 'Where do responsibilities sit?', scenes: ['D02'] },
  { id: 'components', label: 'Components', q: 'What are Operatives and Cells made of, and how are they configured?', scenes: ['D05', 'D06', 'D07', 'D08', 'D23'] },
  { id: 'mesh', label: 'MESH & LINK', q: 'Which relationships, scopes and arrangements exist?', scenes: ['D09', 'D10', 'D11', 'D12'] },
  { id: 'golden', label: 'Golden Cell', q: 'What does a diagnostic trigger change — and what stays protected?', scenes: ['D15', 'D16'] },
  { id: 'protocol', label: 'Protocol', q: 'How are interfaces, profiles, adapters and enforcement composed?', scenes: ['D13', 'D14'] },
  { id: 'lifecycle', label: 'Lifecycle & Evidence', q: 'How does evidence become approved work, and how are effects controlled?', scenes: ['D17', 'D18', 'D19', 'D20', 'D22', 'D25'] },
  { id: 'ecosystem', label: 'Ecosystem', q: 'How do optional cognition, domains, products and independent organizations fit?', scenes: ['D21', 'D24'] },
  { id: 'reference', label: 'Reference', q: 'Where is every recovered term, component and unresolved question?', scenes: ['D26'] }
];

export const TOUR = ['D01', 'D02', 'D05', 'D07', 'D06', 'D03', 'D12', 'D09', 'D11', 'D10', 'D13', 'D14', 'D15', 'D16', 'D17', 'D18', 'D20', 'D19', 'D22', 'D21', 'D23', 'D24', 'D25', 'D04', 'D26'];

export const STAGE = {
  D01: 'MIXED', D02: 'MIXED', D03: 'PROPOSED', D04: 'PROPOSED', D05: 'PROPOSED', D06: 'PROPOSED', D07: 'PROPOSED', D08: 'PROPOSED',
  D09: 'RESEARCH', D10: 'RESEARCH', D11: 'RESEARCH', D12: 'RESEARCH', D13: 'PROPOSED', D14: 'PROPOSED', D15: 'RESEARCH', D16: 'RESEARCH',
  D17: 'PLANNING', D18: 'PLANNING', D19: 'PROPOSED', D20: 'PROPOSED', D21: 'RESEARCH', D22: 'RESEARCH', D23: 'PROPOSED', D24: 'RESEARCH', D25: 'PLANNING', D26: 'MIXED'
};

export const KIND = {
  component: { label: 'Component / responsibility', desc: 'A named responsibility, role or capability. Not a claim of a separate deployed service.' },
  record: { label: 'Record', desc: 'A versioned, inspectable object — definition, snapshot, contract or ledger entry. Records do not act.' },
  port: { label: 'Typed port', desc: 'A declared input or output contract at a boundary. What crosses must match the port.' },
  gate: { label: 'Policy gate', desc: 'A deterministic enforcement point. It checks current authority and evidence; it does not decide on its own.' },
  state: { label: 'Lifecycle state', desc: 'A named state in an explanatory lifecycle. Not a complete runtime specification.' },
  boundary: { label: 'Trust boundary', desc: 'A separately owned and governed zone. Nothing crosses it without an explicit contract.' },
  actor: { label: 'Human actor', desc: 'A person with accountable authority. Human decisions are recorded, not inferred.' },
  note: { label: 'Note', desc: 'An explanatory statement about the diagram, not an object in the system.' }
};

// col/row grid → px. x = 40 + col*190, y = 40 + row*100. Canvas 1000×540.
export const LAYOUT = {
  D01: {
    pos: { human: [0, 2], pi: [1, 2], mission: [2, 1], org: [3, 1], mesh: [3, 3], tools: [4, 3], evidence: [2, 3], product: [4, 1] },
    reveal: [['human', 'pi', 'mission', 'evidence'], ['org', 'mesh', 'tools'], ['product']],
    stepStage: ['PLANNING', 'PROPOSED', 'RESEARCH'],
    jump: { pi: 'D18', mission: 'D18', org: 'D07', mesh: 'D09', tools: 'D20', evidence: 'D17', product: 'D24', human: 'D25' },
    notes: {
      human: 'The founder or operator governs intent and makes the accountable decisions. Nothing on this page approves itself.',
      pi: 'Project Intelligence governs selected intent, evidence, decisions and immutable Mission plans (CMP-02). It does not replace specialist sources.',
      mission: 'A bounded Mission contract plus an exact, immutable DAG revision (CMP-08). Planning ends here in release one.',
      org: 'A proposed bounded Cell composition of Operatives and deterministic Workers (CMP-15–17). Proposed runtime, not release one.',
      mesh: 'Scoped typed relationships and views plus Link Contracts (CMP-18, CMP-21). Not a scheduler, database or permission grant.',
      tools: 'Capabilities, tools and sources reachable only through declared, authorised boundaries (CMP-11, CMP-20).',
      evidence: 'Candidate outputs, evidence and acceptance records. Evidence supports review; it is not auto-approval.',
      product: 'Later domain platforms (CELL-R // OS, CELL-Q // OS, CELL-SEC // OS) and independent organizations relate through explicit contracts (D24).'
    }
  },
  D03: {
    pos: { identities: [2, 0], people: [0, 2], dag: [1, 2], comm: [2, 2], authority: [3, 2], knowledge: [4, 2] },
    reveal: [['identities'], ['people', 'dag', 'comm', 'authority', 'knowledge'], ['knowledge']],
    lenses: [
      { k: 'people', label: 'Organization / membership', nodes: ['identities', 'people'], note: 'Who belongs to which Cell or team, in which role. Membership is a record; it is not access permission.', style: 'solid' },
      { k: 'dag', label: 'Work dependencies', nodes: ['identities', 'dag'], note: 'Which output another DAG node needs. Bound to an exact DAG revision. Changing a message route does not change this.', style: 'solid' },
      { k: 'comm', label: 'Communication', nodes: ['identities', 'comm'], note: 'Who may exchange messages with whom under a Link Contract. Some dependencies never carry a message.', style: 'dash' },
      { k: 'authority', label: 'Authority / delegation', nodes: ['identities', 'authority'], note: 'Who may authorise what, within which ceiling. A connection never confers authority by itself.', style: 'dot' },
      { k: 'knowledge', label: 'Evidence / knowledge', nodes: ['identities', 'knowledge'], note: 'Which claims are supported or contradicted by which source versions. Adding a context edge leaves the DAG revision unchanged.', style: 'dash' }
    ],
    notes: {
      identities: 'Stable participant, work, claim and scope identifiers shared across every graph so the same object can be found in each view.',
      people: 'Organization and membership graph: participants, teams, Cells and roles.',
      dag: 'Work-dependency graph: the exact approved Mission DAG revision.',
      comm: 'Communication topology: which endpoints may exchange messages.',
      authority: 'Authority and delegation graph: principals, grants, scopes and ceilings.',
      knowledge: 'Evidence and knowledge graph: claims, sources, support and contradiction.'
    }
  },
  D05: {
    pos: { op: [2, 2], def: [0, 2], model: [0, 4], ctx: [2, 4], cap: [1, 0], grant: [3, 0], lease: [4, 2], run: [4, 4] },
    reveal: [['op', 'def'], ['model', 'cap', 'grant', 'lease', 'ctx'], ['run']],
    lenses: [
      { k: 'owns', label: 'Owns', nodes: ['op', 'run'], note: 'Owns: its identity and local lifecycle state under the chosen ownership contract. That is all.' },
      { k: 'refs', label: 'References', nodes: ['op', 'def', 'model', 'cap', 'grant'], note: 'References: a definition revision, eligible model profiles, capability contracts and governed authority records. Referenced, not contained.' },
      { k: 'leases', label: 'Leases', nodes: ['op', 'lease'], note: 'Leases: permitted use of owned resources within limits and expiry. A revoked lease blocks use without deleting the worker.', variant: 'revoked' },
      { k: 'loads', label: 'Loads', nodes: ['op', 'ctx'], note: 'Loads: the exact active ContextSnapshot for the current step — selected, versioned, inspectable.' }
    ],
    notes: {
      op: 'A proposed configured computational worker: a versioned definition bound to actual work (CMP-15). Not a model, and not the same object as its definition, session or run.',
      def: 'The exact definition revision the instance was created from: model policy, capabilities, instructions, context policy, I/O contracts, limits.',
      model: 'Eligible model or cognition policy. A model list is not a claim of demonstrated expertise.',
      ctx: 'The exact ContextSnapshot loaded for this step, assembled by the Context Compiler (CMP-26).',
      cap: 'Versioned capability contracts the definition requires (CMP-11). Bounded callable behaviour, not open tool access.',
      grant: 'Current authority references the instance is subject to. It cannot issue its own grants.',
      lease: 'Resource leases held within declared limits (CMP-12). Separate from graph connectivity.',
      run: 'The Run the instance participates in, with its evidence obligations. Attempts are recorded separately (see D06).'
    }
  },
  D06: {
    pos: { def: [0, 2], ver: [1, 2], a: [2, 1], b: [2, 3], session: [3, 1], run: [4, 1], attempt: [4, 3], artifact: [3, 4] },
    reveal: [['def', 'ver', 'a', 'b'], ['session', 'run', 'attempt'], ['artifact']],
    notes: {
      def: 'The reusable definition. It is revised into versions; it never runs directly.',
      ver: 'An immutable version with a resolved dependency lock. Evidence stays bound to the exact version it was produced under.',
      a: 'Instance A, instantiated from the version. Its approval and assurance are its own.',
      b: 'Instance B, from the same version. Similar configuration does not inherit A’s approval, authority or assurance.',
      session: 'Session context associated with an instance over a bounded period.',
      run: 'A Run or logical action. One run may have several attempts.',
      attempt: 'One attempt at a run, with its own ID. Retries never overwrite earlier attempts.',
      artifact: 'The produced artifact with its verification record. Verification is separate from production.'
    }
  },
  D07: {
    pos: { input: [0, 2], producer: [1, 2], validator: [2, 2], reviewer: [3, 2], out: [4, 2], contract: [2, 0], snapshot: [1, 4] },
    groups: [{ label: 'CELL BOUNDARY · declared interface', x: 220, y: 20, w: 560, h: 500 }],
    reveal: [['input', 'out'], ['producer', 'validator', 'reviewer', 'contract', 'snapshot'], ['validator']],
    lenses: [
      { k: 'ok', label: 'Valid output', nodes: ['input', 'producer', 'validator', 'reviewer', 'out'], note: 'The producer’s candidate passes the deterministic check, the reviewer supplies an assessment, and a typed output leaves with evidence. Acceptance remains a separate decision.' },
      { k: 'fail', label: 'Invalid output', nodes: ['input', 'producer', 'validator', 'contract'], note: 'The deterministic Worker rejects the candidate. Failure follows the Cell contract’s failure policy — it does not reach the success port.', variant: 'blocked' }
    ],
    notes: {
      input: 'Typed input port: the declared input contract an external caller sees.',
      producer: 'Producer Operative: drafts the candidate artifact within its scope.',
      validator: 'Deterministic Worker (CMP-16): a schema validator with explicit contracts and no LLM. A first-class member, not a lesser Operative.',
      reviewer: 'Reviewer / Guardian role: supplies review evidence. A reviewer role alone does not prove independent assurance.',
      contract: 'Cell contract and limits: members, ports, resources, coordination, lifecycle, acceptance and failure policy.',
      snapshot: 'Context and resource references the members are permitted to use.',
      out: 'Typed output port plus evidence. Whether the output is accepted is decided elsewhere.'
    }
  },
  D09: {
    pos: { op: [0, 4], om: [0, 2], records: [0, 0], cell: [1, 4], team: [2, 3], org: [3, 2], external: [4, 3] },
    groups: [
      { label: 'OS-MESH · organization scope', x: 22, y: 222, w: 780, h: 300, tone: 'c' },
      { label: 'T-MESH · temporary Mission / team scope', x: 22, y: 322, w: 590, h: 200, tone: 'b' },
      { label: 'C-MESH · Cell-local scope', x: 22, y: 422, w: 400, h: 100, tone: 'a' }
    ],
    reveal: [['records', 'om', 'op'], ['cell', 'team', 'org'], ['external']],
    lenses: [
      { k: 'o', label: 'O-MESH (candidate)', nodes: ['records', 'om', 'op'], note: 'Unresolved. Three alternatives: plain configuration references; a permission-filtered scoped view; dedicated local graph state. No per-worker database is assumed.' },
      { k: 'c', label: 'C-MESH', nodes: ['op', 'cell'], note: 'Historical Cell-local scope. Some older wording also includes direct links between Cells — the variation is preserved, not resolved here.' },
      { k: 't', label: 'T-MESH', nodes: ['cell', 'team'], note: 'Temporary Mission or team scope: cross-Cell relationships that exist for the life of the Mission.' },
      { k: 'os', label: 'OS-MESH', nodes: ['team', 'org'], note: 'Organization scope. Federation with another organization is optional and explicit, never implicit.' },
      { k: 'x', label: 'Cross-organization', nodes: ['org', 'external'], note: 'A separate organization retains its own authority. No inherited root; only an explicit federation contract.', variant: 'boundary' }
    ],
    notes: {
      op: 'An Operative’s own references — what it can see and use.',
      om: 'O-MESH candidate view (CMP-19): whether the term earns a distinct abstraction is an open research question.',
      records: 'Authoritative records in their owning systems. Referenced by views, not copied by default.',
      cell: 'Cell-local C-MESH: coordination inside one Cell.',
      team: 'Mission / team T-MESH: temporary cross-Cell relationships.',
      org: 'Organization OS-MESH: organization-scoped relationships (CMP-20).',
      external: 'A separately governed organization (CMP-47). Cooperation only through explicit contracts.'
    }
  },
  D11: {
    pos: { records: [2, 0], membership: [0, 2], work: [1, 2], comm: [2, 2], knowledge: [3, 2], cap: [4, 2], authority: [0.5, 4], resources: [1.7, 4], time: [2.9, 4] },
    reveal: [['records', 'membership'], ['work', 'comm', 'knowledge', 'cap'], ['authority', 'resources', 'time']],
    multi: true,
    lenses: [
      { k: 'membership', label: 'Organization', nodes: ['records', 'membership'], style: 'solid' },
      { k: 'work', label: 'Mission / work', nodes: ['records', 'work'], style: 'solid' },
      { k: 'comm', label: 'Communication', nodes: ['records', 'comm'], style: 'dash' },
      { k: 'knowledge', label: 'Knowledge / evidence', nodes: ['records', 'knowledge'], style: 'dash' },
      { k: 'cap', label: 'Capability discovery', nodes: ['records', 'cap'], style: 'dot' },
      { k: 'authority', label: 'Authority / trust', nodes: ['records', 'authority'], style: 'dot' },
      { k: 'resources', label: 'Resources / health', nodes: ['records', 'resources'], style: 'solid' },
      { k: 'time', label: 'Temporal lineage', nodes: ['records', 'time'], style: 'dash', variant: 'stale' }
    ],
    notes: {
      records: 'Canonical records stay in their owning systems. Every overlay is a governed, permissioned projection over them — never a replacement.',
      membership: 'Organization / membership overlay.', work: 'Mission / work overlay — reads the approved DAG revision; cannot rewrite it.',
      comm: 'Communication overlay.', knowledge: 'Knowledge / evidence overlay — claims, sources, support, contradiction. Not memory, not a search index, not one “knowledge cloud”.',
      cap: 'Capability discovery overlay. Discovery is not admission and an advertisement is not a grant.',
      authority: 'Authority / trust overlay — current grants, scopes, ceilings.', resources: 'Resources, health and cost overlay.',
      time: 'Temporal / version lineage overlay. A projection can be stale; its refresh time and unknown state must be visible.'
    }
  },
  D12: {
    pos: { a: [0, 2], contract: [2, 2], b: [4, 2], schema: [1, 0], policy: [3, 0], delivery: [1, 4], failure: [3, 4] },
    reveal: [['a', 'contract', 'b'], ['schema', 'policy', 'delivery'], ['failure']],
    notes: {
      a: 'Source endpoint: a declared port on an Operative, Cell or boundary.',
      contract: 'The versioned Link Contract (CMP-21): a typed relationship. Some links carry messages; others are records or constraints. The type decides.',
      b: 'Target endpoint: the exact bound port. Binding is explicit.',
      schema: 'Selected profile and payload schema describing what information the relationship carries.',
      policy: 'Scope and current grants constraining release and use. A Link never confers access on its own.',
      delivery: 'Delivery, ordering, idempotency, timeout and duplicate rules — relevant only for message-carrying links.',
      failure: 'Failure, revocation and evidence obligations: who recovers, what is recorded.'
    }
  },
  D13: {
    pos: { core: [0, 2], profiles: [1.3, 2], ports: [2.6, 0.5], adapters: [2.6, 3.2], binding: [3.6, 3.2], external: [4.2, 1.2], config: [0, 0] },
    groups: [{ label: 'EXTERNAL BOUNDARY · explicitly supported adapters only', x: 720, y: 20, w: 265, h: 400, tone: 'x' }],
    reveal: [['core'], ['profiles', 'ports', 'config'], ['adapters', 'binding', 'external']],
    lenses: [
      { k: 'report', label: 'Evidence-report profile', nodes: ['core', 'profiles', 'ports', 'config'], note: 'Fictional profile: permitted source reference → candidate claim handoff → artifact review request → review result. Domain fields: source version, claim ID, support/contradiction, review criteria. No automatic acceptance or publication.' },
      { k: 'support', label: 'Support-draft profile', nodes: ['core', 'profiles', 'ports', 'config'], note: 'Fictional profile: permitted case snapshot → draft handoff → human review request → review result. Draft only — customer communication is a separate external action that is not performed.' },
      { k: 'swap', label: 'Replace an adapter', nodes: ['profiles', 'adapters', 'binding', 'external'], note: 'A provider adapter is replaced. Identity, scope, lineage, failure and evidence obligations from the core and profile are unchanged. The new adapter still needs implemented, tested behaviour.', variant: 'swap' }
    ],
    notes: {
      core: 'Shared semantic Core Envelope: identity, scope, version references, correlation/causation, provenance, typed failure. Small by design.',
      profiles: 'Versioned interaction and domain profiles: operation and payload requirements live here, not in one universal payload.',
      ports: 'Operative and Cell port contracts that select applicable profile behaviour.',
      adapters: 'Provider / protocol adapters that map native semantics explicitly. MCP and A2A belong here as optional external protocol adapters — not raw transports, not adopted CELL standards.',
      binding: 'Supported bindings: local call, HTTP, file, messaging. A binding is not a profile.',
      external: 'External tools, APIs, data and agents. “Agnostic” means an explicit compatible adapter exists — not automatic integration with everything.',
      config: 'Product-specific selected configuration: chooses compatible profile versions. Configuration selects implemented capability; it cannot implement one by naming it.'
    }
  },
  D14: {
    pos: { sender: [0, 1], release: [1, 1], fabric: [2, 1], receiver: [3, 1], dispatch: [4, 1], worker: [4, 3], ledger: [2, 3], deny: [0, 3] },
    reveal: [['sender', 'release'], ['fabric', 'receiver'], ['dispatch', 'worker', 'deny'], ['ledger']],
    seq: true,
    lenses: [
      { k: 'ok', label: 'Normal', nodes: ['sender', 'release', 'fabric', 'receiver', 'dispatch', 'worker', 'ledger'], note: 'Bind → authorise release → deliver → validate → recheck action authority → invoke → record. Delivery, processing, external effect and accepted output are four different states.', pulse: true },
      { k: 'expired', label: 'Expired grant', nodes: ['sender', 'release', 'fabric', 'receiver', 'dispatch', 'deny'], note: 'Delivery succeeded, but the grant expired before dispatch. The recheck denies; nothing is invoked. A pinned version does not override a current deny.', variant: 'blocked', block: 'dispatch' },
      { k: 'schema', label: 'Incompatible schema', nodes: ['sender', 'release', 'fabric', 'receiver', 'deny'], note: 'Receipt validation fails on profile version. The request is held; the sender receives a typed failure, not silence.', variant: 'blocked', block: 'receiver' },
      { k: 'privacy', label: 'Release denied', nodes: ['sender', 'release', 'deny'], note: 'Sensitive data is checked before the crossing. Denied here, it never reaches the fabric. A bus placed before this gate would leak.', variant: 'blocked', block: 'release' },
      { k: 'dup', label: 'Duplicate delivery', nodes: ['sender', 'release', 'fabric', 'receiver', 'dispatch', 'ledger'], note: 'The same logical operation arrives twice. Operation identity is retained; the second delivery is recognised and not applied again. Duplicates may occur — exactly-once external effects are not promised.', variant: 'dup' },
      { k: 'timeout', label: 'Timeout — unknown effect', nodes: ['sender', 'release', 'fabric', 'receiver', 'dispatch', 'worker', 'deny'], note: 'The acknowledgement is lost. The effect may or may not have happened. State: uncertain, requiring reconciliation — not presumed harmless, not rolled back by magic.', variant: 'unknown', block: 'ledger' }
    ],
    notes: {
      sender: 'Sender: an Operative or Cell port making a profile-bound request.',
      release: 'Gate 1 — authorise data release before the boundary. Scope and privacy are checked before any crossing.',
      fabric: 'Fabric or direct binding (CMP-22): implements declared link semantics beneath control authority. Transport creates no permission.',
      receiver: 'Receive and validate: identity, scope, profile, version.',
      dispatch: 'Gate 2 — recheck current action authority before any effect. A capability advertisement is not a grant.',
      worker: 'The authorised handler performing the permitted action.',
      ledger: 'Result and audit ledger: typed result and effect state. Delivery ≠ processing ≠ effect ≠ accepted output.',
      deny: 'Deny / hold / reconcile: the explicit non-success states. Recovery has an owner.'
    }
  },
  D15: {
    pos: { check: [0, 2], observation: [1, 2], policy: [2, 2], allowed: [3, 1], proposal: [3, 3], approval: [4, 3], change: [4, 1], hold: [2, 4] },
    gold: ['check'],
    reveal: [['check'], ['observation'], ['policy'], ['allowed', 'proposal', 'approval', 'hold'], ['change']],
    lenses: [
      { k: 'valid', label: 'Valid observation', nodes: ['check', 'observation', 'policy', 'allowed', 'change'], note: 'DEMO-OBS-01: the summary lacks the timestamp field definition (SOURCE-A-v1). Already permitted SOURCE-B-v1 enters active context. DAG revision stays DEMO-DAG-v1. No new access.', pulse: true },
      { k: 'protected', label: 'Protected change', nodes: ['check', 'observation', 'policy', 'proposal', 'approval', 'hold'], note: 'An additional external investigation would change protected fields. A proposal is created and the work pauses: WAITING_FOR_SEPARATE_DECISION. The demo does not perform the approval.', variant: 'paused', block: 'approval' },
      { k: 'stale', label: 'Stale source', nodes: ['check', 'observation', 'policy', 'hold'], note: 'The evidence reference is stale. Selection is held and the stale evidence is shown. Nothing changes.', variant: 'blocked', block: 'policy' },
      { k: 'dup', label: 'Duplicate observation', nodes: ['check', 'observation', 'policy', 'hold'], note: 'The same logical observation arrives again. The delta is not applied twice; the duplicate is recorded.', variant: 'dup', block: 'policy' },
      { k: 'revoked', label: 'Revoked scope', nodes: ['check', 'observation', 'policy', 'hold'], note: 'Context-selection scope has been revoked. Release is blocked and an authorised correction is requested.', variant: 'blocked', block: 'policy' },
      { k: 'missing', label: 'Missing evidence', nodes: ['check', 'observation', 'hold'], note: 'The observation has no supporting evidence reference. The result stays unsupported; it is not marked success.', variant: 'blocked', block: 'observation' }
    ],
    notes: {
      check: 'The diagnostic. It may be a deterministic check, a task, an Operative or a Cell — no new primitive is required. Gold marks the diagnostic only; it is not a certification.',
      observation: 'A typed observation with evidence references (DEMO-OBS-01 → SOURCE-A-v1). Scope, time and evidence are explicit.',
      policy: 'TriggerPolicy evaluation: validity, applicability, current permission and protected fields. Deterministic.',
      allowed: 'A transition already authorised within the envelope — e.g. adding an already permitted source to active context.',
      proposal: 'A protected-revision candidate: the change would touch objective, acceptance criteria, authority ceiling or the approved DAG revision.',
      approval: 'The exact-version decision by the accountable human. Not performed in this demo.',
      change: 'The new context or configuration snapshot with a before/after record and reason (see D16).',
      hold: 'Invalid, stale, duplicate, revoked or unsupported: hold. Nothing is applied.'
    }
  },
  D16: {
    pos: { before: [0, 2], delta: [1, 2], context: [2, 0], members: [2, 2], model: [2, 4], protected: [3, 1], review: [3, 3], after: [4, 3] },
    reveal: [['before', 'delta', 'context'], ['members', 'model', 'protected', 'review'], ['after']],
    lenses: [
      { k: 'context', label: 'Context', nodes: ['before', 'delta', 'context', 'review', 'after'], diff: { before: ['SOURCE-A-v1'], after: ['SOURCE-A-v1', 'SOURCE-B-v1 (added)'], locked: ['DAG revision: DEMO-DAG-v1 → DEMO-DAG-v1 (unchanged)'] }, note: 'Context tab: one permitted reference added. The DAG hash is unchanged. If a reference were pruned, it would stay inspectable in retained evidence.' },
      { k: 'comm', label: 'Communication', nodes: ['before', 'delta', 'members', 'review'], diff: { before: ['research → review', 'review → assembly'], after: ['research → review', 'review → assembly'], locked: ['No topology change in this example'] }, note: 'Communication tab: no change in the fixture.' },
      { k: 'members', label: 'Membership', nodes: ['before', 'delta', 'members', 'review'], diff: { before: ['research', 'review', 'assembly'], after: ['research', 'review', 'assembly'], locked: ['Membership unchanged; a membership change is a separate change type'] }, note: 'Membership tab: unchanged. Changing team membership can never widen authority for a child.' },
      { k: 'resources', label: 'Resources', nodes: ['before', 'delta', 'model', 'review'], diff: { before: ['Not measured'], after: ['Not measured'], locked: ['Budget ceiling: unchanged'] }, note: 'Resources tab: allocation values are not measured in this synthetic fixture.' },
      { k: 'model', label: 'Cognition', nodes: ['before', 'delta', 'model', 'review'], diff: { before: ['single model'], after: ['single model'], locked: ['Model routing unchanged'] }, note: 'Cognition tab: unchanged. Model selection is a separate, bounded change type.' },
      { k: 'dag', label: 'DAG (protected)', nodes: ['before', 'delta', 'protected', 'review'], diff: { before: ['DEMO-DAG-v1'], after: ['DEMO-DAG-v1 — proposal pending'], locked: ['objective', 'acceptance_criteria', 'authority_ceiling', 'approved_dag_revision'] }, note: 'DAG tab: a protected field. Any change requires a new exact-version approval — the review gate pauses here.', variant: 'paused' }
    ],
    notes: {
      before: 'Before: the exact state snapshot (context refs, membership, DAG revision).',
      delta: 'The proposed bounded delta, supported by an observation.',
      context: 'Context references — a possible working-set change.',
      members: 'Membership and topology — a separate change type.',
      model: 'Model selection and resource allocation — a separate change type.',
      protected: 'Protected: objective, acceptance criteria, authority ceiling, approved DAG revision. Hierarchy cannot unlock these.',
      review: 'Policy and approval check: validates the effect scope of the delta against locked fields.',
      after: 'After: a new snapshot (allowed change) or a new revision (only after approval).'
    }
  },
  D17: {
    pos: { raw: [0, 1], integrity: [1, 1], candidate: [2, 1], review: [3, 1], accepted: [4, 1], select: [4, 3], snapshot: [2, 3], archive: [0, 3] },
    reveal: [['raw', 'integrity', 'archive'], ['candidate', 'review', 'accepted'], ['select', 'snapshot']],
    lenses: [
      { k: 'trace', label: 'Trace a claim', nodes: ['raw', 'integrity', 'candidate', 'review', 'accepted'], note: 'A claim traces back to its source version, its integrity check, its assessment and the founder disposition. A hash match proves bytes, not truth.' },
      { k: 'snap', label: 'Inspect the snapshot', nodes: ['accepted', 'select', 'snapshot', 'archive'], note: 'A ContextSnapshot lists what was included, what was omitted, what is stale and what contradicts. Search indexes are replaceable views, not the record.' },
      { k: 'contra', label: 'Contradiction', nodes: ['candidate', 'review'], note: 'Two sources disagree. The contradiction stays visible through review; neither claim is silently promoted.', variant: 'paused', block: 'review' }
    ],
    notes: {
      raw: 'Raw source snapshot: unreviewed bytes with identity and integrity metadata.',
      integrity: 'Integrity / quarantine gate (CMP-05): declared bytes and scope. Byte integrity is one gate — not a truth check.',
      candidate: 'Candidate interpretation from parsing. Still unaccepted.',
      review: 'Claim support and founder review (CMP-06): support, freshness, authority and acceptance stay separate.',
      accepted: 'Accepted objects with lineage: an explicit disposition, traceable to source versions.',
      select: 'Context Compiler selection (CMP-26): permitted evidence chosen for one task or step.',
      snapshot: 'The exact ContextSnapshot: included, omitted, stale and contradictory material remain inspectable.',
      archive: 'Retained versions and evidence according to policy (CMP-43). Pruning context does not delete sources.'
    }
  },
  D18: {
    pos: { intent: [0, 1], sources: [1, 1], claims: [2, 1], decisions: [3, 1], mission: [4, 1], dag: [4, 3], check: [2.5, 3], planning_end: [0.6, 3] },
    reveal: [['intent', 'sources', 'claims'], ['decisions', 'mission', 'dag'], ['check', 'planning_end']],
    lenses: [
      { k: 'path', label: 'Planning path', nodes: ['intent', 'sources', 'claims', 'decisions', 'mission', 'dag', 'check', 'planning_end'], note: 'Initiative intent → selected sources → candidate claims → founder decisions → bounded Mission → exact DAG revision → compile/load/validate + non-mutating dry run → planning endpoint.' },
      { k: 'gap', label: 'Missing lineage', nodes: ['sources', 'claims', 'decisions'], note: 'A claim has no material lineage or an unresolved contradiction. The path pauses at review; it does not proceed to a Mission.', variant: 'paused', block: 'decisions' },
      { k: 'receipt', label: 'Dry-run receipt', nodes: ['dag', 'check', 'planning_end'], note: 'The endpoint is a dry-run receipt, not a deployed product. Internal governance records are written; operational mutations are outside this path.' }
    ],
    notes: {
      intent: 'Initiative intent and permitted envelope: bounds source selection.',
      sources: 'Selected source snapshots (versioned).',
      claims: 'Candidate claims and requirements, with contradictions kept visible.',
      decisions: 'Founder dispositions: accept, reject, defer — recorded.',
      mission: 'The bounded Mission contract governing scope.',
      dag: 'The exact immutable DAG revision: compiled as a candidate, approved as an exact version.',
      check: 'Compile / load / validate / dry-run gate: non-mutating validation.',
      planning_end: 'Planning endpoint — no operational effects. This is the founder-defined release-one boundary, not a claim the current build has passed it.'
    }
  },
  D19: {
    pos: { owner: [0, 0], admit: [0, 2], run: [1.5, 2], review: [1.5, 0], success: [3.5, 2], reconcile: [3.5, 0], cancel: [1.5, 4], failed: [3.5, 4] },
    reveal: [['owner', 'admit', 'run', 'review', 'success'], ['reconcile'], ['cancel', 'failed']],
    lenses: [
      { k: 'ok', label: 'Success path', nodes: ['owner', 'admit', 'run', 'review', 'success'], note: 'Admitted → running → (review gate) → succeeded with required evidence. Output acceptance depends on evidence, not on task closure.', pulse: true },
      { k: 'lost', label: 'Lost acknowledgement', nodes: ['run', 'reconcile', 'review'], note: 'A timeout leaves the effect unknown. State: suspended / reconcile. Not rolled back automatically; a recovery decision is made at review.', variant: 'unknown', block: 'reconcile' },
      { k: 'cancel', label: 'Cancellation', nodes: ['run', 'cancel', 'failed'], note: 'Cancel request → cleanup → effects reconciled or stopped. Attempts are preserved. The lifecycle owner records the decision.', variant: 'blocked', block: 'cancel' }
    ],
    notes: {
      owner: 'One authoritative lifecycle owner (CMP-13). Kernel, ORCA, schedulers and formation are not rival dispatchers.',
      admit: 'Admitted: permitted dispatch after admission checks.', run: 'Running.', review: 'Awaiting review: a human or evidence gate. Resumes only with current authorisation.',
      success: 'Succeeded with required evidence.', cancel: 'Cancelling: cleanup with preserved attempts.',
      reconcile: 'Suspended / reconcile unknown effect: a timeout does not prove that nothing happened.',
      failed: 'Failed / cancelled: effects reconciled or stopped, recorded.'
    }
  },
  D20: {
    pos: { mission: [0, 0], owner: [0, 2], grant: [0, 4], gate: [1.5, 2], child: [2.8, 2], resource: [4, 2], revoke: [1.5, 4] },
    reveal: [['mission', 'owner', 'grant', 'gate'], ['child', 'resource'], ['revoke']],
    lenses: [
      { k: 'envelope', label: 'Parent envelope', nodes: ['mission', 'owner', 'grant', 'gate'], note: 'The parent envelope is the intersection of approved scope, resource-owner conditions and the current grant. Qualitative indicators only — no synthetic numbers.' },
      { k: 'child', label: 'Bounded child', nodes: ['gate', 'child', 'resource'], note: 'A child allocation can only be narrower than the parent. Totals stay within declared limits. Quotas, grants and leases are separate records.' },
      { k: 'revoke', label: 'Revocation', nodes: ['grant', 'revoke', 'gate', 'child'], note: 'The grant is revoked. New dispatch is blocked at the gate; existing recovery obligations remain. Membership and pinned configuration do not override the deny.', variant: 'blocked', block: 'gate' }
    ],
    notes: {
      mission: 'Approved scope and limits: the scope ceiling.', owner: 'Resource-owner conditions: the owner’s rules for use.',
      grant: 'The current scoped grant: permission as of now, with expiry.', gate: 'Applicable constraints and current deny: the enforcement point (CMP-09).',
      child: 'A bounded child allocation — narrower than the parent (CMP-36 lineage).', resource: 'A tool, compute or data resource under lease (CMP-12).',
      revoke: 'Expiry or revocation: blocks future release and dispatch.'
    }
  },
  D21: {
    pos: { request: [0, 2], route: [1, 2], single: [2, 0], sequential: [2, 2], ensemble: [2, 4], result: [3, 2], eval: [4, 1], decision: [4, 3] },
    reveal: [['request', 'route', 'single', 'result'], ['sequential', 'ensemble'], ['eval', 'decision']],
    lenses: [
      { k: 'single', label: 'Single model', nodes: ['request', 'route', 'single', 'result', 'eval', 'decision'], note: 'The simplest cognition choice. Often sufficient; the comparison baseline for any ensemble claim.' },
      { k: 'seq', label: 'Sequential critique', nodes: ['request', 'route', 'sequential', 'result', 'eval', 'decision'], note: 'Draft → critique → refine, under a stopping rule. Extra coordination steps and cost; benefit not measured here.' },
      { k: 'ens', label: 'Heterogeneous ensemble (SIHRE candidate)', nodes: ['request', 'route', 'ensemble', 'result', 'eval', 'decision'], note: 'Several models reason; disagreement and abstention are retained, not collapsed into a confidence badge. SIHRE (CMP-34) is a research project — not a source-complete algorithm here, not a benchmark, not a prerequisite for CELL.', variant: 'research' }
    ],
    notes: {
      request: 'A bounded reasoning request within limits.', route: 'The selected cognition policy: which option applies to this step.',
      single: 'Single model.', sequential: 'Sequential critique / refinement — an optional pattern.',
      ensemble: 'Heterogeneous ensemble candidate — optional research pattern. Correlated errors, calibration, stopping and abstention are open questions.',
      result: 'The candidate result with its uncertainty and any disagreement retained.',
      eval: 'Separate evaluation testing the exact output (CMP-31). Evidence, not self-promotion.',
      decision: 'The accountable acceptance decision. Not made by the model.'
    }
  },
  D22: {
    pos: { base: [0, 1], candidate: [1, 1], lab: [2, 1], holdout: [3, 1], receipt: [4, 1], approve: [4, 3], version: [3, 3], observed: [1.5, 3] },
    groups: [{ label: 'OUTSIDE PRODUCTION · experiment loop', x: 220, y: 20, w: 560, h: 200, tone: 'b' }],
    reveal: [['base', 'candidate', 'lab', 'holdout'], ['receipt'], ['approve', 'version', 'observed']],
    lenses: [
      { k: 'freeze', label: 'Freeze', nodes: ['base', 'candidate'], note: 'Objectives, limits and the evaluator are frozen before search begins. An optimizer cannot rewrite success criteria.' },
      { k: 'fail', label: 'Failing candidate', nodes: ['candidate', 'lab', 'holdout', 'receipt'], note: 'The candidate fails the protected evaluation. The receipt records the failure; the candidate stays rejected.', variant: 'blocked', block: 'holdout' },
      { k: 'pass', label: 'Passing, not promoted', nodes: ['candidate', 'lab', 'holdout', 'receipt', 'approve'], note: 'The candidate passes but waits for independent review and an authorised promotion. Simulation success (Shadow Twin, CMP-35) is not observed production performance.', variant: 'paused', block: 'approve' }
    ],
    notes: {
      base: 'Frozen baseline and objectives: defines the allowed search space.', candidate: 'A tunable configuration candidate — only approved tunable fields.',
      lab: 'Evolution Chamber / experiment (CMP-33): evaluates within budget. Shadow Twin simulation (CMP-35) is one option.',
      holdout: 'Protected evaluation beyond producer control (Crucible / Measurement Firewall, CMP-31).',
      receipt: 'Assurance receipt: evidence plus limitations, failures and uncertainty.',
      approve: 'Independent review and authorised promotion. Never self-promotion.',
      version: 'A new version — and the rollback target.', observed: 'Observed outcomes / doctrine proposal (CMP-37): a future proposal only, not an automatic policy change.'
    }
  },
  D23: {
    pos: { intent: [0, 0], dag: [1.2, 0], definitions: [0, 2], implementation: [0, 4], resolver: [1.5, 3], lock: [2.7, 3], image: [4, 3], review: [3, 1] },
    reveal: [['intent', 'dag'], ['definitions', 'implementation', 'resolver', 'lock', 'image'], ['review']],
    lenses: [
      { k: 'plan', label: 'Plan compilation', nodes: ['intent', 'dag', 'review'], note: 'Accepted intent compiles into a Mission DAG revision, validated separately from any organization packaging.' },
      { k: 'org', label: 'Organization packaging', nodes: ['definitions', 'implementation', 'resolver', 'lock', 'image', 'review'], note: 'A thin resolver pins approved definitions and available implementations into a lock, then a Cell Image candidate. Artifact validation is separate from plan validation.' },
      { k: 'missing', label: 'Unimplemented capability', nodes: ['definitions', 'implementation', 'resolver'], note: 'A definition names a capability with no implemented handler. Resolution reports UNSUPPORTED. Configuration cannot implement an algorithm by naming it.', variant: 'blocked', block: 'resolver' },
      { k: 'alias', label: 'Alias drawer', nodes: ['lock', 'image'], note: 'Historical labels — Blueprint, Genome, ConfigGenome, Org-IR-lite, Profile, Cell Image — overlap and are not all approved equivalents (CMP-29). Genesis (CMP-36) and Foundry/MESA (CMP-38) are optional later reuse/composition proposals, not mandatory steps. Rust vs Python is an open engineering decision.' }
    ],
    notes: {
      intent: 'Accepted intent / requirements.', dag: 'Mission DAG revision produced by planning compilation.',
      definitions: 'Approved reusable definitions (CMP-30).', implementation: 'Implemented tools, adapters and algorithms actually available (CMP-51).',
      resolver: 'Thin resolver / compiler: pins references; reports unsupported capabilities instead of inventing them.',
      lock: 'Resolved configuration and dependency lock.', image: 'Cell Image candidate: the packaged composition.',
      review: 'Validation and approval gate — plan validation and artifact validation are separate.'
    }
  },
  D24: {
    pos: { research: [0, 0], quant: [0, 4], os: [1.3, 2], agreement: [2.8, 1], peer: [4, 0], registry: [4, 2], manifest: [2.8, 3], product: [4, 4] },
    reveal: [['os', 'research', 'quant'], ['manifest', 'product'], ['peer', 'agreement', 'registry']],
    lenses: [
      { k: 'platform', label: 'Platform + domains', nodes: ['os', 'research', 'quant'], note: 'One platform boundary with domain profiles attached (CMP-39). The domain layer is what a CELL-<DOMAIN> // OS name refers to — CELL-R, CELL-Q, CELL-SEC. Domain semantics never bypass shared control and evidence contracts.' },
      { k: 'product', label: 'Product manifest', nodes: ['os', 'manifest', 'product'], note: 'A customer-branded product declares its exact relationship through a versioned manifest (CMP-46). Authority is not copied.' },
      { k: 'peer', label: 'Peer organization', nodes: ['os', 'agreement', 'peer', 'registry'], note: 'A peer keeps independent authority. Discovery is not admission; exit and revocation behaviour are part of the agreement (CMP-47).', variant: 'boundary' },
      { k: 'naming', label: 'Naming convention', nodes: ['os', 'research', 'quant'], note: 'Founder-confirmed convention (this review, 11 Sep 2026): every platform built on the OS is named CELL-<DOMAIN> // OS — CELL-R // OS (research), CELL-Q // OS (quantitative; the new name for QUANTA // OS), CELL-SEC // OS (security). This is why a domain layer is required: the domain profile is what the suffix names. Older sources that read this as a product family (CELL Core, QUANTA) are historical wording (CMP-01, CMP-40, CMP-41).' }
    ],
    notes: {
      os: 'The platform boundary. Not a universal ecosystem controller.',
      research: 'CELL-R // OS: the research domain profile (CMP-40). Named by the convention CELL-<DOMAIN> // OS. Proposed attachment.',
      quant: 'CELL-Q // OS: the quantitative domain profile (CMP-41), the new name for QUANTA // OS. Historical/synthetic/offline educational only; no live execution or account bridge.',
      manifest: 'Versioned product manifest binding product, packages, build, evidence, owner and support lifecycle.',
      product: 'A customer-branded product with its own boundary.', peer: 'An independently governed organization.',
      agreement: 'Explicit exchange / trust contract: local authority and data rules on both sides.',
      registry: 'Scoped discovery and compatibility. Discovery is not admission.'
    }
  },
  D25: {
    pos: { private: [0, 2], draft: [1, 2], checks: [2, 2], approval: [3, 2], public: [4, 2], ledger: [3, 4] },
    reveal: [['private'], ['draft', 'checks'], ['approval', 'public', 'ledger']],
    lenses: [
      { k: 'flow', label: 'Projection', nodes: ['private', 'draft', 'checks', 'approval', 'public', 'ledger'], note: 'Private sources stay private. A sanitized high-level draft is built separately, reviewed for claims, sensitivity and rights, then requires exact-content founder approval before publication.' },
      { k: 'stop', label: 'Stop before publication', nodes: ['draft', 'checks', 'approval'], note: 'This page is exactly here: a design candidate awaiting exact-content approval. Building a preview does not publish it.', variant: 'paused', block: 'approval' }
    ],
    notes: {
      private: 'Private research and governed records. Not bundled on this page.', draft: 'Sanitized high-level projection draft.',
      checks: 'Claims, sensitivity and rights review of exact content.', approval: 'Exact-content founder approval — required, separate.',
      public: 'The public Architecture page: a versioned projection.', ledger: 'Publication / revocation record: version, status, correction.'
    }
  }
};

export const COMPARE = {
  columns: ['Minimal agent loop', 'Capable agent framework / durable workflow', 'CELL proposed governed composition'],
  task: 'Shared bounded task: prepare an evidence-backed explanation of a fictional data feed without contacting a system or changing data.',
  common: 'Models, tools, memory, durable execution, human review, subagents and evaluators may exist in all three columns. Features depend on implementation, not on the label.',
  rows: [
    { cap: 'Reusable bounded organization', a: 'Can be implemented: a prompt plus a tool list, re-created per run.', b: 'Can be implemented: graph or workflow definitions with subagents.', c: 'Proposed: a versioned Cell definition with members, typed ports, limits and acceptance duties.', equiv: 'A reusable workflow module or subgraph.', trade: 'More upfront specification; benefit unmeasured.', evidence: 'Matched-task comparison including setup and coordination cost.' },
    { cap: 'Typed relationship contracts', a: 'Can be implemented: function calls and shared state.', b: 'Can be implemented: typed edges, channels, state schemas.', c: 'Proposed: Link Contracts that separate data, dependency, authority, supervision and evidence relations.', equiv: 'Typed edges and schemas.', trade: 'A registry to maintain; more concepts to learn.', evidence: 'Fewer mis-routed or over-privileged handoffs on controlled tasks.' },
    { cap: 'Exact configuration + evidence lineage', a: 'Can be implemented: logging.', b: 'Can be implemented: checkpoints, traces, run history.', c: 'Proposed: definition / version / instance / run / attempt kept distinct; evidence bound to exact versions.', equiv: 'Tracing plus version control.', trade: 'Record volume; discipline in what is versioned.', evidence: 'Reproducibility of a planning run from its ledger.' },
    { cap: 'Explicit resources and authority', a: 'Can be implemented: API keys and prompts.', b: 'Can be implemented: permissions, interrupts, tool policies.', c: 'Proposed: current grants, ceilings and leases checked at release and dispatch, separate from connectivity.', equiv: 'Policy-as-code and IAM.', trade: 'Two checkpoints add latency and complexity.', evidence: 'Denied-release and revoked-dispatch tests passing; no leak paths.' },
    { cap: 'Context inspection', a: 'Can be implemented: print the prompt.', b: 'Can be implemented: memory stores, state inspection.', c: 'Proposed: an exact ContextSnapshot listing included, omitted, stale and contradictory material.', equiv: 'Prompt logging and RAG traces.', trade: 'Compiler and freshness logic to build.', evidence: 'Reviewer can trace each claim to a source version.' },
    { cap: 'Governed adaptation', a: 'Can be implemented: edit the prompt.', b: 'Can be implemented: human-in-the-loop edits, evaluators.', c: 'Research: bounded deltas with protected fields; proposals pause for exact-version approval.', equiv: 'Change management plus evaluation harness.', trade: 'Diagnostic and coordination cost; net benefit not measured.', evidence: 'Controlled experiment on accepted outcomes vs cost.' },
    { cap: 'Interoperable product relationships', a: 'Not usually a concern.', b: 'Can be implemented: shared libraries, APIs.', c: 'Research: manifests, explicit adapters and federation agreements between independently governed parties.', equiv: 'API contracts and partner agreements.', trade: 'Agreements to negotiate; adapters to test.', evidence: 'A second product using a profile without kernel changes.' }
  ],
  caveat: 'No speed, cost, quality, autonomy, certification or first-of-kind claim is made. A simple script or durable workflow may be the better option for a bounded task.'
};

export const SIX_PATTERNS = [
  { k: 'solo', name: 'Solo', mini: 'solo', use: 'Bounded inspection or research with relevant sources.', anti: 'A deterministic function already fully solves the task.', simpler: 'A script.', mp: 'MP-01' },
  { k: 'pipe', name: 'Pipeline', mini: 'pipe', use: 'Repeatable stages with typed handoffs.', anti: 'Stages have unresolved circular dependencies.', simpler: 'A sequential workflow.', mp: 'MP-02' },
  { k: 'parallel', name: 'Parallel branches', mini: 'fork', use: 'Independent sources or partitions.', anti: 'Shared writes or tightly sequential reasoning.', simpler: 'A map step.', mp: 'MP-03' },
  { k: 'supervisor', name: 'Supervisor / fixed branches', mini: 'tree', use: 'Flexible routing over repeatable lower-level procedures.', anti: 'Supervisor lacks authority for requested changes.', simpler: 'A router plus fixed workflows.', mp: 'MP-05' },
  { k: 'review', name: 'Review pair', mini: 'pair', use: 'Material errors can be checked independently.', anti: 'Reviewer repeats the same unsupported reasoning.', simpler: 'A single evaluator step.', mp: 'MP-12' },
  { k: 'diagnostic', name: 'Diagnostic branch', mini: 'diag', use: 'A cheap observation changes the next investigation.', anti: 'Unreliable diagnostic cannot support pruning.', simpler: 'A conditional in a workflow.', mp: 'MP-04' }
];

export const HISTORICAL_LAYERS_NOTE = 'The source record mentions seven PLATFORM layers. The original seven-layer AGENT was not recovered; it is not reconstructed here.';

// Educational, nonfinancial research demonstrator. No network, trades or accounts.
// Role checks illustrate rules. Caller-supplied identities are not authentication.
const clone = x => JSON.parse(JSON.stringify(x));
const fail = (code, message) => { const e = new Error(message); e.code = code; throw e; };
const mean = xs => xs.reduce((a,b)=>a+b,0)/xs.length;
const roles = {
  validate_data:'data_steward', submit_study:'researcher', approve_study:'research_lead',
  run_experiment:'researcher', review_experiment:'reviewer', assemble_dossier:'research_lead',
  replace_dataset:'data_steward', advance_clock:null
};
export function createState(fixtures) {
  return { revision:0, clock:fixtures.clock, dataset:clone(fixtures.dataset), study:clone(fixtures.study),
    dataCheck:null, studySubmitted:false, studyApproval:null, experiment:null, review:null,
    dossier:null, reviewHistory:[], history:[], events:[], commands:[] };
}
export function inspectData(dataset, study) {
  const rows=dataset.rows, issues=[];
  if(!Array.isArray(rows) || !rows.length) return ['NO_DATA'];
  const seen=new Set();
  rows.forEach((r,i)=>{
    if(!r || typeof r!=='object' || Array.isArray(r)) {issues.push('MALFORMED_ROW');return;}
    const epoch=Date.parse(r.day);
    if(typeof r.day!=='string' || !/^\d{4}-\d{2}-\d{2}$/.test(r.day) || !Number.isFinite(epoch) || new Date(epoch).toISOString().slice(0,10)!==r.day) issues.push('INVALID_DAY');
    if(seen.has(r.day)) issues.push('DUPLICATE_DAY');
    seen.add(r.day);
    if(i>0 && rows[i-1] && r.day<=rows[i-1].day) issues.push('NOT_CHRONOLOGICAL');
    if(i>0 && rows[i-1] && Date.parse(r.day)-Date.parse(rows[i-1].day)!==86400000) issues.push('NOT_DAILY');
    if(!Number.isInteger(r.value) || r.value<0) issues.push('INVALID_COUNT');
  });
  if(!Number.isInteger(study.trainEnd) || !Number.isInteger(study.validationEnd) ||
    study.trainEnd<3 || study.validationEnd<=study.trainEnd || study.validationEnd>=rows.length) issues.push('INVALID_SPLIT');
  return [...new Set(issues)];
}
function score(rows,start,end,method) {
  const predictions=[];
  for(let i=start;i<end;i++) {
    const estimate=method==='previous_observation' ? rows[i-1].value : mean(rows.slice(i-3,i).map(r=>r.value));
    predictions.push({day:rows[i].day,actual:rows[i].value,estimate,absoluteError:Math.abs(rows[i].value-estimate)});
  }
  return {n:predictions.length,mae:mean(predictions.map(x=>x.absoluteError)),
    rmse:Math.sqrt(mean(predictions.map(x=>(x.actual-x.estimate)**2))),predictions};
}
export function calculateExperiment(dataset, study) {
  const issues=inspectData(dataset,study);
  if(issues.length) fail('INVALID_DATA',issues.join(', '));
  if(JSON.stringify(study.candidates)!==JSON.stringify(['previous_observation','trailing_three_mean']) || study.horizon!==1)
    fail('UNSUPPORTED_STUDY','This bounded demo supports only its two predeclared one-step methods.');
  const validation=Object.fromEntries(study.candidates.map(m=>[m,score(dataset.rows,study.trainEnd,study.validationEnd,m)]));
  const selected=validation.previous_observation.mae<=validation.trailing_three_mean.mae ? 'previous_observation':'trailing_three_mean';
  return { id:'EXP-01', ref:`EXP-01@data${dataset.version}-study${study.version}`, datasetRef:`${dataset.id}@v${dataset.version}`, studyRef:`${study.id}@v${study.version}`,
    validation, selected, heldout:score(dataset.rows,study.validationEnd,dataset.rows.length,selected),
    evaluationMode:'Rolling one-day forecast; each prior actual is available before the next forecast.',
    selectionRule:'Select on validation MAE only; tie chooses previous observation. Held-out results do not tune parameters.',
    limitations:['Synthetic nonfinancial series','Tiny educational sample','No real-world predictive claim','No trading performance'] };
}
export function dispatch(state, command, actor) {
  if(!actor?.id || !actor?.role) fail('ACTOR_REQUIRED','Choose an identified demo role.');
  if(!command?.id) fail('COMMAND_ID_REQUIRED','A command needs an id.');
  const signature=JSON.stringify({command,actor});
  const prior=state.commands.find(x=>x.id===command.id);
  if(prior) {
    if(prior.signature!==signature) fail('COMMAND_REUSE','This command id already has different content.');
    return state;
  }
  if(command.expectedRevision!==state.revision) fail('REVISION_CONFLICT','The shared state changed. Refresh the proposed action.');
  if(!Object.hasOwn(roles,command.type)) fail('UNKNOWN_ACTION','Unsupported demo action.');
  if(roles[command.type] && roles[command.type]!==actor.role) fail('WRONG_ROLE',`This action belongs to ${roles[command.type]}.`);
  const s=clone(state), payload=command.payload||{};
  switch(command.type) {
    case 'validate_data': {
      const issues=inspectData(s.dataset,s.study);
      s.dataCheck={datasetVersion:s.dataset.version,issues,verdict:issues.length?'FAIL':'PASS',actorId:actor.id};
      break;
    }
    case 'submit_study':
      if(s.dataCheck?.verdict!=='PASS') fail('DATA_NOT_READY','Data checks must pass before submitting this study.');
      s.studySubmitted=true; break;
    case 'approve_study':
      if(!s.studySubmitted) fail('STUDY_NOT_SUBMITTED','A researcher must submit the study first.');
      s.studyApproval={actorId:actor.id,studyVersion:s.study.version,datasetVersion:s.dataset.version}; break;
    case 'run_experiment':
      if(!s.studyApproval || s.dataCheck?.verdict!=='PASS') fail('PLAN_NOT_APPROVED','Review the study plan and data first.');
      if(s.experiment) fail('EXPERIMENT_EXISTS','This dataset already has a current run. Use a new dataset revision for a new bounded example.');
      s.experiment={...calculateExperiment(s.dataset,s.study),producerId:actor.id};
      s.review=null; s.dossier=null; break;
    case 'review_experiment':
      if(!s.experiment) fail('NO_EXPERIMENT','There is no current experiment to review.');
      if(s.experiment.producerId===actor.id) fail('SELF_REVIEW','The experiment producer cannot be its independent reviewer.');
      if(!['ACCEPT','REJECT'].includes(payload.decision)) fail('DECISION_REQUIRED','Choose ACCEPT or REJECT.');
      if(!payload.reason?.trim()) fail('REASON_REQUIRED','Explain the review decision.');
      s.review={actorId:actor.id,decision:payload.decision,reason:payload.reason,experimentId:s.experiment.id,experimentRef:s.experiment.ref,datasetVersion:s.dataset.version};
      s.reviewHistory.push(clone(s.review));
      s.dossier=null; break;
    case 'assemble_dossier':
      if(s.review?.decision!=='ACCEPT') fail('REVIEW_REQUIRED','Independent acceptance is required before dossier assembly.');
      s.dossier={id:'REPORT-01',ref:`REPORT-01@data${s.dataset.version}-study${s.study.version}`,status:'ACCEPTED_SYNTHETIC_DEMO_RECORD',datasetRef:s.experiment.datasetRef,studyRef:s.experiment.studyRef,
        experimentId:s.experiment.id,experimentRef:s.experiment.ref,selected:s.experiment.selected,heldoutMae:s.experiment.heldout.mae,
        review:clone(s.review),limitations:clone(s.experiment.limitations),externalPublication:false}; break;
    case 'replace_dataset':
      if(!Array.isArray(payload.rows) || payload.rows.length===0) fail('ROWS_REQUIRED','Provide the revised synthetic rows.');
      if(s.dataCheck || s.studySubmitted || s.studyApproval || s.experiment || s.review || s.dossier)
        s.history.push({dataset:clone(s.dataset),study:clone(s.study),dataCheck:s.dataCheck,studySubmitted:s.studySubmitted,
          studyApproval:s.studyApproval,experiment:s.experiment,review:s.review,reviewHistory:s.reviewHistory,dossier:s.dossier});
      s.dataset={...s.dataset,version:s.dataset.version+1,rows:clone(payload.rows)};
      s.dataCheck=null; s.studySubmitted=false; s.studyApproval=null; s.experiment=null; s.review=null; s.reviewHistory=[]; s.dossier=null; break;
    case 'advance_clock':
      if(!Number.isFinite(payload.minutes) || payload.minutes<0) fail('INVALID_CLOCK','Clock advance must be a nonnegative number of minutes.');
      {const epoch=Date.parse(s.clock)+payload.minutes*60000;
      if(!Number.isFinite(epoch) || Math.abs(epoch)>8640000000000000) fail('INVALID_CLOCK','Clock advance exceeds the supported date range.');
      s.clock=new Date(epoch).toISOString();} break;
  }
  s.revision++;
  s.events.push({type:command.type,actorId:actor.id,role:actor.role,revision:s.revision,clock:s.clock});
  s.commands.push({id:command.id,signature});
  return s;
}
export function metrics(state, filter = null) {
  const allowed = filter?.role ? availableActions(state,filter.role).length : null;
  return {records:state.dataset.rows.length,dataIssues:state.dataCheck?.issues.length??null,
    currentExperiments:state.experiment?1:0,acceptedCurrentExperiments:state.review?.decision==='ACCEPT'?1:0,
    historicalExperiments:state.history.filter(x=>x.experiment).length,
    currentDossiers:state.dossier?1:0,heldoutMae:state.experiment?.heldout.mae??null,
    businessSavings:null,realWorldPerformance:null,roleActionTypes:allowed};
}
export function availableActions(state, role) {
  return Object.entries(roles).filter(([,r])=>r===role).map(([type])=>type);
}
export function visibleResearch(state, actor) {
  if(!['research_lead','researcher','data_steward','reviewer'].includes(actor?.role))
    fail('UNKNOWN_ROLE','Choose a supported research role.');
  const canSeeRows=['researcher','data_steward'].includes(actor.role);
  return {revision:state.revision,clock:state.clock,role:actor.role,
    dataset:canSeeRows?clone(state.dataset):{id:state.dataset.id,version:state.dataset.version,recordCount:state.dataset.rows.length},
    study:clone(state.study),dataCheck:clone(state.dataCheck),
    experiment:actor.role==='data_steward'?null:clone(state.experiment),
    review:clone(state.review),dossier:clone(state.dossier),
    actions:availableActions(state,actor.role),metrics:metrics(state,{role:actor.role})};
}
export function advanceClock(state, minutes, id = `clock-${state.revision}-${minutes}`, actor = {id:'demo-clock',role:'observer'}) {
  return dispatch(state,{id,type:'advance_clock',expectedRevision:state.revision,payload:{minutes}},actor);
}

const byId = (id) => document.getElementById(id);
const els = {
  loginPanel: byId('loginPanel'), loginForm: byId('loginForm'), password: byId('passwordInput'), loginMessage: byId('loginMessage'),
  dashboard: byId('dashboard'), topActions: byId('topActions'), logout: byId('logoutBtn'), update: byId('updateBtn'), statusDot: byId('statusDot'),
  serviceStatus: byId('serviceStatus'), releaseSummary: byId('releaseSummary'), releaseId: byId('releaseId'), releaseTime: byId('releaseTime'),
  chartCount: byId('chartCount'), listenAddress: byId('listenAddress'), mainCommit: byId('mainCommit'), data1Commit: byId('data1Commit'), data2Commit: byId('data2Commit'),
  updateStatus: byId('updateStatus'), output: byId('outputBox'), submissionCount: byId('submissionCount'), withdrawalCount: byId('withdrawalCount'),
  chartManageCount: byId('chartManageCount'), chartManageList: byId('chartManageList'), chartSearch: byId('chartSearchInput'), chartCharacter: byId('chartCharacterSelect'), chartTag: byId('chartTagSelect'),
  submissionList: byId('submissionList'), withdrawalList: byId('withdrawalList'), whitelistForm: byId('whitelistForm'), whitelistEmail: byId('whitelistEmail'),
  whitelistList: byId('whitelistList'), quickWhitelist: byId('quickWhitelistBtn'), smtpForm: byId('smtpForm'), smtpHost: byId('smtpHost'),
  smtpPort: byId('smtpPort'), smtpUser: byId('smtpUser'), smtpPass: byId('smtpPass'), smtpFrom: byId('smtpFrom'), smtpTo: byId('smtpTo'),
  smtpSecure: byId('smtpSecure'), smtpTest: byId('smtpTestBtn'), smtpMessage: byId('smtpMessage'), reviewBackdrop: byId('reviewBackdrop'),
  reviewTitle: byId('reviewTitle'), reviewSubmitter: byId('reviewSubmitter'), reviewRisk: byId('reviewRisk'), reviewMeta: byId('reviewMeta'),
  reviewTags: byId('reviewTags'), reviewIssues: byId('reviewIssues'), reviewApprove: byId('reviewApproveBtn'), reviewReject: byId('reviewRejectBtn'),
  closeReview: byId('closeReviewBtn'), axisPreview: byId('axisPreview'), axisScale: byId('axisScale'), axisScaleValue: byId('axisScaleValue'),
  uploadBackdrop: byId('uploadBackdrop'), openUpload: byId('openUploadBtn'), closeUpload: byId('closeUploadBtn'), cancelUpload: byId('cancelUploadBtn'),
  uploadForm: byId('adminUploadForm'), uploadUsername: byId('uploadUsername'), uploadEmail: byId('uploadEmail'), uploadFile: byId('uploadFile'), uploadMessage: byId('uploadMessage'),
  passwordForm: byId('passwordForm'), currentPassword: byId('currentPassword'), newPassword: byId('newPassword'), confirmPassword: byId('confirmPassword'), passwordMessage: byId('passwordMessage'),
  projectAssetSearch: byId('projectAssetSearch'), projectAssetList: byId('projectAssetList'), projectAssetForm: byId('projectAssetForm'), projectAssetOriginalId: byId('projectAssetOriginalId'),
  projectAssetId: byId('projectAssetId'), projectAssetZh: byId('projectAssetZh'), projectAssetEn: byId('projectAssetEn'), projectAssetJa: byId('projectAssetJa'), projectAssetKo: byId('projectAssetKo'),
  projectAssetHasBase: byId('projectAssetHasBase'), projectAssetBaseEditor: byId('projectAssetBaseEditor'), projectAssetImage: byId('projectAssetImage'), projectAssetCurrentSrc: byId('projectAssetCurrentSrc'),
  projectAssetImageWidth: byId('projectAssetImageWidth'), projectAssetImageHeight: byId('projectAssetImageHeight'), projectAssetCropX: byId('projectAssetCropX'), projectAssetCropY: byId('projectAssetCropY'),
  projectAssetCropW: byId('projectAssetCropW'), projectAssetCropH: byId('projectAssetCropH'), projectAssetStretchLeft: byId('projectAssetStretchLeft'), projectAssetStretchRight: byId('projectAssetStretchRight'),
  projectAssetEdge: byId('projectAssetEdge'), projectAssetPreview: byId('projectAssetPreview'), projectAssetTitle: byId('projectAssetTitle'), projectAssetMode: byId('projectAssetMode'),
  projectAssetMessage: byId('projectAssetMessage'), deleteProjectAsset: byId('deleteProjectAssetBtn'), newProjectAsset: byId('newProjectAssetBtn'), refreshProjectAssets: byId('refreshProjectAssetsBtn'),
  copyProjectApi: byId('copyProjectApiBtn'), projectApiUrl: byId('projectApiUrl'), projectApiRevision: byId('projectApiRevision'),
  appReleaseForm: byId('appReleaseForm'), appReleaseVersion: byId('appReleaseVersion'), appReleaseTitle: byId('appReleaseTitle'), appReleaseNotes: byId('appReleaseNotes'), appReleaseUrl: byId('appReleaseUrl'),
  appReleasePackage: byId('appReleasePackage'), appReleaseCurrent: byId('appReleaseCurrent'), appReleaseMessage: byId('appReleaseMessage'), uploadAppRelease: byId('uploadAppReleaseBtn')
};

const PROFILE_KEY = 'wwcombo-maintainer-publish-profile-v1';
const DEFAULT_MOVE_LABELS = { basic_attack:'a', heavy_attack:'z', skill:'e', skill_hold:'E', echo:'q', echo_hold:'Q', liberation:'r', liberation_hold:'R', dodge:'s', dodge_hold:'S', jump:'j', jump_hold:'J', tool:'t', finisher:'f', forward:'w', switch_1:'i', switch_2:'ii', switch_3:'iii', intro:'b', outro:'y' };
const ICONS = [
  ['长按共鸣解放','liberation-hold'],['长按普攻','mouse-left-hold'],['长按技能','skill-hold'],['长按声骸','echo-hold'],['长按解放','liberation-hold'],['长按跳跃','jump-hold'],['长按闪避','mouse-right-hold'],
  ['共鸣解放','liberation'],['终结技','finisher'],['长按普攻','mouse-left-hold'],['普攻','mouse-left'],['重击','mouse-left-hold'],['技能','skill'],['声骸','echo'],['解放','liberation'],['闪避','mouse-right'],['跳跃','jump'],['工具','tool'],['变奏','intro'],['延奏','outro'],['处决','finisher'],['前走','forward'],
  ['iii','iii'],['ii','ii'],['E','skill-hold'],['Q','echo-hold'],['R','liberation-hold'],['S','mouse-right-hold'],['D','mouse-right-hold'],['J','jump-hold'],['a','mouse-left'],['z','mouse-left-hold'],['e','skill'],['q','echo'],['r','liberation'],['s','mouse-right'],['d','mouse-right'],['j','jump'],['t','tool'],['b','intro'],['y','outro'],['f','finisher'],['w','forward'],['i','i']
].sort((left, right) => right[0].length - left[0].length);
const CHINESE_ICON_NAMES = { i:'i.png', ii:'ii.png', iii:'iii.png', intro:'变奏.png', outro:'延奏.png', forward:'前走.png' };
const state = { csrf:'', status:null, pollTimer:0, review:null, icons:new Map(), chartQuery:'', chartCharacter:'', chartTag:'', projectAssets:null, projectAssetSelectedId:'', projectAssetImageDataUrl:'' };

async function api(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (state.csrf && options.method && options.method !== 'GET') headers['x-csrf-token'] = state.csrf;
  const response = await fetch(url, { ...options, headers, credentials:'same-origin' });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(body.error || `HTTP ${response.status}`); error.status = response.status; error.body = body; throw error; }
  return body;
}

function formatDate(value) { const date = new Date(value || 0); return value && !Number.isNaN(date.getTime()) ? date.toLocaleString('zh-CN') : '-'; }
function formatDuration(value) { const seconds = Math.max(0, Number(value || 0)) / 1000; return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`; }
function short(value) { return value ? String(value).slice(0, 12) : '-'; }
function button(label, className, handler) { const item = document.createElement('button'); item.type='button'; item.className=className; item.textContent=label; item.addEventListener('click', handler); return item; }
function empty(text) { const item=document.createElement('div'); item.className='empty-row'; item.textContent=text; return item; }

function switchTab(name) {
  document.querySelectorAll('[data-tab]').forEach((item) => item.classList.toggle('active', item.dataset.tab === name));
  document.querySelectorAll('[data-panel]').forEach((panel) => { const active=panel.dataset.panel === name; panel.hidden=!active; panel.classList.toggle('active', active); });
}

function riskBlock(preflight = {}) {
  const wrap=document.createElement('div'); wrap.className=`preflight ${preflight.lowRisk ? 'low' : 'attention'}`;
  const badge=document.createElement('strong'); badge.textContent=preflight.lowRisk ? '低风险' : '需要注意'; wrap.appendChild(badge);
  const text=document.createElement('span'); text.textContent=preflight.lowRisk ? '格式与图标转换检查通过' : (preflight.issues || []).join('；') || '等待打开后检查'; wrap.appendChild(text);
  return wrap;
}

function renderSubmissions(items) {
  els.submissionCount.textContent=items.length;
  els.submissionList.replaceChildren(...(items.length ? items.map((item) => {
    const card=document.createElement('article'); card.className='submission-card';
    const top=document.createElement('div'); top.className='submission-top';
    const title=document.createElement('div'); title.innerHTML=`<small>${formatDate(item.submittedAt)}</small><h3></h3><p></p>`;
    title.querySelector('h3').textContent=item.preview?.title || item.fileName || '未命名投稿';
    title.querySelector('p').textContent=`${item.username || '未命名'} · ${item.email || '邮箱未知'}`;
    const avatars=document.createElement('div'); avatars.className='avatar-stack';
    for (const name of item.preview?.characters || []) avatars.appendChild(avatar(name));
    top.append(title, avatars); card.append(top, riskBlock(item.preflight));
    const tags=document.createElement('div'); tags.className='review-tags';
    for (const tag of item.preview?.tags || []) { const chip=document.createElement('span'); chip.textContent=tag; tags.appendChild(chip); }
    card.append(tags);
    const actions=document.createElement('div'); actions.className='row-actions';
    actions.append(button('拒绝','quiet danger',()=>submissionAction(item.id,'reject')),button('查看连段图','quiet',()=>openReview(item.id)),button('审核通过','primary',()=>submissionAction(item.id,'approve')));
    card.append(actions); return card;
  }) : [empty('当前没有待审核投稿。')]));
}

function chartCharacters(chart) {
  return (Array.isArray(chart.characters) ? chart.characters : [chart.character]).filter((value) => typeof value === 'string' && value.trim());
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((left, right) => left.localeCompare(right, 'zh-CN'));
}

function syncChartManageFilters(charts) {
  if (!els.chartCharacter || !els.chartTag) return;
  const characters = uniqueSorted(charts.flatMap(chartCharacters));
  const tags = uniqueSorted(charts.flatMap((chart) => Array.isArray(chart.tags) ? chart.tags : []));
  const characterValue = state.chartCharacter;
  const tagValue = state.chartTag;
  els.chartCharacter.replaceChildren(Object.assign(document.createElement('option'), { value: '', textContent: '全部角色' }), ...characters.map((name) => Object.assign(document.createElement('option'), { value: name, textContent: name })));
  els.chartTag.replaceChildren(Object.assign(document.createElement('option'), { value: '', textContent: '全部标签' }), ...tags.map((tag) => Object.assign(document.createElement('option'), { value: tag, textContent: tag })));
  els.chartCharacter.value = characters.includes(characterValue) ? characterValue : '';
  els.chartTag.value = tags.includes(tagValue) ? tagValue : '';
  state.chartCharacter = els.chartCharacter.value;
  state.chartTag = els.chartTag.value;
}

function managedCharts(charts) {
  const query = state.chartQuery.trim().toLowerCase();
  return charts.filter((chart) => {
    const tags = Array.isArray(chart.tags) ? chart.tags : [];
    const characters = chartCharacters(chart);
    return (!query || String(chart.title || '').toLowerCase().includes(query))
      && (!state.chartCharacter || characters.includes(state.chartCharacter))
      && (!state.chartTag || tags.includes(state.chartTag));
  });
}

async function deleteManagedChart(id, title) {
  if (!id || !confirm(`确认删除「${title || id}」？删除后当前网站会隐藏它。`)) return;
  await api(`/api/server/charts/${encodeURIComponent(id)}/delete`, { method:'POST' });
  await loadStatus();
}

function renderManagedCharts(charts) {
  if (!els.chartManageList) return;
  syncChartManageFilters(charts);
  const filtered = managedCharts(charts);
  els.chartManageCount.textContent = filtered.length;
  els.chartManageList.replaceChildren(...(filtered.length ? filtered.map((chart) => {
    const row = document.createElement('article');
    row.className = 'task-row chart-row';
    const content = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = chart.title || '未命名连段';
    const meta = document.createElement('span');
    meta.textContent = `${chartCharacters(chart).join(' / ') || '未知角色'} · ${(chart.tags || []).join(' / ') || '无标签'} · ${chart.uploadVersion || '未知版本'}`;
    const note = document.createElement('small');
    note.textContent = `ID: ${chart.id || '-'} · 上传者: ${chart.submitter?.nickname || '历史连段'}${chart.submitter?.email ? ` · ${chart.submitter.email}` : ''}`;
    content.append(title, meta, note);
    const controls = document.createElement('div');
    controls.className = 'row-actions';
    const avatars = document.createElement('div');
    avatars.className = 'avatar-stack';
    for (const name of chartCharacters(chart).slice(0, 3)) avatars.appendChild(avatar(name));
    controls.append(avatars, button('删除', 'quiet danger', () => deleteManagedChart(chart.id, chart.title)));
    row.append(content, controls);
    return row;
  }) : [empty('没有找到对应连段。')]));
}

function taskRow(title, meta, detail, actions=[]) { const row=document.createElement('article'); row.className='task-row'; const content=document.createElement('div'); const heading=document.createElement('strong'); heading.textContent=title; const metadata=document.createElement('span'); metadata.textContent=meta; const note=document.createElement('small'); note.textContent=detail; content.append(heading,metadata,note); const controls=document.createElement('div'); controls.className='row-actions'; controls.append(...actions); row.append(content,controls); return row; }
function renderWithdrawals(items) { els.withdrawalCount.textContent=items.length; els.withdrawalList.replaceChildren(...(items.length ? items.map((item)=>taskRow(`连段 ${item.comboId}`,`${item.username || '未命名'} · ${item.email || '邮箱未知'} · ${formatDate(item.submittedAt)}`,'邮箱未能与所有权记录匹配，请人工确认。',[button('拒绝','quiet danger',()=>withdrawalAction(item.id,'reject')),button('批准撤回','primary',()=>withdrawalAction(item.id,'approve'))])) : [empty('当前没有需要人工处理的撤回申请。')])); }

async function submissionAction(id, action) { const reason=action==='reject' ? (prompt('可填写拒绝原因（选填）') || '') : ''; await api(`/api/server/submissions/${encodeURIComponent(id)}/${action}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({reason})}); closeReview(); await loadStatus(); }
async function withdrawalAction(id, action) { if(action==='approve'&&!confirm('确认人工批准这条撤回申请？')) return; await api(`/api/server/withdrawals/${encodeURIComponent(id)}/${action}`,{method:'POST'}); await loadStatus(); }

function renderWhitelist(emails) {
  const children = emails.length ? emails.map((email) => {
    const chip = document.createElement('span');
    chip.className = 'email-chip';
    chip.append(document.createTextNode(email), button('×', 'chip-remove', () => saveWhitelist(emails.filter((item) => item !== email))));
    return chip;
  }) : [empty('尚未设置 UP 白名单。')];
  els.whitelistList.replaceChildren(...children);
}
async function saveWhitelist(emails) { await api('/api/server/community/whitelist',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({emails})}); await loadStatus(); }
function renderSmtp(smtp) { if(document.activeElement?.closest('#smtpForm')) return; els.smtpHost.value=smtp.host||''; els.smtpPort.value=smtp.port||465; els.smtpUser.value=smtp.user||''; els.smtpPass.value=''; els.smtpPass.placeholder=smtp.hasPassword?'已保存，留空则不修改':'填写邮箱授权码'; els.smtpFrom.value=smtp.from||''; els.smtpTo.value=smtp.to||''; els.smtpSecure.checked=smtp.secure!==false; }

function renderStatus(data) {
  state.status=data; state.csrf=data.csrf||state.csrf; els.loginPanel.hidden=true; els.dashboard.hidden=false; els.topActions.hidden=false;
  const update=data.update||{}; const busy=update.status==='running'; const failed=update.status==='failed';
  els.statusDot.classList.toggle('busy',busy); els.statusDot.classList.toggle('error',failed); els.serviceStatus.textContent=busy?'正在更新仓库':failed?'上次更新失败':'服务运行中';
  els.releaseSummary.textContent=`${Number(data.release?.charts||0)} 个连段 · ${formatDate(data.release?.createdAt)}`; els.releaseId.textContent=data.release?.releaseId||'-'; els.releaseTime.textContent=formatDate(data.release?.createdAt); els.chartCount.textContent=`${Number(data.release?.charts||0)} 个`; els.listenAddress.textContent=`${data.server?.host||'-'}:${data.server?.port||'-'}`; els.mainCommit.textContent=short(data.release?.commits?.repository); els.data1Commit.textContent=short(data.release?.commits?.deta1); els.data2Commit.textContent=short(data.release?.commits?.deta2);
  els.update.disabled=busy; els.update.textContent=busy?'正在更新':'从 GitHub 更新并重启'; els.updateStatus.textContent=busy?'运行中':failed?'失败':update.status==='completed'?'已完成':'等待操作'; const output=[...(update.output||[])]; if(update.error) output.push('',`错误：${update.error}`); els.output.textContent=output.length?output.join('\n'):'尚未执行更新。';
  const community=data.community||{}; renderSubmissions(community.submissions?.pending||[]); renderManagedCharts(community.currentCharts||[]); renderWithdrawals(community.withdrawals?.pending||[]); renderWhitelist(community.whitelist||[]); renderSmtp(community.smtp||{});
}

function showLogin(message='') { clearTimeout(state.pollTimer); els.dashboard.hidden=true; els.topActions.hidden=true; els.loginPanel.hidden=false; els.loginMessage.textContent=message; state.csrf=''; }
async function loadStatus({quiet=false}={}) { try { const data=await api('/api/server/status'); renderStatus(data); clearTimeout(state.pollTimer); state.pollTimer=setTimeout(()=>loadStatus({quiet:true}),7000); return data; } catch(error) { if(error.status===401) showLogin(quiet?'':'请输入你设置的管理员密码。'); else if(!quiet) showLogin(error.message); throw error; } }

function avatar(name) { const image=document.createElement('img'); image.className='role-avatar'; image.src=state.icons.get(name)||'/assets/unknown-character.jpg'; image.alt=name||''; image.title=name||''; image.addEventListener('error',()=>{image.src='/assets/unknown-character.jpg';},{once:true}); return image; }
async function loadIcons() { try { const response=await fetch('/assets/character-icons.json'); const data=await response.json(); state.icons=new Map(Array.isArray(data)?data:[]); } catch { state.icons=new Map(); } }
function chartOf(pack) { return pack?.chart || (Array.isArray(pack?.charts) ? pack.charts[0] : null); }
function charactersOf(chart) { const community=chart?.community||{}; return (Array.isArray(community.characters)?community.characters:[chart?.character]).filter(Boolean).slice(0,3); }
function iconSource(id) { const chinese=CHINESE_ICON_NAMES[id]; return chinese ? `/assets/botton/${encodeURIComponent(chinese)}` : `/assets/graphic-icons/${id}.png`; }
function actionParts(value) { const result=[]; let text=String(value||''); while(text){ const found=ICONS.find(([trigger])=>text.startsWith(trigger)); if(found){result.push({icon:found[1],label:found[0]});text=text.slice(found[0].length);} else {result.push({text:text[0]});text=text.slice(1);} } return result; }
function actionNode(value) { const wrap=document.createElement('span'); wrap.className='axis-action'; for(const part of actionParts(value)){ if(part.icon){const image=document.createElement('img');image.src=iconSource(part.icon);image.alt=part.label;image.title=part.label;wrap.appendChild(image);}else{const text=document.createElement('span');text.textContent=part.text;wrap.appendChild(text);} } return wrap; }
function groupSteps(steps) { const groups=[]; let current=null; for(const step of steps){const switching=/^switch_[123]$/.test(step.moveId);const slot=Math.max(1,Math.min(3,Number(step.characterSlot||String(step.moveId).slice(-1)||1)));if(!current||switching){current={slot,steps:[]};groups.push(current);}current.steps.push(step);}return groups; }
function axisLabel(step, labels) { return String(labels?.[step.id]||DEFAULT_MOVE_LABELS[step.moveId]||step.label||step.moveId||'').trim(); }
function renderAxis(pack) {
  const chart=chartOf(pack); if(!chart||!Array.isArray(chart.steps)) throw new Error('连段步骤格式不正确。'); const community=chart.community||{}; const chars=charactersOf(chart); const labels=pack.contentLabels||{};
  const all=(chart.periods||[]).filter((period)=>['startup_axis','loop_axis'].includes(period?.kind)).sort((a,b)=>Number(a.startMs||0)-Number(b.startMs||0)); const wrong=(community.tags||[]).includes('错轮'); let periods=wrong?all:[all.find((item)=>item.kind==='startup_axis'),all.find((item)=>item.kind==='loop_axis')].filter(Boolean);
  if(!periods.length){const end=chart.steps.reduce((max,step)=>Math.max(max,Number(step.startMax||0)+Number(step.durationMax||0)),0);periods=[{label:'完整连段',kind:'startup_axis',startMs:0,endMs:end}];}
  const fragment=document.createDocumentFragment(); for(const period of periods){const start=Number(period.startMs||0);const end=Number(period.endMs||Infinity);const steps=[...chart.steps].filter((step)=>Number(step.startMin||0)>=start&&Number(step.startMin||0)<end).sort((a,b)=>Number(a.startMin||0)-Number(b.startMin||0)); const section=document.createElement('section');section.className='axis-round';const head=document.createElement('header');head.innerHTML='<strong></strong><span></span>';head.querySelector('strong').textContent=period.label|| (period.kind==='startup_axis'?'启动轴':'循环轴');head.querySelector('span').textContent=`${formatDuration(start)} - ${formatDuration(Number.isFinite(end)?end:start)}`;const flow=document.createElement('div');flow.className='axis-flow';for(const group of groupSteps(steps)){const block=document.createElement('div');block.className='axis-block';block.appendChild(avatar(chars[group.slot-1]||`角色${group.slot}`));const actions=document.createElement('div');actions.className='axis-block-actions';for(const step of group.steps) actions.appendChild(actionNode(axisLabel(step,labels)));block.appendChild(actions);flow.appendChild(block);}section.append(head,flow);fragment.appendChild(section);} els.axisPreview.replaceChildren(fragment); applyAxisScale();
}
function applyAxisScale(){const value=Number(els.axisScale.value||125);els.axisScaleValue.value=`${value}%`;els.axisPreview.style.setProperty('--axis-scale',String(value/100));}

async function openReview(id) { els.reviewBackdrop.hidden=false; document.body.classList.add('modal-open'); els.reviewTitle.textContent='正在读取投稿'; els.axisPreview.innerHTML='<p>正在生成连段图...</p>'; try { const data=await api(`/api/server/submissions/${encodeURIComponent(id)}/preview`); state.review={id,...data}; const item=data.submission||{}; const chart=chartOf(data.content); const preview=item.preview||{}; const preflight=data.preflight||item.preflight||{}; els.reviewTitle.textContent=preview.title||item.fileName||'未命名投稿'; els.reviewSubmitter.textContent=`${item.username||'未命名'} · ${item.email||'邮箱未知'} · ${formatDate(item.submittedAt)}`; els.reviewRisk.className=`risk-badge ${preflight.lowRisk?'low':'attention'}`; els.reviewRisk.textContent=preflight.lowRisk?'低风险':'需要注意'; els.reviewMeta.replaceChildren(); const meta=[['角色',(preview.characters||charactersOf(chart)).join(' / ')||'未知'],['轮数',`${preview.rounds||1} 轮`],['招式',`${preview.stepCount||chart.steps.length} 个`],['时长',formatDuration(preview.durationMs)]]; for(const [key,value] of meta){const row=document.createElement('div');row.innerHTML='<span></span><strong></strong>';row.querySelector('span').textContent=key;row.querySelector('strong').textContent=value;els.reviewMeta.appendChild(row);} els.reviewTags.replaceChildren(...(preview.tags||[]).map((tag)=>{const node=document.createElement('span');node.textContent=tag;return node;})); els.reviewIssues.replaceChildren(...((preflight.issues||[]).length?(preflight.issues||[]).map((issue)=>{const p=document.createElement('p');p.textContent=issue;return p;}):[Object.assign(document.createElement('p'),{textContent:'未发现连续 6 次同招式或无法图标化的自定义文字。'})])); els.reviewApprove.onclick=()=>submissionAction(id,'approve'); els.reviewReject.onclick=()=>submissionAction(id,'reject'); renderAxis(data.content); } catch(error){els.axisPreview.innerHTML='';const p=document.createElement('p');p.className='error-text';p.textContent=error.message;els.axisPreview.appendChild(p);} }
function closeReview(){els.reviewBackdrop.hidden=true;state.review=null;if(els.uploadBackdrop.hidden)document.body.classList.remove('modal-open');}

function savedProfile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}');}catch{return {};}}
function openUpload(){const profile=savedProfile();els.uploadUsername.value=profile.username||'';els.uploadEmail.value=profile.email||'';els.uploadFile.value='';els.uploadMessage.textContent='';els.uploadBackdrop.hidden=false;document.body.classList.add('modal-open');setTimeout(()=>els.uploadUsername.focus(),0);}
function closeUpload(){els.uploadBackdrop.hidden=true;if(els.reviewBackdrop.hidden)document.body.classList.remove('modal-open');}

function projectAssetUrl(src) { try { return new URL(src || '', location.origin).toString(); } catch { return ''; } }
function projectAssetNumber(input, fallback) { const value=Number(input.value); return Number.isFinite(value)?value:fallback; }
function projectAssetById(id) { return (state.projectAssets?.characters||[]).find((item)=>item.id===id); }
function projectAssetDisplayNames(item) { return ['en-US','ja-JP','ko-KR'].map((language)=>item.names?.[language]).filter(Boolean).join(' / '); }

function updateProjectAssetPreview() {
  const enabled=els.projectAssetHasBase.checked;
  els.projectAssetBaseEditor.classList.toggle('disabled',!enabled);
  if(!enabled)return;
  const src=state.projectAssetImageDataUrl||projectAssetUrl(els.projectAssetCurrentSrc.value);
  const crop={x:projectAssetNumber(els.projectAssetCropX,0),y:projectAssetNumber(els.projectAssetCropY,0),w:Math.max(.1,projectAssetNumber(els.projectAssetCropW,100)),h:Math.max(.1,projectAssetNumber(els.projectAssetCropH,100))};
  const previewWidth=Math.max(.001,crop.w/2);const previewHeight=Math.max(.001,crop.h);
  els.projectAssetPreview.style.backgroundImage=src?`url("${src.replaceAll('"','%22')}")`:'';
  els.projectAssetPreview.style.backgroundSize=`${10000/previewWidth}% ${10000/previewHeight}%`;
  els.projectAssetPreview.style.backgroundPosition=`${crop.x/Math.max(.001,100-previewWidth)*100}% ${crop.y/Math.max(.001,100-previewHeight)*100}%`;
  els.projectAssetPreview.querySelector('span').hidden=Boolean(src);
}

function renderProjectAssetList() {
  const query=els.projectAssetSearch.value.trim().toLowerCase();
  const items=(state.projectAssets?.characters||[]).filter((item)=>Object.values(item.names||{}).some((name)=>String(name).toLowerCase().includes(query))||String(item.id).toLowerCase().includes(query));
  els.projectAssetList.replaceChildren(...(items.length?items.map((item)=>{
    const button=document.createElement('button');button.type='button';button.className=`asset-character-button ${item.id===state.projectAssetSelectedId?'active':''}`;
    const thumb=document.createElement('span');thumb.className='asset-character-thumb';if(item.basePreset?.src)thumb.style.backgroundImage=`url("${projectAssetUrl(item.basePreset.src).replaceAll('"','%22')}")`;
    const text=document.createElement('span');const title=document.createElement('strong');title.textContent=item.names?.['zh-CN']||item.id;const note=document.createElement('small');note.textContent=projectAssetDisplayNames(item)||'外文名待填写';text.append(title,note);button.append(thumb,text);
    button.addEventListener('click',()=>selectProjectAsset(item.id));return button;
  }):[empty('没有找到对应角色。')]));
}

function fillProjectAssetForm(item) {
  const isNew=!item;const preset=item?.basePreset;
  state.projectAssetSelectedId=item?.id||'';state.projectAssetImageDataUrl='';els.projectAssetImage.value='';els.projectAssetOriginalId.value=item?.id||'';els.projectAssetId.value=item?.id||'';
  els.projectAssetZh.value=item?.names?.['zh-CN']||'';els.projectAssetEn.value=item?.names?.['en-US']||'';els.projectAssetJa.value=item?.names?.['ja-JP']||'';els.projectAssetKo.value=item?.names?.['ko-KR']||'';
  els.projectAssetHasBase.checked=isNew||Boolean(preset);els.projectAssetCurrentSrc.value=preset?.src||'';els.projectAssetImageWidth.value=preset?.imageWidth||426;els.projectAssetImageHeight.value=preset?.imageHeight||426;
  els.projectAssetCropX.value=preset?.crop?.x??3;els.projectAssetCropY.value=preset?.crop?.y??44;els.projectAssetCropW.value=preset?.crop?.w??93;els.projectAssetCropH.value=preset?.crop?.h??13;els.projectAssetStretchLeft.value=preset?.stretch?.left??29;els.projectAssetStretchRight.value=preset?.stretch?.right??78;els.projectAssetEdge.value=preset?.edge??10;
  els.projectAssetMode.textContent=isNew?'新增角色':'编辑角色';els.projectAssetTitle.textContent=item?.names?.['zh-CN']||'新角色';els.deleteProjectAsset.hidden=isNew;els.projectAssetMessage.textContent='';updateProjectAssetPreview();renderProjectAssetList();
}

function selectProjectAsset(id) { const item=projectAssetById(id);if(item)fillProjectAssetForm(item); }
function newProjectAsset() { fillProjectAssetForm(null);setTimeout(()=>els.projectAssetZh.focus(),0); }

async function loadProjectAssets({keepSelection=true}={}) {
  const data=await api('/api/server/project-assets');state.projectAssets=data;els.projectApiRevision.textContent=`版本 ${data.revision||1} · ${data.characters?.length||0} 项 · ${formatDate(data.updatedAt)}`;
  const selected=keepSelection&&projectAssetById(state.projectAssetSelectedId)?state.projectAssetSelectedId:(data.characters?.[0]?.id||'');renderProjectAssetList();if(selected)selectProjectAsset(selected);else newProjectAsset();return data;
}

function fileDataUrl(file) { return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||''));reader.onerror=()=>reject(new Error('无法读取底图文件。'));reader.readAsDataURL(file);}); }
function imageDimensions(src) { return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve({width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>reject(new Error('底图文件无法解码。'));image.src=src;}); }

async function saveProjectAsset(event) {
  event.preventDefault();els.projectAssetMessage.textContent='正在保存并发布 API...';
  try {
    const hasBase=els.projectAssetHasBase.checked;
    const body={originalId:els.projectAssetOriginalId.value,id:els.projectAssetId.value,names:{'zh-CN':els.projectAssetZh.value,'en-US':els.projectAssetEn.value,'ja-JP':els.projectAssetJa.value,'ko-KR':els.projectAssetKo.value},imageDataUrl:state.projectAssetImageDataUrl,basePreset:hasBase?{src:els.projectAssetCurrentSrc.value,imageWidth:projectAssetNumber(els.projectAssetImageWidth,426),imageHeight:projectAssetNumber(els.projectAssetImageHeight,426),crop:{x:projectAssetNumber(els.projectAssetCropX,0),y:projectAssetNumber(els.projectAssetCropY,0),w:projectAssetNumber(els.projectAssetCropW,100),h:projectAssetNumber(els.projectAssetCropH,100)},stretch:{left:projectAssetNumber(els.projectAssetStretchLeft,25),right:projectAssetNumber(els.projectAssetStretchRight,75)},edge:projectAssetNumber(els.projectAssetEdge,0)}:null};
    const result=await api('/api/server/project-assets',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(body)});state.projectAssets=result.manifest;state.projectAssetSelectedId=result.character.id;fillProjectAssetForm(result.character);els.projectApiRevision.textContent=`版本 ${result.manifest.revision} · ${result.manifest.characters.length} 项 · ${formatDate(result.manifest.updatedAt)}`;els.projectAssetMessage.textContent='已保存，公开 API 现在就是这个版本。';
  } catch(error) { els.projectAssetMessage.textContent=error.message; }
}

async function deleteProjectAsset() {
  const id=els.projectAssetOriginalId.value;if(!id||!confirm(`确认删除「${els.projectAssetZh.value||id}」的翻译和底图 API 数据？`))return;
  try { const result=await api(`/api/server/project-assets/${encodeURIComponent(id)}`,{method:'DELETE'});state.projectAssets=result.manifest;state.projectAssetSelectedId='';renderProjectAssetList();const next=result.manifest.characters?.[0];if(next)selectProjectAsset(next.id);else newProjectAsset();els.projectApiRevision.textContent=`版本 ${result.manifest.revision} · ${result.manifest.characters.length} 项 · ${formatDate(result.manifest.updatedAt)}`; } catch(error) { els.projectAssetMessage.textContent=error.message; }
}

function formatBytes(value) { const bytes=Math.max(0,Number(value||0));if(bytes<1024)return `${bytes} B`;if(bytes<1024*1024)return `${(bytes/1024).toFixed(1)} KB`;return `${(bytes/1024/1024).toFixed(1)} MB`; }
function renderAppRelease(release) {
  state.appRelease=release;els.appReleaseVersion.value=release.version||'0.2.0';els.appReleaseTitle.value=release.title||'';els.appReleaseNotes.value=release.notes||'';els.appReleaseUrl.value=release.download?.url&&release.download.url!=='/api/app-release/download'?release.download.url:'';
  els.appReleaseCurrent.textContent=release.download?`当前下载：${release.download.fileName||release.download.url} · ${release.download.bytes?formatBytes(release.download.bytes):'外部地址'} · 发布于 ${formatDate(release.publishedAt)}`:'尚未上传安装包，也未填写外部下载地址。';
}
async function loadAppRelease(){const release=await api('/api/server/app-release');renderAppRelease(release);return release;}
async function saveAppRelease(event){event.preventDefault();els.appReleaseMessage.textContent='正在发布版本信息...';try{const result=await api('/api/server/app-release',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({version:els.appReleaseVersion.value,title:els.appReleaseTitle.value,notes:els.appReleaseNotes.value,downloadUrl:els.appReleaseUrl.value})});renderAppRelease(result.release);els.appReleaseMessage.textContent='版本 API 已发布，客户端下次检查即可看到。';}catch(error){els.appReleaseMessage.textContent=error.message;}}
function uploadAppReleasePackage(){const file=els.appReleasePackage.files?.[0];if(!file){els.appReleaseMessage.textContent='请先选择 EXE、MSI 或 ZIP 安装包。';return;}if(file.size>500*1024*1024){els.appReleaseMessage.textContent='安装包不能超过 500 MB。';return;}els.uploadAppRelease.disabled=true;const request=new XMLHttpRequest();request.open('PUT','/api/server/app-release/package');request.withCredentials=true;request.setRequestHeader('x-csrf-token',state.csrf);request.setRequestHeader('x-file-name',encodeURIComponent(file.name));request.setRequestHeader('content-type','application/octet-stream');request.upload.onprogress=(event)=>{const percent=event.lengthComputable?Math.round(event.loaded/event.total*100):0;els.appReleaseMessage.textContent=`正在上传 ${file.name}${percent?` · ${percent}%`:''}`;};request.onload=()=>{els.uploadAppRelease.disabled=false;let body={};try{body=JSON.parse(request.responseText||'{}');}catch{}if(request.status<200||request.status>=300){els.appReleaseMessage.textContent=body.error||`上传失败：HTTP ${request.status}`;return;}renderAppRelease(body.release);els.appReleasePackage.value='';els.appReleaseMessage.textContent='安装包已上传。确认版本号和说明后，再点击“发布版本信息”。';};request.onerror=()=>{els.uploadAppRelease.disabled=false;els.appReleaseMessage.textContent='安装包上传失败，请检查网络。';};request.send(file);}

document.querySelectorAll('[data-tab]').forEach((tab)=>tab.addEventListener('click',()=>switchTab(tab.dataset.tab)));
document.querySelectorAll('[data-refresh]').forEach((item)=>item.addEventListener('click',()=>loadStatus()));
els.quickWhitelist.addEventListener('click',()=>{switchTab('whitelist');setTimeout(()=>els.whitelistEmail.focus(),0);});
els.loginForm.addEventListener('submit',async(event)=>{event.preventDefault();els.loginMessage.textContent='正在登录';try{const data=await api('/api/server/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password:els.password.value})});state.csrf=data.csrf||'';els.password.value='';await Promise.all([loadIcons(),loadStatus(),loadProjectAssets(),loadAppRelease()]);}catch(error){els.loginMessage.textContent=error.message;}});
els.logout.addEventListener('click',async()=>{try{await api('/api/server/logout',{method:'POST'});}finally{showLogin('已退出登录。');}});
els.whitelistForm.addEventListener('submit',async(event)=>{event.preventDefault();const email=els.whitelistEmail.value.trim().toLowerCase();await saveWhitelist([...(state.status?.community?.whitelist||[]),email]);els.whitelistEmail.value='';});
els.chartSearch?.addEventListener('input',()=>{state.chartQuery=els.chartSearch.value;renderManagedCharts(state.status?.community?.currentCharts||[]);});
els.chartCharacter?.addEventListener('change',()=>{state.chartCharacter=els.chartCharacter.value;renderManagedCharts(state.status?.community?.currentCharts||[]);});
els.chartTag?.addEventListener('change',()=>{state.chartTag=els.chartTag.value;renderManagedCharts(state.status?.community?.currentCharts||[]);});
els.smtpForm.addEventListener('submit',async(event)=>{event.preventDefault();els.smtpMessage.textContent='正在保存';try{await api('/api/server/community/smtp',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({host:els.smtpHost.value,port:Number(els.smtpPort.value),user:els.smtpUser.value,pass:els.smtpPass.value,from:els.smtpFrom.value,to:els.smtpTo.value,secure:els.smtpSecure.checked})});els.smtpMessage.textContent='设置已保存。';await loadStatus({quiet:true});}catch(error){els.smtpMessage.textContent=error.message;}});
els.smtpTest.addEventListener('click',async()=>{els.smtpMessage.textContent='正在发送测试邮件';try{await api('/api/server/community/smtp/test',{method:'POST'});els.smtpMessage.textContent='测试邮件已发送。';}catch(error){els.smtpMessage.textContent=error.message;}});
els.update.addEventListener('click',async()=>{if(!confirm('确认拉取三个 GitHub 仓库并重启网站？私有投稿不会被覆盖。'))return;els.update.disabled=true;try{const result=await api('/api/server/update',{method:'POST'});els.output.textContent=`新版本 ${result.releaseId} 已构建，服务正在重启。`;setTimeout(()=>loadStatus({quiet:true}).catch(()=>{}),1800);}catch(error){els.output.textContent=error.body?.update?.error||error.message;}});
els.projectAssetForm.addEventListener('submit',saveProjectAsset);els.deleteProjectAsset.addEventListener('click',deleteProjectAsset);els.newProjectAsset.addEventListener('click',newProjectAsset);els.refreshProjectAssets.addEventListener('click',()=>loadProjectAssets());
els.appReleaseForm.addEventListener('submit',saveAppRelease);els.uploadAppRelease.addEventListener('click',uploadAppReleasePackage);
els.projectAssetSearch.addEventListener('input',renderProjectAssetList);els.projectAssetHasBase.addEventListener('change',updateProjectAssetPreview);
for(const input of [els.projectAssetCropX,els.projectAssetCropY,els.projectAssetCropW,els.projectAssetCropH])input.addEventListener('input',updateProjectAssetPreview);
els.projectAssetZh.addEventListener('input',()=>{els.projectAssetTitle.textContent=els.projectAssetZh.value||'新角色';});
els.projectAssetImage.addEventListener('change',async()=>{const file=els.projectAssetImage.files?.[0];if(!file)return;if(file.size>3*1024*1024){els.projectAssetMessage.textContent='底图不能超过 3 MB。';els.projectAssetImage.value='';return;}try{const dataUrl=await fileDataUrl(file);const size=await imageDimensions(dataUrl);state.projectAssetImageDataUrl=dataUrl;els.projectAssetImageWidth.value=size.width;els.projectAssetImageHeight.value=size.height;els.projectAssetMessage.textContent=`已读取 ${size.width} × ${size.height}，保存后才会发布。`;updateProjectAssetPreview();}catch(error){els.projectAssetMessage.textContent=error.message;}});
els.copyProjectApi.addEventListener('click',async()=>{const url=new URL(els.projectApiUrl.textContent,location.origin).toString();try{await navigator.clipboard.writeText(url);els.copyProjectApi.textContent='已复制';setTimeout(()=>{els.copyProjectApi.textContent='复制地址';},1200);}catch{prompt('复制 API 地址',url);}});
els.openUpload.addEventListener('click',openUpload);els.closeUpload.addEventListener('click',closeUpload);els.cancelUpload.addEventListener('click',closeUpload);els.closeReview.addEventListener('click',closeReview);els.axisScale.addEventListener('input',applyAxisScale);
els.uploadForm.addEventListener('submit',async(event)=>{event.preventDefault();const file=els.uploadFile.files?.[0];if(!file)return;els.uploadMessage.textContent='正在校验并生成网站更新...';try{const content=JSON.parse((await file.text()).replace(/^\ufeff/,''));const profile={username:els.uploadUsername.value.trim(),email:els.uploadEmail.value.trim().toLowerCase()};localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));const result=await api('/api/server/submissions/publish',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...profile,fileName:file.name,content})});els.uploadMessage.textContent=`已发布：${result.chart?.title||file.name}`;setTimeout(()=>{closeUpload();loadStatus();},800);}catch(error){els.uploadMessage.textContent=error.message;}});
els.passwordForm.addEventListener('submit',async(event)=>{event.preventDefault();if(els.newPassword.value!==els.confirmPassword.value){els.passwordMessage.textContent='两次输入的新密码不一致。';return;}els.passwordMessage.textContent='正在修改';try{const result=await api('/api/server/password',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({currentPassword:els.currentPassword.value,newPassword:els.newPassword.value})});state.csrf=result.csrf||state.csrf;els.passwordForm.reset();els.passwordMessage.textContent='密码已修改并由你设置。';}catch(error){els.passwordMessage.textContent=error.message;}});
for(const backdrop of [els.reviewBackdrop,els.uploadBackdrop]) backdrop.addEventListener('click',(event)=>{if(event.target===backdrop)(backdrop===els.reviewBackdrop?closeReview:closeUpload)();});
window.addEventListener('keydown',(event)=>{if(event.key==='Escape'){if(!els.uploadBackdrop.hidden)closeUpload();else if(!els.reviewBackdrop.hidden)closeReview();}});
loadStatus().then(()=>Promise.all([loadIcons(),loadProjectAssets(),loadAppRelease()])).catch(()=>{});

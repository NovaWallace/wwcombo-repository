const byId = (id) => document.getElementById(id);
const els = {
  loginPanel: byId('loginPanel'), loginForm: byId('loginForm'), password: byId('passwordInput'), loginMessage: byId('loginMessage'),
  dashboard: byId('dashboard'), topActions: byId('topActions'), logout: byId('logoutBtn'), update: byId('updateBtn'), statusDot: byId('statusDot'),
  serviceStatus: byId('serviceStatus'), releaseSummary: byId('releaseSummary'), releaseId: byId('releaseId'), releaseTime: byId('releaseTime'),
  chartCount: byId('chartCount'), listenAddress: byId('listenAddress'), mainCommit: byId('mainCommit'), data1Commit: byId('data1Commit'), data2Commit: byId('data2Commit'),
  updateStatus: byId('updateStatus'), output: byId('outputBox'), submissionCount: byId('submissionCount'), withdrawalCount: byId('withdrawalCount'),
  submissionList: byId('submissionList'), withdrawalList: byId('withdrawalList'), whitelistForm: byId('whitelistForm'), whitelistEmail: byId('whitelistEmail'),
  whitelistList: byId('whitelistList'), quickWhitelist: byId('quickWhitelistBtn'), smtpForm: byId('smtpForm'), smtpHost: byId('smtpHost'),
  smtpPort: byId('smtpPort'), smtpUser: byId('smtpUser'), smtpPass: byId('smtpPass'), smtpFrom: byId('smtpFrom'), smtpTo: byId('smtpTo'),
  smtpSecure: byId('smtpSecure'), smtpTest: byId('smtpTestBtn'), smtpMessage: byId('smtpMessage'), reviewBackdrop: byId('reviewBackdrop'),
  reviewTitle: byId('reviewTitle'), reviewSubmitter: byId('reviewSubmitter'), reviewRisk: byId('reviewRisk'), reviewMeta: byId('reviewMeta'),
  reviewTags: byId('reviewTags'), reviewIssues: byId('reviewIssues'), reviewApprove: byId('reviewApproveBtn'), reviewReject: byId('reviewRejectBtn'),
  closeReview: byId('closeReviewBtn'), axisPreview: byId('axisPreview'), axisScale: byId('axisScale'), axisScaleValue: byId('axisScaleValue'),
  uploadBackdrop: byId('uploadBackdrop'), openUpload: byId('openUploadBtn'), closeUpload: byId('closeUploadBtn'), cancelUpload: byId('cancelUploadBtn'),
  uploadForm: byId('adminUploadForm'), uploadUsername: byId('uploadUsername'), uploadEmail: byId('uploadEmail'), uploadFile: byId('uploadFile'), uploadMessage: byId('uploadMessage'),
  passwordForm: byId('passwordForm'), currentPassword: byId('currentPassword'), newPassword: byId('newPassword'), confirmPassword: byId('confirmPassword'), passwordMessage: byId('passwordMessage')
};

const PROFILE_KEY = 'wwcombo-maintainer-publish-profile-v1';
const DEFAULT_MOVE_LABELS = { basic_attack:'a', heavy_attack:'z', skill:'e', skill_hold:'E', echo:'q', echo_hold:'Q', liberation:'r', liberation_hold:'R', dodge:'s', dodge_hold:'S', jump:'j', jump_hold:'J', tool:'t', finisher:'f', forward:'w', switch_1:'i', switch_2:'ii', switch_3:'iii', intro:'b', outro:'y' };
const ICONS = [
  ['长按共鸣解放','liberation-hold'],['长按普攻','mouse-left-hold'],['长按技能','skill-hold'],['长按声骸','echo-hold'],['长按解放','liberation-hold'],['长按跳跃','jump-hold'],['长按闪避','mouse-right-hold'],
  ['共鸣解放','liberation'],['终结技','finisher'],['长按普攻','mouse-left-hold'],['普攻','mouse-left'],['重击','mouse-left-hold'],['技能','skill'],['声骸','echo'],['解放','liberation'],['闪避','mouse-right'],['跳跃','jump'],['工具','tool'],['变奏','intro'],['延奏','outro'],['处决','finisher'],['前走','forward'],
  ['iii','iii'],['ii','ii'],['E','skill-hold'],['Q','echo-hold'],['R','liberation-hold'],['S','mouse-right-hold'],['D','mouse-right-hold'],['J','jump-hold'],['a','mouse-left'],['z','mouse-left-hold'],['e','skill'],['q','echo'],['r','liberation'],['s','mouse-right'],['d','mouse-right'],['j','jump'],['t','tool'],['b','intro'],['y','outro'],['f','finisher'],['w','forward'],['i','i']
].sort((left, right) => right[0].length - left[0].length);
const CHINESE_ICON_NAMES = { i:'i.png', ii:'ii.png', iii:'iii.png', intro:'变奏.png', outro:'延奏.png', forward:'前走.png' };
const state = { csrf:'', status:null, pollTimer:0, review:null, icons:new Map() };

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

function taskRow(title, meta, detail, actions=[]) { const row=document.createElement('article'); row.className='task-row'; const content=document.createElement('div'); const heading=document.createElement('strong'); heading.textContent=title; const metadata=document.createElement('span'); metadata.textContent=meta; const note=document.createElement('small'); note.textContent=detail; content.append(heading,metadata,note); const controls=document.createElement('div'); controls.className='row-actions'; controls.append(...actions); row.append(content,controls); return row; }
function renderWithdrawals(items) { els.withdrawalCount.textContent=items.length; els.withdrawalList.replaceChildren(...(items.length ? items.map((item)=>taskRow(`连段 ${item.comboId}`,`${item.username || '未命名'} · ${item.email || '邮箱未知'} · ${formatDate(item.submittedAt)}`,'邮箱未能与所有权记录匹配，请人工确认。',[button('拒绝','quiet danger',()=>withdrawalAction(item.id,'reject')),button('批准撤回','primary',()=>withdrawalAction(item.id,'approve'))])) : [empty('当前没有需要人工处理的撤回申请。')])); }

async function submissionAction(id, action) { const reason=action==='reject' ? (prompt('可填写拒绝原因（选填）') || '') : ''; if(action==='approve'&&!confirm('确认公开这条连段？')) return; await api(`/api/server/submissions/${encodeURIComponent(id)}/${action}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({reason})}); closeReview(); await loadStatus(); }
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
  const community=data.community||{}; renderSubmissions(community.submissions?.pending||[]); renderWithdrawals(community.withdrawals?.pending||[]); renderWhitelist(community.whitelist||[]); renderSmtp(community.smtp||{});
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

document.querySelectorAll('[data-tab]').forEach((tab)=>tab.addEventListener('click',()=>switchTab(tab.dataset.tab)));
document.querySelectorAll('[data-refresh]').forEach((item)=>item.addEventListener('click',()=>loadStatus()));
els.quickWhitelist.addEventListener('click',()=>{switchTab('whitelist');setTimeout(()=>els.whitelistEmail.focus(),0);});
els.loginForm.addEventListener('submit',async(event)=>{event.preventDefault();els.loginMessage.textContent='正在登录';try{const data=await api('/api/server/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password:els.password.value})});state.csrf=data.csrf||'';els.password.value='';await Promise.all([loadIcons(),loadStatus()]);}catch(error){els.loginMessage.textContent=error.message;}});
els.logout.addEventListener('click',async()=>{try{await api('/api/server/logout',{method:'POST'});}finally{showLogin('已退出登录。');}});
els.whitelistForm.addEventListener('submit',async(event)=>{event.preventDefault();const email=els.whitelistEmail.value.trim().toLowerCase();await saveWhitelist([...(state.status?.community?.whitelist||[]),email]);els.whitelistEmail.value='';});
els.smtpForm.addEventListener('submit',async(event)=>{event.preventDefault();els.smtpMessage.textContent='正在保存';try{await api('/api/server/community/smtp',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({host:els.smtpHost.value,port:Number(els.smtpPort.value),user:els.smtpUser.value,pass:els.smtpPass.value,from:els.smtpFrom.value,to:els.smtpTo.value,secure:els.smtpSecure.checked})});els.smtpMessage.textContent='设置已保存。';await loadStatus({quiet:true});}catch(error){els.smtpMessage.textContent=error.message;}});
els.smtpTest.addEventListener('click',async()=>{els.smtpMessage.textContent='正在发送测试邮件';try{await api('/api/server/community/smtp/test',{method:'POST'});els.smtpMessage.textContent='测试邮件已发送。';}catch(error){els.smtpMessage.textContent=error.message;}});
els.update.addEventListener('click',async()=>{if(!confirm('确认拉取三个 GitHub 仓库并重启网站？私有投稿不会被覆盖。'))return;els.update.disabled=true;try{const result=await api('/api/server/update',{method:'POST'});els.output.textContent=`新版本 ${result.releaseId} 已构建，服务正在重启。`;setTimeout(()=>loadStatus({quiet:true}).catch(()=>{}),1800);}catch(error){els.output.textContent=error.body?.update?.error||error.message;}});
els.openUpload.addEventListener('click',openUpload);els.closeUpload.addEventListener('click',closeUpload);els.cancelUpload.addEventListener('click',closeUpload);els.closeReview.addEventListener('click',closeReview);els.axisScale.addEventListener('input',applyAxisScale);
els.uploadForm.addEventListener('submit',async(event)=>{event.preventDefault();const file=els.uploadFile.files?.[0];if(!file)return;els.uploadMessage.textContent='正在校验并生成网站更新...';try{const content=JSON.parse((await file.text()).replace(/^\ufeff/,''));const profile={username:els.uploadUsername.value.trim(),email:els.uploadEmail.value.trim().toLowerCase()};localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));const result=await api('/api/server/submissions/publish',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...profile,fileName:file.name,content})});els.uploadMessage.textContent=`已发布：${result.chart?.title||file.name}`;setTimeout(()=>{closeUpload();loadStatus();},800);}catch(error){els.uploadMessage.textContent=error.message;}});
els.passwordForm.addEventListener('submit',async(event)=>{event.preventDefault();if(els.newPassword.value!==els.confirmPassword.value){els.passwordMessage.textContent='两次输入的新密码不一致。';return;}els.passwordMessage.textContent='正在修改';try{const result=await api('/api/server/password',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({currentPassword:els.currentPassword.value,newPassword:els.newPassword.value})});state.csrf=result.csrf||state.csrf;els.passwordForm.reset();els.passwordMessage.textContent='密码已修改并由你设置。';}catch(error){els.passwordMessage.textContent=error.message;}});
for(const backdrop of [els.reviewBackdrop,els.uploadBackdrop]) backdrop.addEventListener('click',(event)=>{if(event.target===backdrop)(backdrop===els.reviewBackdrop?closeReview:closeUpload)();});
window.addEventListener('keydown',(event)=>{if(event.key==='Escape'){if(!els.uploadBackdrop.hidden)closeUpload();else if(!els.reviewBackdrop.hidden)closeReview();}});
loadStatus().then(loadIcons).catch(()=>{});

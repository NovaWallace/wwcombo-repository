const byId = (id) => document.getElementById(id);
const els = {
  loginPanel: byId('loginPanel'), loginForm: byId('loginForm'), password: byId('passwordInput'), loginMessage: byId('loginMessage'),
  dashboard: byId('dashboard'), topActions: byId('topActions'), logout: byId('logoutBtn'), update: byId('updateBtn'), statusDot: byId('statusDot'),
  serviceStatus: byId('serviceStatus'), releaseSummary: byId('releaseSummary'), releaseId: byId('releaseId'), releaseTime: byId('releaseTime'),
  chartCount: byId('chartCount'), listenAddress: byId('listenAddress'), mainCommit: byId('mainCommit'), data1Commit: byId('data1Commit'), data2Commit: byId('data2Commit'),
  updateStatus: byId('updateStatus'), output: byId('outputBox'), submissionCount: byId('submissionCount'), withdrawalCount: byId('withdrawalCount'),
  autoApproveLowRisk: byId('autoApproveLowRisk'), autoApproveLowRiskStatus: byId('autoApproveLowRiskStatus'),
  chartManageCount: byId('chartManageCount'), chartManageList: byId('chartManageList'), chartSearch: byId('chartSearchInput'), chartCharacter: byId('chartCharacterSelect'), chartTag: byId('chartTagSelect'),
  submissionList: byId('submissionList'), withdrawalList: byId('withdrawalList'), whitelistForm: byId('whitelistForm'), whitelistEmail: byId('whitelistEmail'),
  whitelistList: byId('whitelistList'), quickWhitelist: byId('quickWhitelistBtn'), smtpForm: byId('smtpForm'), smtpHost: byId('smtpHost'),
  smtpPort: byId('smtpPort'), smtpUser: byId('smtpUser'), smtpPass: byId('smtpPass'), smtpFrom: byId('smtpFrom'), smtpTo: byId('smtpTo'),
  smtpSecure: byId('smtpSecure'), smtpTest: byId('smtpTestBtn'), smtpMessage: byId('smtpMessage'), reviewBackdrop: byId('reviewBackdrop'),
  reviewTitle: byId('reviewTitle'), reviewSubmitter: byId('reviewSubmitter'), reviewRisk: byId('reviewRisk'), reviewMeta: byId('reviewMeta'),
  reviewTags: byId('reviewTags'), reviewIssues: byId('reviewIssues'), reviewApprove: byId('reviewApproveBtn'), reviewReject: byId('reviewRejectBtn'),
  closeReview: byId('closeReviewBtn'), axisPreview: byId('axisPreview'), axisScale: byId('axisScale'), axisScaleValue: byId('axisScaleValue'), reviewAxisSummary: byId('reviewAxisSummary'),
  manageDetailBackdrop: byId('manageDetailBackdrop'), closeManageDetail: byId('closeManageDetailBtn'), manageDetailTitle: byId('manageDetailTitle'), manageDetailSubmitter: byId('manageDetailSubmitter'),
  manageDetailCharacters: byId('manageDetailCharacters'), manageDetailTags: byId('manageDetailTags'), manageDetailMeta: byId('manageDetailMeta'), manageDetailDescriptionSection: byId('manageDetailDescriptionSection'),
  manageDetailDescription: byId('manageDetailDescription'), manageDetailDownload: byId('manageDetailDownload'), manageDetailDelete: byId('manageDetailDelete'), manageAxisPreview: byId('manageAxisPreview'), manageAxisSummary: byId('manageAxisSummary'),
  adminAxisScales: [...document.querySelectorAll('[data-admin-axis-scale]')], adminAxisScaleValues: [...document.querySelectorAll('[data-admin-axis-scale-value]')], adminIconSetButtons: [...document.querySelectorAll('[data-admin-icon-set]')],
  uploadBackdrop: byId('uploadBackdrop'), openUpload: byId('openUploadBtn'), closeUpload: byId('closeUploadBtn'), cancelUpload: byId('cancelUploadBtn'),
  uploadForm: byId('adminUploadForm'), uploadUsername: byId('uploadUsername'), uploadEmail: byId('uploadEmail'), uploadFile: byId('uploadFile'), uploadMessage: byId('uploadMessage'),
  confirmBackdrop: byId('confirmBackdrop'), confirmTitle: byId('confirmTitle'), confirmMessage: byId('confirmMessage'), confirmCancel: byId('confirmCancelBtn'), confirmAccept: byId('confirmAcceptBtn'),
  passwordForm: byId('passwordForm'), currentPassword: byId('currentPassword'), newPassword: byId('newPassword'), confirmPassword: byId('confirmPassword'), passwordMessage: byId('passwordMessage'),
  projectAssetSearch: byId('projectAssetSearch'), projectAssetList: byId('projectAssetList'), projectAssetForm: byId('projectAssetForm'), projectAssetOriginalId: byId('projectAssetOriginalId'),
  projectAssetId: byId('projectAssetId'), projectAssetZh: byId('projectAssetZh'), projectAssetEn: byId('projectAssetEn'), projectAssetJa: byId('projectAssetJa'), projectAssetKo: byId('projectAssetKo'),
  projectAssetHasBase: byId('projectAssetHasBase'), projectAssetBaseEditor: byId('projectAssetBaseEditor'), projectAssetImage: byId('projectAssetImage'), projectAssetCurrentSrc: byId('projectAssetCurrentSrc'),
  projectAssetImageWidth: byId('projectAssetImageWidth'), projectAssetImageHeight: byId('projectAssetImageHeight'), projectAssetCropX: byId('projectAssetCropX'), projectAssetCropY: byId('projectAssetCropY'),
  projectAssetCropW: byId('projectAssetCropW'), projectAssetCropH: byId('projectAssetCropH'), projectAssetStretchLeft: byId('projectAssetStretchLeft'), projectAssetStretchRight: byId('projectAssetStretchRight'),
  projectAssetEdge: byId('projectAssetEdge'), projectAssetPreview: byId('projectAssetPreview'), projectAssetTitle: byId('projectAssetTitle'), projectAssetMode: byId('projectAssetMode'),
  projectAssetMessage: byId('projectAssetMessage'), deleteProjectAsset: byId('deleteProjectAssetBtn'), newProjectAsset: byId('newProjectAssetBtn'), refreshProjectAssets: byId('refreshProjectAssetsBtn'), syncProjectAssets: byId('syncProjectAssetsBtn'),
  copyProjectApi: byId('copyProjectApiBtn'), projectApiUrl: byId('projectApiUrl'), projectApiRevision: byId('projectApiRevision'),
  appReleaseForm: byId('appReleaseForm'), appReleaseVersion: byId('appReleaseVersion'), appReleaseTitle: byId('appReleaseTitle'), appReleaseNotes: byId('appReleaseNotes'), appReleaseChinaUrl: byId('appReleaseChinaUrl'), appReleaseGlobalUrl: byId('appReleaseGlobalUrl'),
  appReleaseCurrent: byId('appReleaseCurrent'), appReleaseMessage: byId('appReleaseMessage')
};

const PROFILE_KEY = 'wwcombo-maintainer-publish-profile-v1';
const DEFAULT_MOVE_LABELS = { basic_attack:'a', heavy_attack:'z', skill:'e', skill_hold:'E', echo:'q', echo_hold:'Q', liberation:'r', liberation_hold:'R', dodge:'s', dodge_hold:'S', jump:'j', jump_hold:'J', tool:'t', finisher:'f', forward:'w', switch_1:'i', switch_2:'ii', switch_3:'iii', intro:'b', outro:'y' };
const ICONS = [
  ['长按共鸣解放','liberation-hold'],['长按普攻','mouse-left-hold'],['长按技能','skill-hold'],['长按声骸','echo-hold'],['长按解放','liberation-hold'],['长按跳跃','jump-hold'],['长按闪避','mouse-right-hold'],
  ['共鸣解放','liberation'],['终结技','finisher'],['长按普攻','mouse-left-hold'],['普攻','mouse-left'],['重击','mouse-left-hold'],['技能','skill'],['声骸','echo'],['解放','liberation'],['闪避','mouse-right'],['跳跃','jump'],['工具','tool'],['变奏','intro'],['延奏','outro'],['处决','finisher'],['前走','forward'],
  ['iii','iii'],['ii','ii'],['E','skill-hold'],['Q','echo-hold'],['R','liberation-hold'],['S','mouse-right-hold'],['D','mouse-right-hold'],['J','jump-hold'],['a','mouse-left'],['z','mouse-left-hold'],['e','skill'],['q','echo'],['r','liberation'],['s','mouse-right'],['d','mouse-right'],['j','jump'],['t','tool'],['b','intro'],['y','outro'],['f','finisher'],['w','forward'],['i','i']
].sort((left, right) => right[0].length - left[0].length);
const CHINESE_ICON_NAMES = { i:'i.png', ii:'ii.png', iii:'iii.png', intro:'变奏.png', outro:'延奏.png', forward:'前走.png' };
const ROLE_COLORS = ['#d84f55', '#44c8c6', '#d7ad52'];
const AXIS_ICON_SIZE = 31;
const AXIS_AVATAR_SIZE = 34;
const GAMEPAD_ICON_CODES = { 'mouse-left':'GamepadX','mouse-left-hold':'GamepadXHold',skill:'GamepadY','skill-hold':'GamepadYHold',echo:'GamepadLT','echo-hold':'GamepadLTHold',liberation:'GamepadRB','liberation-hold':'GamepadRBHold','mouse-right':'GamepadRT','mouse-right-hold':'GamepadRTHold',jump:'GamepadA','jump-hold':'GamepadAHold',tool:'GamepadLB+GamepadX',i:'GamepadDPadUp',ii:'GamepadDPadRight',iii:'GamepadDPadDown' };
const PURE_GRAPHIC_ICON_IDS = new Set(['echo-hold','echo','finisher','jump-hold','jump','liberation-hold','liberation','mouse-left-hold','mouse-left','mouse-right-hold','mouse-right','skill-hold','skill','tool']);
const ADMIN_AXIS_ICON_MAPPINGS = [
  ['mouse-right-hold','长按闪避','长按闪避.png',['S','D','闪','长按闪避']],['mouse-left-hold','重击','重击.png',['z','Z','长按普攻','重击']],['skill-hold','长按技能','长按技能.png',['E','长按技能']],['echo-hold','长按声骸','长按声骸.png',['Q','长按声骸']],['liberation-hold','长按解放','长按解放.png',['R','长按解放','长按共鸣解放']],['jump-hold','长按跳跃','长按跳跃.png',['J','长按跳跃']],
  ['mouse-left','普攻','普攻.png',['a','普攻']],['skill','技能','技能.png',['e','技能']],['echo','声骸','声骸.png',['q','声骸']],['liberation','共鸣解放','解放.png',['r','共鸣解放']],['mouse-right','闪避','闪避.png',['s','d','闪避']],['jump','跳跃','跳跃.png',['j','跳跃','跳']],['tool','工具','工具.png',['t','工具']],['intro','变奏','变奏.png',['b','变奏']],['outro','延奏','延奏.png',['y','延奏']],['finisher','处决','处决.png',['f','处决','终结技']],['forward','前走','前走.png',['w','前走']],['iii','3','iii.png',['iii']],['ii','2','ii.png',['ii']],['i','1','i.png',['i']]
].map(([id,label,fileName,triggers])=>({ id,label,triggers,englishSrc:`/assets/button-icons/${id}.png`,graphicSrc:PURE_GRAPHIC_ICON_IDS.has(id)?`/assets/graphic-icons/${id}.png`:`/assets/botton/${encodeURIComponent(fileName)}`,gamepadCode:GAMEPAD_ICON_CODES[id] }));
const ADMIN_AXIS_ICON_TRIGGERS = ADMIN_AXIS_ICON_MAPPINGS.flatMap((mapping)=>mapping.triggers.map((trigger)=>({trigger,mapping}))).sort((left,right)=>right.trigger.length-left.trigger.length);
const state = { csrf:'', status:null, pollTimer:0, review:null, manageDetail:null, icons:new Map(), chartPackages:new Map(), axisIconSet:'english', axisScale:1.25, chartQuery:'', chartCharacter:'', chartTag:'', projectAssets:null, projectAssetSelectedId:'', projectAssetImageDataUrl:'', confirmationResolve:null };

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
function syncModalBody() { const open=[els.reviewBackdrop,els.manageDetailBackdrop,els.uploadBackdrop,els.confirmBackdrop].some((item)=>item&&!item.hidden); document.body.classList.toggle('modal-open',open); }
function closeConfirmation(result=false) { if(els.confirmBackdrop.hidden)return; els.confirmBackdrop.hidden=true; const resolve=state.confirmationResolve; state.confirmationResolve=null; syncModalBody(); if(resolve)resolve(result); }
function askConfirmation(message, options={}) { if(state.confirmationResolve)closeConfirmation(false); els.confirmTitle.textContent=options.title||'确认操作';els.confirmMessage.textContent=message;els.confirmAccept.textContent=options.confirmText||'确认';els.confirmAccept.className=options.danger===false?'primary':'primary danger';els.confirmBackdrop.hidden=false;document.body.classList.add('modal-open');return new Promise((resolve)=>{state.confirmationResolve=resolve;}); }

function gamepadSvgDataUri(svg) { return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`; }
function gamepadSingleGlyph(core, iconSet) {
  const xboxColors={A:'#67b843',B:'#df4b43',X:'#36a9db',Y:'#f2c443'};
  if(core in xboxColors){if(iconSet==='xbox')return `<circle cx="64" cy="64" r="45" fill="${xboxColors[core]}" stroke="#fff" stroke-width="7"/><text x="64" y="78" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="42" font-weight="900" fill="#171b1e">${core}</text>`;const symbols={A:'<path d="M45 45L83 83M83 45L45 83"/>',B:'<circle cx="64" cy="64" r="22"/>',X:'<rect x="43" y="43" width="42" height="42"/>',Y:'<path d="M64 39L88 82H40Z"/>'};return `<circle cx="64" cy="64" r="50" fill="#252a2e" stroke="#fff" stroke-width="7"/><g fill="none" stroke="#5ba9e6" stroke-width="9">${symbols[core]}</g>`;}
  const shoulder=(iconSet==='playstation'?{LB:'L1',RB:'R1',LT:'L2',RT:'R2'}:{LB:'LB',RB:'RB',LT:'LT',RT:'RT'})[core];
  if(shoulder)return `<path d="M22 38Q22 25 35 25H93Q106 25 106 38V91H22Z" fill="#252a2e" stroke="#fff" stroke-width="7"/><text x="64" y="73" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="34" font-weight="900" fill="#fff">${shoulder}</text>`;
  if(core.startsWith('DPad')){const rotation={Up:0,Right:90,Down:180,Left:270}[core.slice(4)];if(rotation===undefined)return null;return `<path d="M49 17H79V47H109V81H79V111H49V81H19V47H49Z" fill="#252a2e" stroke="#fff" stroke-width="7"/><g transform="rotate(${rotation} 64 64)"><path d="M50 48L64 29L78 48Z" fill="#df4b43"/></g>`;}
  return null;
}
function gamepadIconSource(code,iconSet){const parts=String(code||'').split('+').map((source)=>{const body=source.replace(/^Gamepad/,'');const hold=body.endsWith('Hold');return{core:hold?body.slice(0,-4):body,hold};});if(!parts.length||parts.some((part)=>!gamepadSingleGlyph(part.core,iconSet)))return'';const combo=parts.length>1;const width=combo?210:128;const glyphs=combo?parts.slice(0,2).map((part,index)=>`<g transform="translate(${index*90+3} 19) scale(.7)">${gamepadSingleGlyph(part.core,iconSet)}${part.hold?'<circle cx="64" cy="64" r="57" fill="none" stroke="#ffd43b" stroke-width="6" stroke-dasharray="62 18"/>':''}</g>`).join(''):`${gamepadSingleGlyph(parts[0].core,iconSet)}${parts[0].hold?'<circle cx="64" cy="64" r="57" fill="none" stroke="#ffd43b" stroke-width="6" stroke-dasharray="62 18"/>':''}`;const plus=combo?'<path d="M105 49V79M90 64H120" stroke="#fff" stroke-width="8" stroke-linecap="round"/>':'';return gamepadSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 128">${glyphs}${plus}</svg>`);}

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

function tagAccent(tags) { if(tags.includes('轮椅'))return'#44c8c6';if(tags.includes('基础'))return'#4bd29c';if(tags.includes('进阶'))return'#d7ad52';if(tags.includes('冒烟'))return'#e94f55';return'#778187'; }

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
  if (!id || !(await askConfirmation(`确认删除「${title || id}」？删除后当前网站会隐藏它。`,{title:'删除连段',confirmText:'删除'}))) return;
  await api(`/api/server/charts/${encodeURIComponent(id)}/delete`, { method:'POST' });
  closeManageDetail();
  await loadStatus();
}

function renderManagedCharts(charts) {
  if (!els.chartManageList) return;
  syncChartManageFilters(charts);
  const filtered = managedCharts(charts);
  els.chartManageCount.textContent = filtered.length;
  els.chartManageList.replaceChildren(...(filtered.length ? filtered.map((chart) => {
    const tags=Array.isArray(chart.tags)?chart.tags.filter(Boolean):[];const characters=chartCharacters(chart).slice(0,3);const submitter=chart.submitter||{};
    const card=document.createElement('article');card.className='combo-card';card.style.setProperty('--accent',tagAccent(tags));
    const accent=document.createElement('div');accent.className='combo-accent';
    const main=document.createElement('div');main.className='combo-main';const titleRow=document.createElement('div');titleRow.className='combo-title-row';const titleCopy=document.createElement('div');const title=document.createElement('h3');title.textContent=chart.title||'未命名连段';const characterLine=document.createElement('p');characterLine.className='characters';characterLine.textContent=characters.join(' / ')||'未知角色';titleCopy.append(title,characterLine);const tagList=document.createElement('div');tagList.className='combo-tags';for(const tag of tags){const chip=document.createElement('span');chip.className='combo-tag';chip.textContent=tag;tagList.appendChild(chip);}titleRow.append(titleCopy,tagList);
    const meta=document.createElement('dl');meta.className='combo-meta';for(const [key,value] of [['轮次',`${Math.max(1,Number(chart.rounds||1))} 轮`],['轴长',formatDuration(chart.durationMs)],['循环轴切人',`${Number(chart.loopSwitchCount||0)} 次`],['更新',formatDate(chart.updatedAt)],['评价',`赞 ${Number(chart.votes?.up||0)} · 踩 ${Number(chart.votes?.down||0)}`]]){const item=document.createElement('div');const dt=document.createElement('dt');dt.textContent=key;const dd=document.createElement('dd');dd.textContent=value;item.append(dt,dd);meta.appendChild(item);}main.append(titleRow,meta);
    const actions=document.createElement('div');actions.className='combo-actions';const avatarStack=document.createElement('div');avatarStack.className='card-characters';for(const name of characters)avatarStack.appendChild(avatar(name,'card-character-avatar'));const submitterBox=document.createElement('div');submitterBox.className='card-submitter';const label=document.createElement('span');label.textContent='上传者';const submitterLine=document.createElement('span');submitterLine.className='submitter-line';const submitterName=document.createElement('strong');submitterName.textContent=submitter.nickname||'历史投稿';submitterLine.appendChild(submitterName);if(submitter.avatar)submitterLine.appendChild(avatar(submitter.avatar,'submitter-avatar-img'));if(submitter.badge){const badge=document.createElement('em');badge.className='submitter-badge';badge.textContent=submitter.badge;submitterLine.appendChild(badge);}const email=document.createElement('small');email.textContent=submitter.email||'未记录邮箱';submitterBox.append(label,submitterLine,email);const detail=button('详情','detail-button',()=>openManagedChart(chart));actions.append(avatarStack,submitterBox,detail);card.append(accent,main,actions);return card;
  }) : [empty('没有找到对应连段。')]));
}

function taskRow(title, meta, detail, actions=[]) { const row=document.createElement('article'); row.className='task-row'; const content=document.createElement('div'); const heading=document.createElement('strong'); heading.textContent=title; const metadata=document.createElement('span'); metadata.textContent=meta; const note=document.createElement('small'); note.textContent=detail; content.append(heading,metadata,note); const controls=document.createElement('div'); controls.className='row-actions'; controls.append(...actions); row.append(content,controls); return row; }
function renderWithdrawals(items) { els.withdrawalCount.textContent=items.length; els.withdrawalList.replaceChildren(...(items.length ? items.map((item)=>taskRow(`连段 ${item.comboId}`,`${item.username || '未命名'} · ${item.email || '邮箱未知'} · ${formatDate(item.submittedAt)}`,'邮箱未能与所有权记录匹配，请人工确认。',[button('拒绝','quiet danger',()=>withdrawalAction(item.id,'reject')),button('批准撤回','primary',()=>withdrawalAction(item.id,'approve'))])) : [empty('当前没有需要人工处理的撤回申请。')])); }

async function submissionAction(id, action) { const reason=action==='reject' ? (prompt('可填写拒绝原因（选填）') || '') : ''; await api(`/api/server/submissions/${encodeURIComponent(id)}/${action}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({reason})}); closeReview(); await loadStatus(); }
async function withdrawalAction(id, action) { if(action==='approve'&&!await askConfirmation('确认人工批准这条撤回申请？',{title:'批准撤回',confirmText:'批准'})) return; await api(`/api/server/withdrawals/${encodeURIComponent(id)}/${action}`,{method:'POST'}); await loadStatus(); }

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
function renderReviewSettings(settings={}) { const enabled=settings.autoApproveLowRisk===true; els.autoApproveLowRisk.checked=enabled; els.autoApproveLowRiskStatus.textContent=enabled?'已开启 · 新投稿自动发布':'关闭 · 低风险仍需审核'; els.autoApproveLowRisk.title=enabled?'低风险投稿将自动发布':'低风险投稿仍进入审核队列'; }

async function saveReviewSettings(enabled) {
  els.autoApproveLowRisk.disabled=true;
  els.autoApproveLowRiskStatus.textContent='正在保存';
  try {
    await api('/api/server/community/review-settings',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({autoApproveLowRisk:enabled})});
    await loadStatus({quiet:true});
  } catch(error) {
    renderReviewSettings(state.status?.community?.reviewSettings||{});
    els.autoApproveLowRiskStatus.textContent=`保存失败：${error.message}`;
  } finally {
    els.autoApproveLowRisk.disabled=false;
  }
}

function renderStatus(data) {
  state.status=data; state.csrf=data.csrf||state.csrf; els.loginPanel.hidden=true; els.dashboard.hidden=false; els.topActions.hidden=false;
  const update=data.update||{}; const busy=update.status==='running'; const failed=update.status==='failed';
  els.statusDot.classList.toggle('busy',busy); els.statusDot.classList.toggle('error',failed); els.serviceStatus.textContent=busy?'正在更新仓库':failed?'上次更新失败':'服务运行中';
  els.releaseSummary.textContent=`${Number(data.release?.charts||0)} 个连段 · ${formatDate(data.release?.createdAt)}`; els.releaseId.textContent=data.release?.releaseId||'-'; els.releaseTime.textContent=formatDate(data.release?.createdAt); els.chartCount.textContent=`${Number(data.release?.charts||0)} 个`; els.listenAddress.textContent=`${data.server?.host||'-'}:${data.server?.port||'-'}`; els.mainCommit.textContent=short(data.release?.commits?.repository); els.data1Commit.textContent=short(data.release?.commits?.deta1); els.data2Commit.textContent=short(data.release?.commits?.deta2);
  els.update.disabled=busy; els.update.textContent=busy?'正在更新':'从 GitHub 更新并重启'; els.updateStatus.textContent=busy?'运行中':failed?'失败':update.status==='completed'?'已完成':'等待操作'; const output=[...(update.output||[])]; if(update.error) output.push('',`错误：${update.error}`); els.output.textContent=output.length?output.join('\n'):'尚未执行更新。';
  const community=data.community||{}; renderSubmissions(community.submissions?.pending||[]); renderManagedCharts(community.currentCharts||[]); renderWithdrawals(community.withdrawals?.pending||[]); renderWhitelist(community.whitelist||[]); renderSmtp(community.smtp||{}); renderReviewSettings(community.reviewSettings||{});
}

function showLogin(message='') { clearTimeout(state.pollTimer); els.dashboard.hidden=true; els.topActions.hidden=true; els.loginPanel.hidden=false; els.loginMessage.textContent=message; state.csrf=''; }
async function loadStatus({quiet=false}={}) { try { const data=await api('/api/server/status'); renderStatus(data); clearTimeout(state.pollTimer); state.pollTimer=setTimeout(()=>loadStatus({quiet:true}),7000); return data; } catch(error) { if(error.status===401) showLogin(quiet?'':'请输入你设置的管理员密码。'); else if(!quiet) showLogin(error.message); throw error; } }

function avatar(name,className='role-avatar') { const image=document.createElement('img'); image.className=className; image.src=state.icons.get(name)||'/assets/unknown-character.jpg'; image.alt=name||''; image.title=name||''; image.addEventListener('error',()=>{image.src='/assets/unknown-character.jpg';image.classList.add('unknown-avatar');},{once:true}); return image; }
async function loadIcons() { try { const response=await fetch('/assets/character-icons.json'); const data=await response.json(); state.icons=new Map(Array.isArray(data)?data:[]); } catch { state.icons=new Map(); } }
function chartOf(pack) { return pack?.chart || (Array.isArray(pack?.charts) ? pack.charts[0] : null); }
function charactersOf(chart) { const community=chart?.community||{}; const source=Array.isArray(community.characters)?community.characters:Array.isArray(chart?.characters)?chart.characters:String(chart?.character||'').split('/');return source.filter(Boolean).slice(0,3); }
function axisPeriodLabel(period,loopCount){const label=String(period.label||'').trim();if(period.kind==='startup_axis')return label&&label!=='启动轴'&&label!=='完整连段'?label:(label==='完整连段'?'完整连段':'启动轴');if(label&&!/^循环轴\d*$/.test(label))return label;return loopCount>1?`循环轴${period.loopIndex||1}`:'循环轴';}
function axisLabel(step,labels){return String(labels?.[step.id]||DEFAULT_MOVE_LABELS[step.moveId]||step.label||step.moveId||'').trim();}
function axisIconParts(value){const text=String(value||'');const parts=[];let buffer='';let index=0;const push=()=>{if(buffer)parts.push({kind:'text',value:buffer});buffer='';};while(index<text.length){if(text[index]==='['){const closing=text.indexOf(']',index+1);if(closing>=0){push();const literal=text.slice(index+1,closing);if(literal)parts.push({kind:'text',value:literal});index=closing+1;continue;}}const match=ADMIN_AXIS_ICON_TRIGGERS.find(({trigger})=>text.startsWith(trigger,index));if(!match){buffer+=text[index++];continue;}push();parts.push({kind:'icon',mapping:match.mapping});index+=match.trigger.length;}push();return parts;}
function axisMappingSource(mapping){if(['xbox','playstation'].includes(state.axisIconSet)&&mapping.gamepadCode)return gamepadIconSource(mapping.gamepadCode,state.axisIconSet);return state.axisIconSet==='graphic'?mapping.graphicSrc:mapping.englishSrc;}
function groupAxisSteps(steps){const groups=[];let current=null;for(const step of steps){const switched=/^switch_([123])$/.exec(String(step.moveId||''));const slot=Math.max(1,Math.min(3,Number(step.characterSlot||switched?.[1]||1)));if(!current||switched){current={slot,steps:[]};groups.push(current);}current.steps.push(step);}return groups;}
function estimateAxisActionWidth(value){const parts=axisIconParts(value);return Math.max(20,parts.reduce((width,part)=>width+(part.kind==='icon'?(part.mapping.gamepadCode?.includes('+')&&['xbox','playstation'].includes(state.axisIconSet)?49:AXIS_ICON_SIZE):Math.max(14,Array.from(part.value).length*12)),0)+Math.max(0,parts.length-1)*2);}
function splitAxisMoveGroups(groups,labels,target){const maxWidth=Math.max(220,target.clientWidth-72);const chunks=[];for(const group of groups){let chunk={slot:group.slot,steps:[],showAvatar:true};let width=(20+AXIS_AVATAR_SIZE+8)*state.axisScale;for(const step of group.steps){const actionWidth=estimateAxisActionWidth(axisLabel(step,labels))*state.axisScale;const next=width+(chunk.steps.length?5*state.axisScale:0)+actionWidth;if(chunk.steps.length&&next>maxWidth){chunks.push(chunk);chunk={slot:group.slot,steps:[],showAvatar:false};width=20*state.axisScale;}width+=(chunk.steps.length?5*state.axisScale:0)+actionWidth;chunk.steps.push(step);}if(chunk.steps.length)chunks.push(chunk);}return chunks;}
function axisActionContent(value){const action=document.createElement('span');action.className='axis-action';for(const part of axisIconParts(value)){if(part.kind==='text'){const text=document.createElement('span');text.textContent=part.value;action.appendChild(text);continue;}const image=document.createElement('img');image.className='axis-action-icon';image.src=axisMappingSource(part.mapping);image.alt=part.mapping.label;image.title=part.mapping.label;if(part.mapping.gamepadCode?.includes('+')&&['xbox','playstation'].includes(state.axisIconSet))image.classList.add('is-wide');action.appendChild(image);}return action;}
function renderAxis(pack,indexChart,target=els.axisPreview,summary=els.reviewAxisSummary){const chart=chartOf(pack)||(Array.isArray(pack?.steps)?pack:null);if(!chart||!Array.isArray(chart.steps))throw new Error('连段 JSON 缺少轴数据。');const all=(chart.periods||[]).filter((period)=>['startup_axis','loop_axis'].includes(period?.kind)).sort((a,b)=>Number(a.startMs||0)-Number(b.startMs||0));const loops=all.filter((period)=>period.kind==='loop_axis');const tags=new Set([...(indexChart?.tags||[]),...(chart.community?.tags||[])]);const showAll=tags.has('错轮');let periods=showAll?all:[all.find((period)=>period.kind==='startup_axis'),loops[0]].filter(Boolean);if(!periods.length){const end=chart.steps.reduce((max,step)=>Math.max(max,Number(step.startMax||step.startMin||0)+Number(step.durationMax||0)),0);periods=[{label:'完整连段',kind:'startup_axis',startMs:0,endMs:end}];}const labels=pack.contentLabels&&typeof pack.contentLabels==='object'?pack.contentLabels:{};const chars=chartCharacters(indexChart||{}).length?chartCharacters(indexChart):charactersOf(chart);const fragment=document.createDocumentFragment();let stepCount=0;let blockCount=0;for(const period of periods){const start=Number(period.startMs||0);const end=Number(period.endMs||Infinity);const steps=chart.steps.filter((step)=>Number(step.startMin||0)>=start&&Number(step.startMin||0)<end).sort((a,b)=>Number(a.startMin||0)-Number(b.startMin||0)||String(a.id||'').localeCompare(String(b.id||'')));stepCount+=steps.length;const groups=splitAxisMoveGroups(groupAxisSteps(steps),labels,target);blockCount+=groups.length;const section=document.createElement('section');section.className='axis-group';section.style.setProperty('--axis-scale',String(state.axisScale));section.style.setProperty('--axis-color',period.kind==='startup_axis'?'#d7ad52':'#44c8c6');const head=document.createElement('div');head.className='axis-group-head';const title=document.createElement('strong');title.textContent=axisPeriodLabel(period,loops.length);const range=document.createElement('span');range.textContent=`${formatDuration(start)} - ${formatDuration(Number.isFinite(end)?end:start)}`;head.append(title,range);const flow=document.createElement('div');flow.className='axis-flow';for(const group of groups){const character=chars[group.slot-1]||`角色${group.slot}`;const block=document.createElement('div');block.className=`axis-step${group.showAvatar?'':' axis-move-continuation'}`;block.style.setProperty('--role-color',ROLE_COLORS[group.slot-1]);const actionLabels=group.steps.map((step)=>axisLabel(step,labels));block.title=`${character} · ${actionLabels.join('')}`;if(group.showAvatar)block.appendChild(avatar(character,'mini-avatar'));const actions=document.createElement('div');actions.className='axis-move-content';for(const label of actionLabels)actions.appendChild(axisActionContent(label));block.appendChild(actions);flow.appendChild(block);}section.append(head,flow);fragment.appendChild(section);}target.replaceChildren(fragment);summary.textContent=`${showAll?'错轮 · 全部轮次':periods.map((period)=>axisPeriodLabel(period,loops.length)).join(' + ')} · ${stepCount} 步 · ${blockCount} 招式块`;}
function renderAxisControls(){for(const button of els.adminIconSetButtons){const active=button.dataset.adminIconSet===state.axisIconSet;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));}const percent=Math.round(state.axisScale*100);for(const input of els.adminAxisScales)input.value=String(percent);for(const output of els.adminAxisScaleValues)output.value=`${percent}%`;}
function renderActiveAdminAxes(){if(state.review?.content)renderAxis(state.review.content,state.review.submission?.preview||{},els.axisPreview,els.reviewAxisSummary);if(state.manageDetail?.content)renderAxis(state.manageDetail.content,state.manageDetail.chart,els.manageAxisPreview,els.manageAxisSummary);}
function applyAxisScale(value){state.axisScale=Math.max(.8,Math.min(1.8,Number(value||125)/100));renderAxisControls();renderActiveAdminAxes();}

async function openReview(id) { els.reviewBackdrop.hidden=false; document.body.classList.add('modal-open'); renderAxisControls();els.reviewTitle.textContent='正在读取投稿';els.reviewAxisSummary.textContent='正在读取轴数据';els.axisPreview.innerHTML='<div class="axis-loading"><span></span><span></span><span></span></div>';try{const data=await api(`/api/server/submissions/${encodeURIComponent(id)}/preview`);state.review={id,...data};const item=data.submission||{};const chart=chartOf(data.content);const preview=item.preview||{};const preflight=data.preflight||item.preflight||{};els.reviewTitle.textContent=preview.title||item.fileName||'未命名投稿';els.reviewSubmitter.textContent=`${item.username||'未命名'} · ${item.email||'邮箱未知'} · ${formatDate(item.submittedAt)}`;els.reviewRisk.className=`risk-badge ${preflight.lowRisk?'low':'attention'}`;els.reviewRisk.textContent=preflight.lowRisk?'低风险':'需要注意';els.reviewMeta.replaceChildren();const meta=[['角色',(preview.characters||charactersOf(chart)).join(' / ')||'未知'],['轮数',`${preview.rounds||1} 轮`],['招式',`${preview.stepCount||chart.steps.length} 个`],['时长',formatDuration(preview.durationMs)]];for(const [key,value] of meta){const row=document.createElement('div');row.innerHTML='<span></span><strong></strong>';row.querySelector('span').textContent=key;row.querySelector('strong').textContent=value;els.reviewMeta.appendChild(row);}els.reviewTags.replaceChildren(...(preview.tags||[]).map((tag)=>{const node=document.createElement('span');node.textContent=tag;return node;}));els.reviewIssues.replaceChildren(...((preflight.issues||[]).length?(preflight.issues||[]).map((issue)=>{const p=document.createElement('p');p.textContent=issue;return p;}):[Object.assign(document.createElement('p'),{textContent:'未发现连续 6 次同招式或无法图标化的自定义文字。'})]));els.reviewApprove.onclick=()=>submissionAction(id,'approve');els.reviewReject.onclick=()=>submissionAction(id,'reject');renderAxis(data.content,preview,els.axisPreview,els.reviewAxisSummary);}catch(error){els.reviewAxisSummary.textContent='无法读取轴数据';els.axisPreview.innerHTML='';const p=document.createElement('p');p.className='error-text';p.textContent=error.message;els.axisPreview.appendChild(p);}}
function closeReview(){els.reviewBackdrop.hidden=true;state.review=null;if(els.uploadBackdrop.hidden&&els.manageDetailBackdrop.hidden)document.body.classList.remove('modal-open');}

function detailMetaRow(label,value){const row=document.createElement('div');const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=value;row.append(dt,dd);return row;}
async function loadManagedPackage(chart){if(state.chartPackages.has(chart.url))return state.chartPackages.get(chart.url);const request=fetch(chart.url,{cache:'force-cache'}).then(async(response)=>{if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json();});state.chartPackages.set(chart.url,request);try{return await request;}catch(error){state.chartPackages.delete(chart.url);throw error;}}
async function openManagedChart(chart){state.manageDetail={chart,content:null};els.manageDetailBackdrop.hidden=false;document.body.classList.add('modal-open');renderAxisControls();els.manageDetailTitle.textContent=chart.title||'未命名连段';const submitter=chart.submitter||{};els.manageDetailSubmitter.textContent=`${submitter.nickname||'历史投稿'}${submitter.badge?` · ${submitter.badge}`:''} · ${submitter.email||'未记录邮箱'}`;els.manageDetailCharacters.replaceChildren(...chartCharacters(chart).map((name)=>{const item=document.createElement('span');item.className='detail-character';item.append(avatar(name,'mini-avatar'),document.createTextNode(name));return item;}));els.manageDetailTags.replaceChildren(...(chart.tags||[]).map((tag)=>{const item=document.createElement('span');item.className='detail-tag';item.textContent=tag;return item;}));els.manageDetailMeta.replaceChildren(detailMetaRow('轮次',`${Math.max(1,Number(chart.rounds||1))} 轮`),detailMetaRow('首发角色',chart.firstCharacter||chartCharacters(chart)[0]||'未知'),detailMetaRow('循环轴切人',`${Number(chart.loopSwitchCount||0)} 次`),detailMetaRow('更新',formatDate(chart.updatedAt)),detailMetaRow('上传版本',chart.uploadVersion||'未知'),detailMetaRow('下载',`${Number(chart.downloadCount||0)} 次`),detailMetaRow('评价',`赞 ${Number(chart.votes?.up||0)} · 踩 ${Number(chart.votes?.down||0)}`),detailMetaRow('ID',chart.id||'-'));els.manageDetailDescription.textContent=chart.description||'';els.manageDetailDescriptionSection.hidden=!chart.description;els.manageDetailDownload.href=chart.downloadUrl||chart.url||'#';els.manageDetailDownload.download=`${chart.title||'wwcombo'}-${chart.id||'community'}.wwcombo.json`;els.manageDetailDelete.onclick=async()=>{await deleteManagedChart(chart.id,chart.title);};els.manageAxisSummary.textContent='正在读取轴数据';els.manageAxisPreview.innerHTML='<div class="axis-loading"><span></span><span></span><span></span></div>';try{const content=await loadManagedPackage(chart);if(state.manageDetail?.chart.id!==chart.id)return;state.manageDetail.content=content;renderAxis(content,chart,els.manageAxisPreview,els.manageAxisSummary);}catch(error){if(state.manageDetail?.chart.id!==chart.id)return;els.manageAxisSummary.textContent='无法读取轴数据';els.manageAxisPreview.innerHTML='';const message=document.createElement('p');message.className='error-text';message.textContent=`连段图生成失败：${error.message}`;els.manageAxisPreview.appendChild(message);}}
function closeManageDetail(){els.manageDetailBackdrop.hidden=true;state.manageDetail=null;if(els.reviewBackdrop.hidden&&els.uploadBackdrop.hidden)document.body.classList.remove('modal-open');}

function savedProfile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}');}catch{return {};}}
function openUpload(){const profile=savedProfile();els.uploadUsername.value=profile.username||'';els.uploadEmail.value=profile.email||'';els.uploadFile.value='';els.uploadMessage.textContent='';els.uploadBackdrop.hidden=false;document.body.classList.add('modal-open');setTimeout(()=>els.uploadUsername.focus(),0);}
function closeUpload(){els.uploadBackdrop.hidden=true;if(els.reviewBackdrop.hidden&&els.manageDetailBackdrop.hidden)document.body.classList.remove('modal-open');}

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
    const result=await api('/api/server/project-assets',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(body)});state.projectAssets=result.manifest;state.projectAssetSelectedId=result.character.id;fillProjectAssetForm(result.character);els.projectApiRevision.textContent=`版本 ${result.manifest.revision} · ${result.manifest.characters.length} 项 · ${formatDate(result.manifest.updatedAt)}`;els.projectAssetMessage.textContent='当前角色已保存，公开 API 现在就是这个版本。';
  } catch(error) { els.projectAssetMessage.textContent=error.message; }
}

async function syncProjectAssetNames() {
  els.syncProjectAssets.disabled=true;els.projectAssetMessage.textContent='正在补齐全部角色的外文名...';
  try {
    const result=await api('/api/server/project-assets/sync-seed',{method:'POST'});state.projectAssets=result.manifest;
    const selected=projectAssetById(state.projectAssetSelectedId)?.id||result.manifest.characters?.[0]?.id||'';renderProjectAssetList();if(selected)selectProjectAsset(selected);else newProjectAsset();
    els.projectApiRevision.textContent=`版本 ${result.manifest.revision} · ${result.manifest.characters.length} 项 · ${formatDate(result.manifest.updatedAt)}`;
    els.projectAssetMessage.textContent=result.filledNames||result.addedCharacters?`已补齐 ${result.updatedCharacters} 个角色、${result.filledNames} 个外文名称${result.addedCharacters?`，并新增 ${result.addedCharacters} 个角色`:''}。`:'所有预设角色的外文名已经完整。';
  } catch(error) { els.projectAssetMessage.textContent=error.message; }
  finally { els.syncProjectAssets.disabled=false; }
}

async function deleteProjectAsset() {
  const id=els.projectAssetOriginalId.value;if(!id||!await askConfirmation(`确认删除「${els.projectAssetZh.value||id}」的翻译和底图 API 数据？`,{title:'删除角色 API 数据',confirmText:'删除'}))return;
  try { const result=await api(`/api/server/project-assets/${encodeURIComponent(id)}`,{method:'DELETE'});state.projectAssets=result.manifest;state.projectAssetSelectedId='';renderProjectAssetList();const next=result.manifest.characters?.[0];if(next)selectProjectAsset(next.id);else newProjectAsset();els.projectApiRevision.textContent=`版本 ${result.manifest.revision} · ${result.manifest.characters.length} 项 · ${formatDate(result.manifest.updatedAt)}`; } catch(error) { els.projectAssetMessage.textContent=error.message; }
}

function formatBytes(value) { const bytes=Math.max(0,Number(value||0));if(bytes<1024)return `${bytes} B`;if(bytes<1024*1024)return `${(bytes/1024).toFixed(1)} KB`;return `${(bytes/1024/1024).toFixed(1)} MB`; }
function renderAppRelease(release) {
  const legacyExternal = release.download?.url && release.download.url !== '/api/app-release/download' ? release.download.url : '';
  state.appRelease=release;els.appReleaseVersion.value=release.version||'0.5.0';els.appReleaseTitle.value=release.title||'';els.appReleaseNotes.value=release.notes||'';els.appReleaseChinaUrl.value=release.downloadLinks?.china||'';els.appReleaseGlobalUrl.value=release.downloadLinks?.global||legacyExternal;
  els.appReleaseCurrent.textContent=release.downloadLinks?.china||release.downloadLinks?.global?'已配置国内和/或海外下载地址。':'尚未填写国内或海外下载地址。';
}
async function loadAppRelease(){const release=await api('/api/server/app-release');renderAppRelease(release);return release;}
async function saveAppRelease(event){event.preventDefault();els.appReleaseMessage.textContent='正在发布版本信息...';try{const result=await api('/api/server/app-release',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({version:els.appReleaseVersion.value,title:els.appReleaseTitle.value,notes:els.appReleaseNotes.value,chinaDownloadUrl:els.appReleaseChinaUrl.value,globalDownloadUrl:els.appReleaseGlobalUrl.value})});renderAppRelease(result.release);els.appReleaseMessage.textContent='版本 API 已发布，客户端会按语言选择下载地址。';}catch(error){els.appReleaseMessage.textContent=error.message;}}

document.querySelectorAll('[data-tab]').forEach((tab)=>tab.addEventListener('click',()=>switchTab(tab.dataset.tab)));
document.querySelectorAll('[data-refresh]').forEach((item)=>item.addEventListener('click',()=>loadStatus()));
els.quickWhitelist.addEventListener('click',()=>{switchTab('whitelist');setTimeout(()=>els.whitelistEmail.focus(),0);});
els.loginForm.addEventListener('submit',async(event)=>{event.preventDefault();els.loginMessage.textContent='正在登录';try{const data=await api('/api/server/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password:els.password.value})});state.csrf=data.csrf||'';els.password.value='';await Promise.all([loadIcons(),loadStatus(),loadProjectAssets(),loadAppRelease()]);}catch(error){els.loginMessage.textContent=error.message;}});
els.logout.addEventListener('click',async()=>{try{await api('/api/server/logout',{method:'POST'});}finally{showLogin('已退出登录。');}});
els.whitelistForm.addEventListener('submit',async(event)=>{event.preventDefault();const email=els.whitelistEmail.value.trim().toLowerCase();await saveWhitelist([...(state.status?.community?.whitelist||[]),email]);els.whitelistEmail.value='';});
els.autoApproveLowRisk.addEventListener('change',()=>saveReviewSettings(els.autoApproveLowRisk.checked));
els.chartSearch?.addEventListener('input',()=>{state.chartQuery=els.chartSearch.value;renderManagedCharts(state.status?.community?.currentCharts||[]);});
els.chartCharacter?.addEventListener('change',()=>{state.chartCharacter=els.chartCharacter.value;renderManagedCharts(state.status?.community?.currentCharts||[]);});
els.chartTag?.addEventListener('change',()=>{state.chartTag=els.chartTag.value;renderManagedCharts(state.status?.community?.currentCharts||[]);});
els.smtpForm.addEventListener('submit',async(event)=>{event.preventDefault();els.smtpMessage.textContent='正在保存';try{await api('/api/server/community/smtp',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({host:els.smtpHost.value,port:Number(els.smtpPort.value),user:els.smtpUser.value,pass:els.smtpPass.value,from:els.smtpFrom.value,to:els.smtpTo.value,secure:els.smtpSecure.checked})});els.smtpMessage.textContent='设置已保存。';await loadStatus({quiet:true});}catch(error){els.smtpMessage.textContent=error.message;}});
els.smtpTest.addEventListener('click',async()=>{els.smtpMessage.textContent='正在发送测试邮件';try{await api('/api/server/community/smtp/test',{method:'POST'});els.smtpMessage.textContent='测试邮件已发送。';}catch(error){els.smtpMessage.textContent=error.message;}});
els.update.addEventListener('click',async()=>{if(!await askConfirmation('确认拉取三个 GitHub 仓库并重启网站？私有投稿不会被覆盖。',{title:'更新服务器',confirmText:'更新',danger:false}))return;els.update.disabled=true;try{const result=await api('/api/server/update',{method:'POST'});els.output.textContent=`新版本 ${result.releaseId} 已构建，服务正在重启。`;setTimeout(()=>loadStatus({quiet:true}).catch(()=>{}),1800);}catch(error){els.output.textContent=error.body?.update?.error||error.message;}});
els.projectAssetForm.addEventListener('submit',saveProjectAsset);els.deleteProjectAsset.addEventListener('click',deleteProjectAsset);els.newProjectAsset.addEventListener('click',newProjectAsset);els.refreshProjectAssets.addEventListener('click',()=>loadProjectAssets());els.syncProjectAssets.addEventListener('click',syncProjectAssetNames);
els.appReleaseForm.addEventListener('submit',saveAppRelease);
els.projectAssetSearch.addEventListener('input',renderProjectAssetList);els.projectAssetHasBase.addEventListener('change',updateProjectAssetPreview);
for(const input of [els.projectAssetCropX,els.projectAssetCropY,els.projectAssetCropW,els.projectAssetCropH])input.addEventListener('input',updateProjectAssetPreview);
els.projectAssetZh.addEventListener('input',()=>{els.projectAssetTitle.textContent=els.projectAssetZh.value||'新角色';});
els.projectAssetImage.addEventListener('change',async()=>{const file=els.projectAssetImage.files?.[0];if(!file)return;if(file.size>3*1024*1024){els.projectAssetMessage.textContent='底图不能超过 3 MB。';els.projectAssetImage.value='';return;}try{const dataUrl=await fileDataUrl(file);const size=await imageDimensions(dataUrl);state.projectAssetImageDataUrl=dataUrl;els.projectAssetImageWidth.value=size.width;els.projectAssetImageHeight.value=size.height;els.projectAssetMessage.textContent=`已读取 ${size.width} × ${size.height}，保存后才会发布。`;updateProjectAssetPreview();}catch(error){els.projectAssetMessage.textContent=error.message;}});
els.copyProjectApi.addEventListener('click',async()=>{const url=new URL(els.projectApiUrl.textContent,location.origin).toString();try{await navigator.clipboard.writeText(url);els.copyProjectApi.textContent='已复制';setTimeout(()=>{els.copyProjectApi.textContent='复制地址';},1200);}catch{prompt('复制 API 地址',url);}});
els.openUpload.addEventListener('click',openUpload);els.closeUpload.addEventListener('click',closeUpload);els.cancelUpload.addEventListener('click',closeUpload);els.closeReview.addEventListener('click',closeReview);els.closeManageDetail.addEventListener('click',closeManageDetail);
for(const input of els.adminAxisScales)input.addEventListener('input',()=>applyAxisScale(input.value));
for(const iconButton of els.adminIconSetButtons)iconButton.addEventListener('click',()=>{state.axisIconSet=iconButton.dataset.adminIconSet||'english';renderAxisControls();renderActiveAdminAxes();});
els.uploadForm.addEventListener('submit',async(event)=>{event.preventDefault();const file=els.uploadFile.files?.[0];if(!file)return;els.uploadMessage.textContent='正在校验并生成网站更新...';try{const content=JSON.parse((await file.text()).replace(/^\ufeff/,''));const profile={username:els.uploadUsername.value.trim(),email:els.uploadEmail.value.trim().toLowerCase()};localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));const result=await api('/api/server/submissions/publish',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...profile,fileName:file.name,content})});els.uploadMessage.textContent=`已发布：${result.chart?.title||file.name}`;setTimeout(()=>{closeUpload();loadStatus();},800);}catch(error){els.uploadMessage.textContent=error.message;}});
els.passwordForm.addEventListener('submit',async(event)=>{event.preventDefault();if(els.newPassword.value!==els.confirmPassword.value){els.passwordMessage.textContent='两次输入的新密码不一致。';return;}els.passwordMessage.textContent='正在修改';try{const result=await api('/api/server/password',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({currentPassword:els.currentPassword.value,newPassword:els.newPassword.value})});state.csrf=result.csrf||state.csrf;els.passwordForm.reset();els.passwordMessage.textContent='密码已修改并由你设置。';}catch(error){els.passwordMessage.textContent=error.message;}});
 for(const backdrop of [els.reviewBackdrop,els.manageDetailBackdrop,els.uploadBackdrop]) backdrop.addEventListener('click',(event)=>{if(event.target!==backdrop)return;if(backdrop===els.reviewBackdrop)closeReview();else if(backdrop===els.manageDetailBackdrop)closeManageDetail();else closeUpload();});
 els.confirmCancel.addEventListener('click',()=>closeConfirmation(false));els.confirmAccept.addEventListener('click',()=>closeConfirmation(true));els.confirmBackdrop.addEventListener('click',(event)=>{if(event.target===els.confirmBackdrop)closeConfirmation(false);});
 window.addEventListener('keydown',(event)=>{if(event.key==='Escape'){if(!els.confirmBackdrop.hidden)closeConfirmation(false);else if(!els.uploadBackdrop.hidden)closeUpload();else if(!els.manageDetailBackdrop.hidden)closeManageDetail();else if(!els.reviewBackdrop.hidden)closeReview();}});
let axisResizeTimer=0;window.addEventListener('resize',()=>{clearTimeout(axisResizeTimer);axisResizeTimer=setTimeout(renderActiveAdminAxes,120);});
loadStatus().then(()=>Promise.all([loadIcons(),loadProjectAssets(),loadAppRelease()])).catch(()=>{});

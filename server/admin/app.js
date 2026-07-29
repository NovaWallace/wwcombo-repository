const byId = (id) => document.getElementById(id);
const els = {
  loginPanel: byId('loginPanel'), loginForm: byId('loginForm'), password: byId('passwordInput'), loginMessage: byId('loginMessage'),
  dashboard: byId('dashboard'), logout: byId('logoutBtn'), update: byId('updateBtn'), statusDot: byId('statusDot'),
  serviceStatus: byId('serviceStatus'), releaseSummary: byId('releaseSummary'), releaseId: byId('releaseId'), releaseTime: byId('releaseTime'),
  chartCount: byId('chartCount'), listenAddress: byId('listenAddress'), mainCommit: byId('mainCommit'), data1Commit: byId('data1Commit'),
  data2Commit: byId('data2Commit'), updateStatus: byId('updateStatus'), output: byId('outputBox'), submissionCount: byId('submissionCount'),
  withdrawalCount: byId('withdrawalCount'), submissionList: byId('submissionList'), withdrawalList: byId('withdrawalList'),
  whitelistForm: byId('whitelistForm'), whitelistEmail: byId('whitelistEmail'), whitelistList: byId('whitelistList'),
  smtpForm: byId('smtpForm'), smtpHost: byId('smtpHost'), smtpPort: byId('smtpPort'), smtpUser: byId('smtpUser'), smtpPass: byId('smtpPass'),
  smtpFrom: byId('smtpFrom'), smtpTo: byId('smtpTo'), smtpSecure: byId('smtpSecure'), smtpTest: byId('smtpTestBtn'), smtpMessage: byId('smtpMessage')
};

let csrf = '';
let pollTimer = 0;
let currentStatus = null;

async function api(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (csrf && options.method && options.method !== 'GET') headers['x-csrf-token'] = csrf;
  const response = await fetch(url, { ...options, headers, credentials: 'same-origin' });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error || `HTTP ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body;
}

function formatDate(value) {
  const date = new Date(value || 0);
  return value && !Number.isNaN(date.getTime()) ? date.toLocaleString('zh-CN') : '-';
}

function short(value) {
  return value ? String(value).slice(0, 12) : '-';
}

function button(label, className, handler) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = className;
  item.textContent = label;
  item.addEventListener('click', handler);
  return item;
}

function empty(text) {
  const item = document.createElement('div');
  item.className = 'empty-row';
  item.textContent = text;
  return item;
}

function taskRow(title, meta, detail, actions = []) {
  const row = document.createElement('article');
  row.className = 'task-row';
  const content = document.createElement('div');
  const heading = document.createElement('strong');
  heading.textContent = title;
  const metadata = document.createElement('span');
  metadata.textContent = meta;
  content.append(heading, metadata);
  if (detail) {
    const note = document.createElement('small');
    note.textContent = detail;
    content.append(note);
  }
  const controls = document.createElement('div');
  controls.className = 'row-actions';
  controls.append(...actions);
  row.append(content, controls);
  return row;
}

async function submissionAction(id, action) {
  const reason = action === 'reject' ? (prompt('可填写拒绝原因（选填）') || '') : '';
  if (action === 'approve' && !confirm('确认该连段格式和内容可以公开？')) return;
  await api(`/api/server/submissions/${encodeURIComponent(id)}/${action}`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reason })
  });
  await loadStatus();
}

async function withdrawalAction(id, action) {
  if (action === 'approve' && !confirm('确认人工批准这条撤回申请？')) return;
  await api(`/api/server/withdrawals/${encodeURIComponent(id)}/${action}`, { method: 'POST' });
  await loadStatus();
}

function renderSubmissions(items) {
  els.submissionCount.textContent = items.length;
  els.submissionList.replaceChildren(...(items.length ? items.map((item) => taskRow(
    item.fileName || '未命名投稿',
    `${item.username || '未命名'} · ${item.email || '邮箱未知'} · ${formatDate(item.submittedAt)}`,
    item.notificationError ? `邮件通知：${item.notificationError}` : '邮件通知已发送',
    [button('拒绝', 'quiet danger', () => submissionAction(item.id, 'reject')), button('审核通过', 'primary', () => submissionAction(item.id, 'approve'))]
  )) : [empty('当前没有待审核投稿。')]));
}

function renderWithdrawals(items) {
  els.withdrawalCount.textContent = items.length;
  els.withdrawalList.replaceChildren(...(items.length ? items.map((item) => taskRow(
    `连段 ${item.comboId}`,
    `${item.username || '未命名'} · ${item.email || '邮箱未知'} · ${formatDate(item.submittedAt)}`,
    '邮箱未能与服务器所有权记录自动匹配，请人工确认。',
    [button('拒绝', 'quiet danger', () => withdrawalAction(item.id, 'reject')), button('批准撤回', 'primary', () => withdrawalAction(item.id, 'approve'))]
  )) : [empty('当前没有需要人工处理的撤回申请。')]));
}

function renderWhitelist(emails) {
  els.whitelistList.replaceChildren(...(emails.length ? emails.map((email) => {
    const chip = document.createElement('span');
    chip.className = 'email-chip';
    chip.append(document.createTextNode(email), button('移除', 'chip-remove', async () => {
      await saveWhitelist(emails.filter((item) => item !== email));
    }));
    return chip;
  }) : [empty('尚未设置 UP 白名单。')]));
}

async function saveWhitelist(emails) {
  await api('/api/server/community/whitelist', {
    method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ emails })
  });
  await loadStatus();
}

function renderSmtp(smtp) {
  if (document.activeElement?.closest('#smtpForm')) return;
  els.smtpHost.value = smtp.host || '';
  els.smtpPort.value = smtp.port || 465;
  els.smtpUser.value = smtp.user || '';
  els.smtpPass.value = '';
  els.smtpPass.placeholder = smtp.hasPassword ? '已保存，留空则不修改' : '填写邮箱授权码';
  els.smtpFrom.value = smtp.from || '';
  els.smtpTo.value = smtp.to || '';
  els.smtpSecure.checked = smtp.secure !== false;
}

function renderStatus(data) {
  currentStatus = data;
  csrf = data.csrf || csrf;
  els.loginPanel.hidden = true;
  els.dashboard.hidden = false;
  const update = data.update || {};
  const busy = update.status === 'running';
  const failed = update.status === 'failed';
  els.statusDot.classList.toggle('busy', busy);
  els.statusDot.classList.toggle('error', failed);
  els.serviceStatus.textContent = busy ? '正在更新仓库' : failed ? '上次更新失败' : '服务运行中';
  els.releaseSummary.textContent = `${Number(data.release?.charts || 0)} 个连段 · ${formatDate(data.release?.createdAt)}`;
  els.releaseId.textContent = data.release?.releaseId || '-';
  els.releaseTime.textContent = formatDate(data.release?.createdAt);
  els.chartCount.textContent = `${Number(data.release?.charts || 0)} 个`;
  els.listenAddress.textContent = `${data.server?.host || '-'}:${data.server?.port || '-'}`;
  els.mainCommit.textContent = short(data.release?.commits?.repository);
  els.data1Commit.textContent = short(data.release?.commits?.deta1);
  els.data2Commit.textContent = short(data.release?.commits?.deta2);
  els.update.disabled = busy;
  els.update.textContent = busy ? '正在更新' : '从 GitHub 更新并重启';
  els.updateStatus.textContent = busy ? '运行中' : failed ? '失败' : update.status === 'completed' ? '已完成' : '等待操作';
  const output = [...(update.output || [])];
  if (update.error) output.push('', `错误：${update.error}`);
  els.output.textContent = output.length ? output.join('\n') : '尚未执行更新。';
  const community = data.community || {};
  renderSubmissions(community.submissions?.pending || []);
  renderWithdrawals(community.withdrawals?.pending || []);
  renderWhitelist(community.whitelist || []);
  renderSmtp(community.smtp || {});
}

function showLogin(message = '') {
  clearTimeout(pollTimer);
  els.dashboard.hidden = true;
  els.loginPanel.hidden = false;
  els.loginMessage.textContent = message;
  csrf = '';
}

async function loadStatus({ quiet = false } = {}) {
  try {
    const data = await api('/api/server/status');
    renderStatus(data);
    clearTimeout(pollTimer);
    pollTimer = setTimeout(() => loadStatus({ quiet: true }), 7000);
    return data;
  } catch (error) {
    if (error.status === 401) showLogin(quiet ? '' : '请输入管理员密码。');
    else if (!quiet) showLogin(error.message);
    throw error;
  }
}

document.querySelectorAll('[data-tab]').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('[data-tab]').forEach((item) => item.classList.toggle('active', item === tab));
  document.querySelectorAll('[data-panel]').forEach((panel) => {
    const selected = panel.dataset.panel === tab.dataset.tab;
    panel.hidden = !selected;
    panel.classList.toggle('active', selected);
  });
}));

document.querySelectorAll('[data-refresh]').forEach((item) => item.addEventListener('click', () => loadStatus()));
els.loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  els.loginMessage.textContent = '正在登录';
  try {
    const data = await api('/api/server/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: els.password.value }) });
    csrf = data.csrf || '';
    els.password.value = '';
    await loadStatus();
  } catch (error) {
    els.loginMessage.textContent = error.message;
  }
});
els.logout.addEventListener('click', async () => {
  try { await api('/api/server/logout', { method: 'POST' }); } finally { showLogin('已退出登录。'); }
});
els.whitelistForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = els.whitelistEmail.value.trim().toLowerCase();
  await saveWhitelist([...(currentStatus?.community?.whitelist || []), email]);
  els.whitelistEmail.value = '';
});
els.smtpForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  els.smtpMessage.textContent = '正在保存';
  try {
    await api('/api/server/community/smtp', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
      host: els.smtpHost.value, port: Number(els.smtpPort.value), user: els.smtpUser.value, pass: els.smtpPass.value,
      from: els.smtpFrom.value, to: els.smtpTo.value, secure: els.smtpSecure.checked
    }) });
    els.smtpMessage.textContent = '设置已保存。';
    await loadStatus({ quiet: true });
  } catch (error) { els.smtpMessage.textContent = error.message; }
});
els.smtpTest.addEventListener('click', async () => {
  els.smtpMessage.textContent = '正在发送测试邮件';
  try { await api('/api/server/community/smtp/test', { method: 'POST' }); els.smtpMessage.textContent = '测试邮件已发送。'; }
  catch (error) { els.smtpMessage.textContent = error.message; }
});
els.update.addEventListener('click', async () => {
  if (!confirm('确认拉取三个 GitHub 仓库并重启网站？服务器私有投稿不会被覆盖。')) return;
  els.update.disabled = true;
  try {
    const result = await api('/api/server/update', { method: 'POST' });
    els.output.textContent = `新版本 ${result.releaseId} 已构建，服务正在重启。`;
    setTimeout(() => loadStatus({ quiet: true }).catch(() => {}), 1800);
  } catch (error) { els.output.textContent = error.body?.update?.error || error.message; }
});

loadStatus().catch(() => {});

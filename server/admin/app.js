const els = {
  loginPanel: document.getElementById('loginPanel'),
  loginForm: document.getElementById('loginForm'),
  password: document.getElementById('passwordInput'),
  loginMessage: document.getElementById('loginMessage'),
  dashboard: document.getElementById('dashboard'),
  logout: document.getElementById('logoutBtn'),
  update: document.getElementById('updateBtn'),
  statusDot: document.getElementById('statusDot'),
  serviceStatus: document.getElementById('serviceStatus'),
  releaseId: document.getElementById('releaseId'),
  releaseTime: document.getElementById('releaseTime'),
  chartCount: document.getElementById('chartCount'),
  listenAddress: document.getElementById('listenAddress'),
  mainCommit: document.getElementById('mainCommit'),
  data1Commit: document.getElementById('data1Commit'),
  data2Commit: document.getElementById('data2Commit'),
  updateStatus: document.getElementById('updateStatus'),
  output: document.getElementById('outputBox')
};

let csrf = '';
let pollTimer = 0;

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (csrf && options.method && options.method !== 'GET') headers['x-csrf-token'] = csrf;
  const response = await fetch(path, { ...options, headers, credentials: 'same-origin' });
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
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('zh-CN');
}

function shortCommit(value) {
  return value ? String(value).slice(0, 12) : '-';
}

function showLogin(message = '') {
  clearTimeout(pollTimer);
  els.dashboard.hidden = true;
  els.loginPanel.hidden = false;
  els.loginMessage.textContent = message;
  csrf = '';
}

function renderStatus(data) {
  csrf = data.csrf || csrf;
  els.loginPanel.hidden = true;
  els.dashboard.hidden = false;
  els.releaseId.textContent = data.release?.releaseId || '-';
  els.releaseTime.textContent = formatDate(data.release?.createdAt);
  els.chartCount.textContent = `${Number(data.release?.charts || 0)} 个`;
  els.listenAddress.textContent = `${data.server?.host || '-'}:${data.server?.port || '-'}`;
  els.mainCommit.textContent = shortCommit(data.release?.commits?.repository);
  els.data1Commit.textContent = shortCommit(data.release?.commits?.deta1);
  els.data2Commit.textContent = shortCommit(data.release?.commits?.deta2);

  const update = data.update || {};
  const busy = update.status === 'running';
  const failed = update.status === 'failed';
  els.statusDot.classList.toggle('busy', busy);
  els.statusDot.classList.toggle('error', failed);
  els.serviceStatus.textContent = busy ? '正在更新仓库' : failed ? '上次更新失败' : '服务运行中';
  els.update.disabled = busy;
  els.update.textContent = busy ? '正在更新' : '从 GitHub 更新并重启';
  els.updateStatus.textContent = busy ? '运行中' : failed ? '失败' : update.status === 'completed' ? '已完成' : '等待操作';
  const lines = [...(update.output || [])];
  if (update.error) lines.push('', `错误：${update.error}`);
  els.output.textContent = lines.length ? lines.join('\n') : '尚未执行更新。';
}

async function loadStatus({ quiet = false } = {}) {
  try {
    const data = await api('/api/server/status');
    renderStatus(data);
    clearTimeout(pollTimer);
    pollTimer = setTimeout(() => loadStatus({ quiet: true }), 5000);
    return data;
  } catch (error) {
    if (error.status === 401) showLogin(quiet ? '' : '请输入管理员密码。');
    else if (!quiet) showLogin(error.message);
    throw error;
  }
}

els.loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  els.loginMessage.textContent = '正在登录';
  try {
    const data = await api('/api/server/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password: els.password.value })
    });
    csrf = data.csrf || '';
    els.password.value = '';
    await loadStatus();
  } catch (error) {
    els.loginMessage.textContent = error.message;
  }
});

els.logout.addEventListener('click', async () => {
  try {
    await api('/api/server/logout', { method: 'POST' });
  } finally {
    showLogin('已退出登录。');
  }
});

els.update.addEventListener('click', async () => {
  if (!confirm('确认从 GitHub 拉取三个仓库，校验完成后重启网站服务？')) return;
  els.update.disabled = true;
  els.update.textContent = '正在更新';
  els.updateStatus.textContent = '正在拉取 GitHub';
  els.statusDot.classList.add('busy');
  els.output.textContent = '更新任务已经启动，请稍候。';
  try {
    const result = await api('/api/server/update', { method: 'POST' });
    els.output.textContent = `新版本 ${result.releaseId} 已构建，服务正在重启。`;
    let attempts = 0;
    clearTimeout(pollTimer);
    const waitForRestart = async () => {
      attempts += 1;
      try {
        await loadStatus({ quiet: true });
      } catch {
        if (attempts < 60) pollTimer = setTimeout(waitForRestart, 1000);
      }
    };
    pollTimer = setTimeout(waitForRestart, 1200);
  } catch (error) {
    els.output.textContent = error.body?.update?.error || error.message;
    await loadStatus({ quiet: true }).catch(() => {});
  }
});

loadStatus().catch(() => {});

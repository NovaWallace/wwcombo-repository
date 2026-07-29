#!/usr/bin/env node
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
import { chmod, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCommunityService } from './community.mjs';
import { buildRelease, currentRelease, updateRepositoriesAndBuild } from './release.mjs';

const SERVER_DIR = path.dirname(fileURLToPath(import.meta.url));
const MAIN_ROOT = path.dirname(SERVER_DIR);
const RUNTIME_ROOT = path.resolve(process.env.WWCOMBO_RUNTIME_ROOT || path.join(path.dirname(MAIN_ROOT), 'wwcombo-server-runtime'));
const HOST = String(process.env.WWCOMBO_HOST || '').trim() || '0.0.0.0';
const PORT = Number(process.env.WWCOMBO_PORT || 9881);
const PUBLIC_URL = String(process.env.WWCOMBO_PUBLIC_URL || 'https://Nova.fb520.site').replace(/\/+$/, '');
const TRUST_PROXY = process.env.WWCOMBO_TRUST_PROXY === '1';
const SESSION_SECONDS = 12 * 60 * 60;
const LOGIN_WINDOW_MS = 60 * 1000;
const MAX_LOGIN_FAILURES = 5;
const PUBLIC_ROOT_FILES = new Set(['/index.html', '/app.js', '/i18n.js', '/styles.css', '/site.webmanifest', '/build-info.json']);
const CONTENT_TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.svg', 'image/svg+xml'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.atlas', 'text/plain; charset=utf-8'],
  ['.skel', 'application/octet-stream']
]);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) throw new Error(`Invalid WWCOMBO_PORT: ${process.env.WWCOMBO_PORT}`);

const CONFIG_PATH = path.join(RUNTIME_ROOT, 'config.json');
const config = JSON.parse(await readFile(CONFIG_PATH, 'utf8'));
if (!config?.admin?.salt || !config?.admin?.hash || !config?.sessionSecret) throw new Error('Server admin config is incomplete.');

const startupMessages = [];
let release = await currentRelease({
  mainRoot: MAIN_ROOT,
  runtimeRoot: RUNTIME_ROOT,
  onLog(message) {
    startupMessages.push(message);
    console.log(`[wwcombo] ${message}`);
  }
});
let PUBLIC_ROOT = release.releaseRoot;
let BUILD_INFO = JSON.parse(await readFile(path.join(PUBLIC_ROOT, 'build-info.json'), 'utf8'));
let releaseWrite = Promise.resolve();

function serializeRelease(task) {
  const operation = releaseWrite.then(task, task);
  releaseWrite = operation.catch(() => {});
  return operation;
}

async function rebuildCommunityRelease() {
  return serializeRelease(async () => {
    release = await buildRelease({ mainRoot: MAIN_ROOT, runtimeRoot: RUNTIME_ROOT });
    PUBLIC_ROOT = release.releaseRoot;
    BUILD_INFO = JSON.parse(await readFile(path.join(PUBLIC_ROOT, 'build-info.json'), 'utf8'));
    return release;
  });
}

const community = createCommunityService({ runtimeRoot: RUNTIME_ROOT, rebuildRelease: rebuildCommunityRelease });
await community.initialize();

const loginAttempts = new Map();
const updateState = {
  status: 'idle',
  startedAt: 0,
  finishedAt: 0,
  output: [],
  error: ''
};
let updateRunning = false;

function sendJson(res, statusCode, body, headers = {}) {
  const data = Buffer.from(`${JSON.stringify(body)}\n`, 'utf8');
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': data.length,
    'cache-control': 'no-store',
    ...headers
  });
  res.end(data);
}

function sendText(res, statusCode, message, headers = {}) {
  const data = Buffer.from(String(message), 'utf8');
  res.writeHead(statusCode, {
    'content-type': 'text/plain; charset=utf-8',
    'content-length': data.length,
    'cache-control': 'no-store',
    ...headers
  });
  res.end(data);
}

function safeTarget(root, relative) {
  const rootPath = path.resolve(root);
  const target = path.resolve(rootPath, relative);
  const inside = target === rootPath || target.startsWith(`${rootPath}${path.sep}`);
  return inside ? target : null;
}

function cacheControlFor(relative) {
  if (
    relative.endsWith('.html')
    || relative.endsWith('.js')
    || relative.endsWith('.css')
    || relative.endsWith('site.webmanifest')
    || relative.endsWith('community-index.json')
    || relative.endsWith('build-info.json')
  ) return 'no-cache';
  if (relative.endsWith('.wwcombo.json')) return 'public, max-age=86400';
  return 'public, max-age=604800';
}

async function serveFile(req, res, root, relative) {
  const target = safeTarget(root, relative);
  if (!target) return sendText(res, 403, 'Forbidden');
  let details;
  try {
    details = await stat(target);
  } catch {
    return sendText(res, 404, 'Not found');
  }
  if (!details.isFile()) return sendText(res, 404, 'Not found');

  const etag = `"${details.size.toString(16)}-${Math.floor(details.mtimeMs).toString(16)}"`;
  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, { etag, 'cache-control': cacheControlFor(relative) });
    res.end();
    return;
  }

  let start = 0;
  let end = details.size - 1;
  let statusCode = 200;
  const range = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range || ''));
  if (range) {
    if (!range[1] && range[2]) {
      const suffixLength = Number(range[2]);
      start = Math.max(0, details.size - suffixLength);
    } else {
      start = Number(range[1]);
      if (range[2]) end = Number(range[2]);
    }
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || start >= details.size || end >= details.size) {
      res.writeHead(416, { 'content-range': `bytes */${details.size}` });
      res.end();
      return;
    }
    statusCode = 206;
  }

  const headers = {
    'content-type': CONTENT_TYPES.get(path.extname(target).toLowerCase()) || 'application/octet-stream',
    'content-length': end - start + 1,
    'accept-ranges': 'bytes',
    'cache-control': cacheControlFor(relative),
    etag
  };
  if (statusCode === 206) headers['content-range'] = `bytes ${start}-${end}/${details.size}`;
  res.writeHead(statusCode, headers);
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  if (details.size === 0) {
    res.end();
    return;
  }
  createReadStream(target, { start, end }).pipe(res);
}

async function readJsonBody(req, maxBytes = 16 * 1024) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > maxBytes) throw new Error('Request body is too large.');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

function cookieMap(req) {
  const cookies = new Map();
  for (const part of String(req.headers.cookie || '').split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    cookies.set(part.slice(0, separator).trim(), part.slice(separator + 1).trim());
  }
  return cookies;
}

function signature(value) {
  return createHmac('sha256', config.sessionSecret).update(value).digest('base64url');
}

function createSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const nonce = randomBytes(18).toString('base64url');
  const value = `${expiresAt}.${nonce}`;
  return {
    token: `${value}.${signature(value)}`,
    csrf: signature(`csrf.${nonce}`),
    expiresAt
  };
}

function readSession(req) {
  const token = cookieMap(req).get('wwcombo_admin') || '';
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [expiresRaw, nonce, suppliedSignature] = parts;
  const expectedSignature = signature(`${expiresRaw}.${nonce}`);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return null;
  return { expiresAt, csrf: signature(`csrf.${nonce}`) };
}

function sessionCookie(req, token, maxAge) {
  const secure = Boolean(req.socket.encrypted) || (TRUST_PROXY && req.headers['x-forwarded-proto'] === 'https');
  return `wwcombo_admin=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
}

function verifyPassword(password) {
  const actual = scryptSync(String(password), config.admin.salt, 64);
  const expected = Buffer.from(config.admin.hash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function changePassword(currentPassword, nextPassword) {
  if (!verifyPassword(currentPassword)) throw new Error('当前管理员密码不正确。');
  const value = String(nextPassword || '');
  if (value.length < 10) throw new Error('新密码至少需要 10 个字符。');
  const salt = randomBytes(16).toString('hex');
  config.admin = { salt, hash: scryptSync(value, salt, 64).toString('hex') };
  config.sessionSecret = randomBytes(32).toString('hex');
  config.updatedAt = new Date().toISOString();
  const temporary = `${CONFIG_PATH}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(config, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
  await rename(temporary, CONFIG_PATH);
  await chmod(CONFIG_PATH, 0o600).catch(() => {});
}

function clientAddress(req) {
  if (TRUST_PROXY) return String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  return req.socket.remoteAddress || 'unknown';
}

function requireSession(req, res, requireCsrf = false) {
  const session = readSession(req);
  if (!session) {
    sendJson(res, 401, { error: '请先登录服务器管理后台。' });
    return null;
  }
  if (requireCsrf && req.headers['x-csrf-token'] !== session.csrf) {
    sendJson(res, 403, { error: '页面验证已失效，请刷新后重试。' });
    return null;
  }
  return session;
}

async function publicStatus(session) {
  let currentIndex = { charts: [] };
  try {
    currentIndex = JSON.parse((await readFile(path.join(PUBLIC_ROOT, 'community-index.json'), 'utf8')).replace(/^\ufeff/, ''));
  } catch {}
  return {
    authenticated: true,
    csrf: session.csrf,
    server: { host: HOST, port: PORT, publicUrl: PUBLIC_URL, startedAt: serverStartedAt },
    release: BUILD_INFO,
    update: { ...updateState, output: updateState.output.slice(-80) },
    community: { ...(await community.status()), currentCharts: Array.isArray(currentIndex.charts) ? currentIndex.charts : [] }
  };
}

async function handleAdminApi(req, res, pathname) {
  if (req.method === 'POST' && pathname === '/api/server/login') {
    const address = clientAddress(req);
    const attempt = loginAttempts.get(address) || { failures: 0, blockedUntil: 0 };
    if (attempt.blockedUntil > Date.now()) {
      sendJson(res, 429, { error: '登录尝试过多，请稍后再试。' });
      return;
    }
    const body = await readJsonBody(req);
    if (!verifyPassword(body.password || '')) {
      attempt.failures += 1;
      if (attempt.failures >= MAX_LOGIN_FAILURES) {
        attempt.failures = 0;
        attempt.blockedUntil = Date.now() + LOGIN_WINDOW_MS;
      }
      loginAttempts.set(address, attempt);
      sendJson(res, 401, { error: '管理员密码不正确。' });
      return;
    }
    loginAttempts.delete(address);
    const session = createSession();
    sendJson(res, 200, { ok: true, csrf: session.csrf }, { 'set-cookie': sessionCookie(req, session.token, SESSION_SECONDS) });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/server/status') {
    const session = requireSession(req, res);
    if (session) sendJson(res, 200, await publicStatus(session));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/server/logout') {
    const session = requireSession(req, res, true);
    if (session) sendJson(res, 200, { ok: true }, { 'set-cookie': sessionCookie(req, '', 0) });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/server/password') {
    const session = requireSession(req, res, true);
    if (!session) return;
    const body = await readJsonBody(req);
    await changePassword(body.currentPassword, body.newPassword);
    const replacement = createSession();
    sendJson(res, 200, { ok: true, csrf: replacement.csrf }, { 'set-cookie': sessionCookie(req, replacement.token, SESSION_SECONDS) });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/server/update') {
    const session = requireSession(req, res, true);
    if (!session) return;
    if (updateRunning) {
      sendJson(res, 409, { error: '已有更新任务正在运行。' });
      return;
    }
    updateRunning = true;
    updateState.status = 'running';
    updateState.startedAt = Date.now();
    updateState.finishedAt = 0;
    updateState.output = [];
    updateState.error = '';
    try {
      const nextRelease = await serializeRelease(() => updateRepositoriesAndBuild({
        mainRoot: MAIN_ROOT,
        runtimeRoot: RUNTIME_ROOT,
        onLog(message) {
          updateState.output.push(message);
          if (updateState.output.length > 200) updateState.output.shift();
          console.log(`[wwcombo] ${message}`);
        }
      }));
      updateState.status = 'completed';
      updateState.finishedAt = Date.now();
      sendJson(res, 200, { ok: true, restart: true, releaseId: nextRelease.releaseId });
      setTimeout(() => process.exit(75), 800);
    } catch (error) {
      updateState.status = 'failed';
      updateState.finishedAt = Date.now();
      updateState.error = error.message || String(error);
      console.error(error);
      sendJson(res, 500, { error: updateState.error, update: updateState });
    } finally {
      updateRunning = false;
    }
    return;
  }

  const submissionAction = /^\/api\/server\/submissions\/([^/]+)\/(approve|reject)$/.exec(pathname);
  if (req.method === 'POST' && submissionAction) {
    const session = requireSession(req, res, true);
    if (!session) return;
    const body = await readJsonBody(req);
    const id = decodeURIComponent(submissionAction[1]);
    if (submissionAction[2] === 'approve') sendJson(res, 200, { ok: true, chart: await community.approve(id) });
    else {
      await community.reject(id, body.reason);
      sendJson(res, 200, { ok: true });
    }
    return;
  }

  const submissionPreview = /^\/api\/server\/submissions\/([^/]+)\/preview$/.exec(pathname);
  if (req.method === 'GET' && submissionPreview) {
    const session = requireSession(req, res);
    if (!session) return;
    sendJson(res, 200, await community.submissionContent(decodeURIComponent(submissionPreview[1])));
    return;
  }

  const chartDelete = /^\/api\/server\/charts\/([^/]+)\/delete$/.exec(pathname);
  if (req.method === 'POST' && chartDelete) {
    const session = requireSession(req, res, true);
    if (!session) return;
    sendJson(res, 200, { ok: true, ...(await community.deleteChart(decodeURIComponent(chartDelete[1]))) });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/server/submissions/publish') {
    const session = requireSession(req, res, true);
    if (!session) return;
    sendJson(res, 200, { ok: true, ...(await community.publishDirect(await readJsonBody(req, 2 * 1024 * 1024), clientAddress(req))) });
    return;
  }

  const withdrawalAction = /^\/api\/server\/withdrawals\/([^/]+)\/(approve|reject)$/.exec(pathname);
  if (req.method === 'POST' && withdrawalAction) {
    const session = requireSession(req, res, true);
    if (!session) return;
    const result = await community.resolveWithdrawal(decodeURIComponent(withdrawalAction[1]), withdrawalAction[2] === 'approve');
    sendJson(res, 200, { ok: true, ...result });
    return;
  }

  if (req.method === 'PUT' && pathname === '/api/server/community/whitelist') {
    const session = requireSession(req, res, true);
    if (!session) return;
    const body = await readJsonBody(req);
    sendJson(res, 200, { ok: true, emails: await community.setWhitelist(body.emails) });
    return;
  }

  if (req.method === 'PUT' && pathname === '/api/server/community/smtp') {
    const session = requireSession(req, res, true);
    if (!session) return;
    sendJson(res, 200, { ok: true, smtp: await community.setSmtp(await readJsonBody(req)) });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/server/community/smtp/test') {
    const session = requireSession(req, res, true);
    if (!session) return;
    await community.testSmtp();
    sendJson(res, 200, { ok: true });
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
}

const serverStartedAt = Date.now();
const submissionAttempts = new Map();

function acceptSubmissionFrom(address) {
  const now = Date.now();
  const attempts = (submissionAttempts.get(address) || []).filter((time) => now - time < 10 * 60 * 1000);
  if (attempts.length >= 5) return false;
  attempts.push(now);
  submissionAttempts.set(address, attempts);
  return true;
}

async function publicIndex() {
  const index = JSON.parse((await readFile(path.join(PUBLIC_ROOT, 'community-index.json'), 'utf8')).replace(/^\ufeff/, ''));
  const downloads = (await community.status()).downloads;
  index.charts = index.charts.map((chart) => ({
    ...chart,
    downloadCount: Math.max(0, Number(downloads[chart.id] || 0)),
    downloadUrl: `/api/community/download/${encodeURIComponent(chart.id)}`
  }));
  return index;
}

async function handleCommunityApi(req, res, pathname) {
  if (req.method === 'POST' && pathname === '/api/community/submit') {
    const address = clientAddress(req);
    if (!acceptSubmissionFrom(address)) return sendJson(res, 429, { error: '投稿过于频繁，请稍后再试。' });
    const result = await community.submit(await readJsonBody(req, 1400 * 1024), address);
    sendJson(res, 202, result);
    return;
  }
  if (req.method === 'POST' && pathname === '/api/community/withdraw') {
    sendJson(res, 202, await community.requestWithdrawal(await readJsonBody(req)));
    return;
  }
  const match = /^\/api\/community\/download\/([^/]+)$/.exec(pathname);
  if ((req.method === 'GET' || req.method === 'HEAD') && match) {
    const comboId = decodeURIComponent(match[1]);
    const index = await publicIndex();
    const chart = index.charts.find((item) => item.id === comboId);
    if (!chart || !String(chart.url || '').startsWith('/data/')) return sendText(res, 404, 'Not found');
    if (req.method === 'GET') await community.incrementDownload(comboId);
    await serveFile(req, res, PUBLIC_ROOT, String(chart.url).slice(1));
    return;
  }
  sendJson(res, 404, { error: 'Not found' });
}

const server = createServer(async (req, res) => {
  let pathname = '';
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      sendText(res, 400, 'Invalid URL');
      return;
    }

    if (pathname.startsWith('/api/server/')) {
      await handleAdminApi(req, res, pathname);
      return;
    }
    if (pathname.startsWith('/api/community/')) {
      await handleCommunityApi(req, res, pathname);
      return;
    }
    if (pathname === '/admin') {
      res.writeHead(302, { location: '/admin/' });
      res.end();
      return;
    }
    if (pathname === '/admin/' || pathname === '/admin/index.html') {
      await serveFile(req, res, path.join(PUBLIC_ROOT, '.admin'), 'index.html');
      return;
    }
    if (pathname === '/admin/styles.css' || pathname === '/admin/app.js') {
      await serveFile(req, res, path.join(PUBLIC_ROOT, '.admin'), pathname.slice('/admin/'.length));
      return;
    }
    if (pathname === '/') {
      await serveFile(req, res, PUBLIC_ROOT, 'index.html');
      return;
    }
    if (pathname === '/community-index.json') {
      sendJson(res, 200, await publicIndex());
      return;
    }
    if (PUBLIC_ROOT_FILES.has(pathname)) {
      await serveFile(req, res, PUBLIC_ROOT, pathname.slice(1));
      return;
    }
    if (pathname.startsWith('/assets/') || pathname.startsWith('/data/')) {
      await serveFile(req, res, PUBLIC_ROOT, pathname.slice(1));
      return;
    }
    sendText(res, 404, 'Not found');
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      const apiRequest = pathname?.startsWith('/api/');
      sendJson(res, apiRequest ? 400 : 500, { error: apiRequest ? (error.message || String(error)) : '服务器内部错误。' });
    }
    else res.destroy();
  }
});

server.on('error', (error) => {
  console.error(`Server failed: ${error.message}`);
  process.exitCode = 1;
});

server.listen(PORT, HOST, () => {
  console.log(`[wwcombo] 网站：${PUBLIC_URL}/`);
  console.log(`[wwcombo] 管理后台：${PUBLIC_URL}/admin/`);
  console.log(`[wwcombo] 监听：${HOST}:${PORT}`);
  console.log(`[wwcombo] 当前版本：${BUILD_INFO.releaseId}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}

import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { chmod, mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const MAX_FILE_BYTES = 1024 * 1024;
const MAX_STEPS = 5000;
const MAX_DURATION_MS = 10 * 60 * 1000;

function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function normalizeEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+$/.test(email) && email.length <= 254 ? email : '';
}

function publicEmail(value) {
  const email = normalizeEmail(value);
  if (!email) return '';
  const at = email.lastIndexOf('@');
  return `${Array.from(email.slice(0, at)).slice(0, 2).join('')}***${email.slice(at)}`;
}

function safeName(value, fallback = 'combo') {
  return String(value || fallback).trim().replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, '-').slice(0, 80) || fallback;
}

function stableVersion(value) {
  const version = String(value || '').trim();
  return /^\d+\.\d+$/.test(version) ? version : '3.5';
}

function chartDuration(chart) {
  return Math.max(Number(chart.timelineDurationMs || 0), ...chart.steps.map((step) => Number(step.startMax || 0) + Number(step.durationMax || 0)));
}

function validStep(step) {
  const item = record(step);
  const times = [item.startMin, item.startMax, item.durationMin, item.durationMax];
  return typeof item.id === 'string'
    && typeof item.moveId === 'string'
    && typeof item.label === 'string'
    && ['main', 'independent'].includes(item.lane)
    && times.every((value) => Number.isFinite(value) && value >= 0 && value < MAX_DURATION_MS);
}

function submittedChart(payload) {
  const item = record(payload);
  const chart = record(item.chart || (Array.isArray(item.charts) ? item.charts[0] : item));
  if (!Array.isArray(chart.steps) || !chart.steps.length || chart.steps.length > MAX_STEPS) throw new Error('连段步骤数量不正确。');
  if (!chart.steps.every(validStep)) throw new Error('连段步骤格式不正确。');
  if (chartDuration(chart) > MAX_DURATION_MS) throw new Error('连段时间轴超过 10 分钟。');
  return { item, chart };
}

function chartSummary(payload, submitter) {
  const { chart } = submittedChart(payload);
  const community = record(chart.community);
  const characters = (Array.isArray(community.characters) ? community.characters : [chart.character])
    .filter((value) => typeof value === 'string' && value.trim()).map((value) => value.trim()).slice(0, 3);
  const firstStep = [...chart.steps].sort((left, right) => Number(left.startMin || 0) - Number(right.startMin || 0))[0];
  const firstSlot = Math.max(1, Math.round(Number(firstStep?.characterSlot || 1)));
  const id = String(community.id || chart.id || '').trim() || `wwc_${randomUUID()}`;
  return {
    id,
    title: String(community.name || community.title || chart.title || '未命名连段').trim().slice(0, 120),
    ...(typeof chart.author === 'string' && chart.author.trim() ? { author: chart.author.trim().slice(0, 80) } : {}),
    submitter,
    character: characters[0] || 'unknown',
    characters: characters.length ? characters : ['unknown'],
    firstCharacter: characters[firstSlot - 1] || characters[0] || 'unknown',
    tags: (Array.isArray(community.tags) ? community.tags : chart.tags || []).filter((tag) => typeof tag === 'string' && tag.trim()).map((tag) => tag.trim()).slice(0, 20),
    rounds: Number.isFinite(community.rounds) ? Math.max(1, Math.round(community.rounds)) : 1,
    uploadVersion: stableVersion(community.uploadVersion),
    description: typeof community.description === 'string' ? community.description.slice(0, 2000) : '',
    link: typeof community.link === 'string' && /^https?:\/\//i.test(community.link) ? community.link.slice(0, 1000) : '',
    durationMs: Math.round(chartDuration(chart)),
    stepCount: chart.steps.length,
    version: Number.isFinite(chart.version) ? chart.version : 1,
    updatedAt: Date.now(),
    repository: 'community'
  };
}

async function readJson(file, fallback) {
  try {
    return JSON.parse((await readFile(file, 'utf8')).replace(/^\ufeff/, ''));
  } catch {
    return fallback;
  }
}

async function writeJson(file, value, privateFile = true) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', mode: privateFile ? 0o600 : 0o644 });
  await rename(temporary, file);
  if (privateFile) await chmod(file, 0o600).catch(() => {});
}

export function createCommunityService({ runtimeRoot, rebuildRelease }) {
  const root = path.join(runtimeRoot, 'community');
  const pendingRoot = path.join(root, 'pending');
  const publishedRoot = path.join(root, 'published');
  const queueFile = path.join(root, 'submissions.json');
  const publishedFile = path.join(root, 'published.json');
  const ownersFile = path.join(root, 'owners.json');
  const withdrawalsFile = path.join(root, 'withdrawals.json');
  const whitelistFile = path.join(root, 'whitelist.json');
  const downloadsFile = path.join(root, 'downloads.json');
  const smtpFile = path.join(root, 'smtp.json');

  async function initialize() {
    await Promise.all([mkdir(pendingRoot, { recursive: true }), mkdir(publishedRoot, { recursive: true })]);
  }

  async function whitelist() {
    const value = await readJson(whitelistFile, { emails: [] });
    return [...new Set((Array.isArray(value.emails) ? value.emails : []).map(normalizeEmail).filter(Boolean))].sort();
  }

  async function smtpSettings() {
    return record(await readJson(smtpFile, {}));
  }

  async function sendSubmissionNotice(submission) {
    const settings = await smtpSettings();
    if (!settings.host || !settings.user || !settings.pass || !settings.to) return 'SMTP 尚未配置';
    const { createTransport } = await import('nodemailer');
    const transport = createTransport({
      host: settings.host,
      port: Number(settings.port || 465),
      secure: settings.secure !== false,
      auth: { user: settings.user, pass: settings.pass }
    });
    await transport.sendMail({
      from: settings.from || settings.user,
      to: settings.to,
      subject: `[椰果朋克2077] 新连段待审核：${submission.fileName}`,
      text: `用户名：${submission.username}\n邮箱：${submission.email}\n文件：${submission.fileName}\n投稿编号：${submission.id}\n\n请登录服务器管理后台审核。`
    });
    return '';
  }

  async function submit(body, address) {
    const username = String(body.username || '').trim().slice(0, 40);
    const email = normalizeEmail(body.email);
    if (!username) throw new Error('请先填写用户名。');
    if (!email) throw new Error('邮箱格式不正确。');
    const content = record(body.content);
    submittedChart(content);
    const serialized = `${JSON.stringify(content, null, 2)}\n`;
    if (Buffer.byteLength(serialized) > MAX_FILE_BYTES) throw new Error('连段文件不能超过 1 MB。');
    const id = randomUUID();
    const fileName = safeName(body.fileName || 'combo.wwcombo.json');
    const storedFile = `${id}.wwcombo.json`;
    const submission = { id, username, email, fileName, storedFile, status: 'pending', submittedAt: Date.now(), address: String(address || '') };
    await writeFile(path.join(pendingRoot, storedFile), serialized, { encoding: 'utf8', mode: 0o600 });
    const queue = await readJson(queueFile, { pending: [], history: [] });
    queue.pending = [...(Array.isArray(queue.pending) ? queue.pending : []), submission];
    await writeJson(queueFile, queue);
    try {
      submission.notificationError = await sendSubmissionNotice(submission);
    } catch (error) {
      submission.notificationError = error.message || String(error);
    }
    await writeJson(queueFile, queue);
    return { id, status: 'pending' };
  }

  async function approve(id) {
    const queue = await readJson(queueFile, { pending: [], history: [] });
    const index = (queue.pending || []).findIndex((item) => item.id === id);
    if (index < 0) throw new Error('投稿不存在或已经处理。');
    const submission = queue.pending[index];
    const source = path.join(pendingRoot, submission.storedFile);
    const payload = JSON.parse(await readFile(source, 'utf8'));
    const up = (await whitelist()).includes(normalizeEmail(submission.email));
    const submitter = { nickname: submission.username, email: publicEmail(submission.email), ...(up ? { badge: 'UP' } : {}) };
    const summary = chartSummary(payload, submitter);
    const { chart } = submittedChart(payload);
    const publicPackage = {
      ...payload,
      type: 'wwcombo-chart',
      version: Number.isFinite(payload.version) ? payload.version : 3,
      chart: {
        ...chart,
        id: summary.id,
        community: { ...record(chart.community), id: summary.id, name: summary.title, submitter, ingestedAt: Date.now() }
      }
    };
    const targetName = `${safeName(summary.title)}-${safeName(summary.id)}.wwcombo.json`;
    const target = path.join(publishedRoot, targetName);
    const output = `${JSON.stringify(publicPackage, null, 2)}\n`;
    await writeFile(target, output, { encoding: 'utf8', mode: 0o600 });
    summary.sizeBytes = Buffer.byteLength(output);
    const published = await readJson(publishedFile, { charts: [] });
    published.charts = [...(published.charts || []).filter((item) => item.chart?.id !== summary.id), { fileName: targetName, chart: summary }];
    const owners = record(await readJson(ownersFile, {}));
    owners[summary.id] = { email: submission.email, username: submission.username, submissionId: submission.id, publishedAt: Date.now() };
    queue.pending.splice(index, 1);
    queue.history = [...(queue.history || []), { ...submission, status: 'approved', comboId: summary.id, processedAt: Date.now() }].slice(-500);
    await Promise.all([writeJson(publishedFile, published), writeJson(ownersFile, owners), writeJson(queueFile, queue)]);
    await rm(source, { force: true });
    await rebuildRelease();
    return summary;
  }

  async function reject(id, reason = '') {
    const queue = await readJson(queueFile, { pending: [], history: [] });
    const index = (queue.pending || []).findIndex((item) => item.id === id);
    if (index < 0) throw new Error('投稿不存在或已经处理。');
    const submission = queue.pending.splice(index, 1)[0];
    queue.history = [...(queue.history || []), { ...submission, status: 'rejected', reason: String(reason || '').slice(0, 500), processedAt: Date.now() }].slice(-500);
    await rm(path.join(pendingRoot, submission.storedFile), { force: true });
    await writeJson(queueFile, queue);
  }

  async function removePublished(comboId) {
    const published = await readJson(publishedFile, { charts: [] });
    const index = (published.charts || []).findIndex((item) => item.chart?.id === comboId);
    if (index < 0) return false;
    const item = published.charts.splice(index, 1)[0];
    await rm(path.join(publishedRoot, item.fileName), { force: true });
    const owners = record(await readJson(ownersFile, {}));
    delete owners[comboId];
    await Promise.all([writeJson(publishedFile, published), writeJson(ownersFile, owners)]);
    await rebuildRelease();
    return true;
  }

  async function requestWithdrawal(body) {
    const comboId = String(body.comboId || '').trim();
    const email = normalizeEmail(body.email);
    if (!comboId || !email) throw new Error('连段 ID 或邮箱格式不正确。');
    const owners = record(await readJson(ownersFile, {}));
    if (normalizeEmail(owners[comboId]?.email) === email && await removePublished(comboId)) return { status: 'withdrawn' };
    const state = await readJson(withdrawalsFile, { pending: [], history: [] });
    const request = { id: randomUUID(), comboId, email, username: String(body.username || '').trim().slice(0, 40), status: 'pending', submittedAt: Date.now() };
    state.pending = [...(state.pending || []), request];
    await writeJson(withdrawalsFile, state);
    return { status: 'pending' };
  }

  async function resolveWithdrawal(id, approveRequest) {
    const state = await readJson(withdrawalsFile, { pending: [], history: [] });
    const index = (state.pending || []).findIndex((item) => item.id === id);
    if (index < 0) throw new Error('撤回申请不存在。');
    const request = state.pending.splice(index, 1)[0];
    let removed = false;
    if (approveRequest) removed = await removePublished(request.comboId);
    state.history = [...(state.history || []), { ...request, status: approveRequest ? (removed ? 'approved' : 'not-found') : 'rejected', processedAt: Date.now() }].slice(-500);
    await writeJson(withdrawalsFile, state);
    return { removed };
  }

  async function setWhitelist(emails) {
    const normalized = [...new Set((Array.isArray(emails) ? emails : []).map(normalizeEmail).filter(Boolean))].sort();
    await writeJson(whitelistFile, { emails: normalized });
    return normalized;
  }

  async function setSmtp(body) {
    const previous = await smtpSettings();
    const next = {
      host: String(body.host || '').trim(),
      port: Math.max(1, Math.min(65535, Number(body.port || 465))),
      secure: body.secure !== false,
      user: String(body.user || '').trim(),
      pass: String(body.pass || previous.pass || ''),
      from: String(body.from || '').trim(),
      to: normalizeEmail(body.to)
    };
    if (!next.host || !next.user || !next.pass || !next.to) throw new Error('SMTP 主机、账号、授权码和通知邮箱不能为空。');
    await writeJson(smtpFile, next);
    return smtpPublic(next);
  }

  function smtpPublic(settings) {
    return { host: settings.host || '', port: Number(settings.port || 465), secure: settings.secure !== false, user: settings.user || '', from: settings.from || '', to: settings.to || '', hasPassword: Boolean(settings.pass) };
  }

  async function testSmtp() {
    const settings = await smtpSettings();
    if (!settings.host || !settings.user || !settings.pass || !settings.to) throw new Error('请先保存 SMTP 设置。');
    const { createTransport } = await import('nodemailer');
    const transport = createTransport({ host: settings.host, port: Number(settings.port || 465), secure: settings.secure !== false, auth: { user: settings.user, pass: settings.pass } });
    await transport.sendMail({ from: settings.from || settings.user, to: settings.to, subject: '[椰果朋克2077] SMTP 测试', text: '服务器投稿通知已配置成功。' });
  }

  async function incrementDownload(comboId) {
    const counts = record(await readJson(downloadsFile, {}));
    counts[comboId] = Math.max(0, Number(counts[comboId] || 0)) + 1;
    await writeJson(downloadsFile, counts);
    return counts[comboId];
  }

  async function status() {
    const [queue, published, withdrawals, emails, smtp, downloads] = await Promise.all([
      readJson(queueFile, { pending: [], history: [] }),
      readJson(publishedFile, { charts: [] }),
      readJson(withdrawalsFile, { pending: [], history: [] }),
      whitelist(), smtpSettings(), readJson(downloadsFile, {})
    ]);
    return {
      submissions: { pending: queue.pending || [], history: (queue.history || []).slice(-30).reverse() },
      withdrawals: { pending: withdrawals.pending || [], history: (withdrawals.history || []).slice(-30).reverse() },
      published: published.charts || [],
      whitelist: emails,
      smtp: smtpPublic(smtp),
      downloads: record(downloads)
    };
  }

  return { initialize, submit, approve, reject, requestWithdrawal, resolveWithdrawal, setWhitelist, setSmtp, testSmtp, incrementDownload, status };
}

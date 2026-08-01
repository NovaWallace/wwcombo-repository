import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { chmod, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { replaceWithRetry } from './fsSafe.mjs';

const MAX_FILE_BYTES = 1024 * 1024;
const MAX_STEPS = 5000;
const MAX_DURATION_MS = 10 * 60 * 1000;
const MAX_COMMISSION_RESPONSES = 50;
const ICON_TRIGGERS = [
  '长按共鸣解放', '长按普攻', '长按技能', '长按声骸', '长按解放', '长按闪避', '长按跳跃',
  '共鸣解放', '终结技', '普攻', '重击', '技能', '声骸', '解放', '闪避', '跳跃', '工具', '变奏', '延奏', '处决', '前走',
  'iii', 'ii', 'a', 'z', 'Z', 'e', 'E', 'q', 'Q', 'r', 'R', 's', 'S', 'd', 'D', 'j', 'J', 't', 'b', 'y', 'f', 'w', 'i', '闪', '跳'
].sort((left, right) => right.length - left.length);

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

function characterNames(value) {
  return [...new Set((Array.isArray(value) ? value : [])
    .filter((item) => typeof item === 'string' && item.trim())
    .map((item) => item.trim().slice(0, 80)))].slice(0, 3);
}

function chartDuration(chart) {
  return Math.max(Number(chart.timelineDurationMs || 0), ...chart.steps.map((step) => Number(step.startMax || 0) + Number(step.durationMax || 0)));
}

function loopSwitchCount(chart) {
  const loop = (Array.isArray(chart.periods) ? chart.periods : [])
    .filter((period) => period?.kind === 'loop_axis')
    .sort((left, right) => Number(left.startMs || 0) - Number(right.startMs || 0))[0];
  if (!loop) return 0;
  const startMs = Number(loop.startMs || 0);
  const endMs = Number(loop.endMs);
  return chart.steps.filter((step) => {
    const stepStart = Number(step.startMin || 0);
    return /^switch_[123]$/.test(String(step.moveId || ''))
      && stepStart >= startMs
      && (!Number.isFinite(endMs) || stepStart < endMs);
  }).length;
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

function labelRemainder(value) {
  const text = String(value || '').trim();
  let index = 0;
  let remainder = '';
  while (index < text.length) {
    if (text[index] === '[') {
      const closingIndex = text.indexOf(']', index + 1);
      if (closingIndex >= 0) {
        index = closingIndex + 1;
        continue;
      }
    }
    const trigger = ICON_TRIGGERS.find((item) => text.startsWith(item, index));
    if (trigger) index += trigger.length;
    else {
      if (!/\s/.test(text[index])) remainder += text[index];
      index += 1;
    }
  }
  return remainder;
}

function preflightReview(payload) {
  const { item, chart } = submittedChart(payload);
  const labels = record(item.contentLabels);
  const ordered = [...chart.steps].sort((left, right) => Number(left.startMin || 0) - Number(right.startMin || 0) || String(left.id || '').localeCompare(String(right.id || '')));
  const repeatedActionRuns = [];
  let run = [];
  for (const step of ordered) {
    if (run.length && run[0].moveId !== step.moveId) {
      if (run.length >= 6) repeatedActionRuns.push({ moveId: run[0].moveId, label: run[0].label || run[0].moveId, count: run.length, startMs: Number(run[0].startMin || 0) });
      run = [];
    }
    run.push(step);
  }
  if (run.length >= 6) repeatedActionRuns.push({ moveId: run[0].moveId, label: run[0].label || run[0].moveId, count: run.length, startMs: Number(run[0].startMin || 0) });

  const stepIds = new Set(chart.steps.map((step) => step.id));
  const unconvertibleLabels = Object.entries(labels)
    .filter(([stepId, value]) => stepIds.has(stepId) && String(value || '').trim())
    .map(([stepId, value]) => ({ stepId, label: String(value).trim().slice(0, 120), remainder: labelRemainder(value).slice(0, 120) }))
    .filter((item) => item.remainder);
  const issues = [
    ...repeatedActionRuns.map((item) => `连续 ${item.count} 次“${item.label}”（${Math.round(item.startMs)} ms 起）`),
    ...unconvertibleLabels.map((item) => `自定义文字“${item.label}”含无法图标化内容“${item.remainder}”`)
  ];
  return {
    level: issues.length ? 'review' : 'low',
    lowRisk: issues.length === 0,
    checkedAt: Date.now(),
    issues,
    repeatedActionRuns,
    unconvertibleLabels
  };
}

function submissionPreview(payload) {
  const { chart } = submittedChart(payload);
  const community = record(chart.community);
  const characters = (Array.isArray(community.characters) ? community.characters : [chart.character])
    .filter((value) => typeof value === 'string' && value.trim()).map((value) => value.trim()).slice(0, 3);
  return {
    title: String(community.name || community.title || chart.title || '未命名连段').trim().slice(0, 120),
    characters,
    tags: (Array.isArray(community.tags) ? community.tags : chart.tags || []).filter((value) => typeof value === 'string' && value.trim()).map((value) => value.trim()).slice(0, 20),
    stepCount: chart.steps.length,
    loopSwitchCount: loopSwitchCount(chart),
    rounds: Number.isFinite(community.rounds) ? Math.max(1, Math.round(community.rounds)) : 1,
    durationMs: Math.round(chartDuration(chart))
  };
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
    loopSwitchCount: loopSwitchCount(chart),
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
  await replaceWithRetry(temporary, file);
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
  const engagementFile = path.join(root, 'engagement.json');
  const smtpFile = path.join(root, 'smtp.json');
  const reviewSettingsFile = path.join(root, 'review-settings.json');
  const hiddenFile = path.join(root, 'hidden.json');
  const commissionsFile = path.join(root, 'commissions.json');
  const commissionResponsesRoot = path.join(root, 'commission-responses');
  let downloadWrite = Promise.resolve();
  let mutationWrite = Promise.resolve();

  function serializeMutation(task) {
    const operation = mutationWrite.then(task, task);
    mutationWrite = operation.catch(() => {});
    return operation;
  }

  async function initialize() {
    await Promise.all([
      mkdir(pendingRoot, { recursive: true }),
      mkdir(publishedRoot, { recursive: true }),
      mkdir(commissionResponsesRoot, { recursive: true })
    ]);
  }

  async function whitelist() {
    const value = await readJson(whitelistFile, { emails: [] });
    return [...new Set((Array.isArray(value.emails) ? value.emails : []).map(normalizeEmail).filter(Boolean))].sort();
  }

  async function smtpSettings() {
    return record(await readJson(smtpFile, {}));
  }

  async function reviewSettings() {
    const value = record(await readJson(reviewSettingsFile, {}));
    return { autoApproveLowRisk: value.autoApproveLowRisk === true };
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

  async function submit(body, address, { notify = true } = {}) {
    const username = String(body.username || '').trim().slice(0, 40);
    const email = normalizeEmail(body.email);
    if (!username) throw new Error('请先填写用户名。');
    if (!email) throw new Error('邮箱格式不正确。');
    const content = record(body.content);
    const preflight = preflightReview(content);
    const serialized = `${JSON.stringify(content, null, 2)}\n`;
    if (Buffer.byteLength(serialized) > MAX_FILE_BYTES) throw new Error('连段文件不能超过 1 MB。');
    const id = randomUUID();
    const fileName = safeName(body.fileName || 'combo.wwcombo.json');
    const storedFile = `${id}.wwcombo.json`;
    const avatar = String(body.avatar || '').trim().slice(0, 80);
    const submission = {
      id, username, email, fileName, storedFile, status: 'pending', submittedAt: Date.now(), address: String(address || ''),
      avatar, preview: submissionPreview(content), preflight
    };
    await writeFile(path.join(pendingRoot, storedFile), serialized, { encoding: 'utf8', mode: 0o600 });
    const queue = await readJson(queueFile, { pending: [], history: [] });
    queue.pending = [...(Array.isArray(queue.pending) ? queue.pending : []), submission];
    await writeJson(queueFile, queue);
    const moderation = await reviewSettings();
    if (moderation.autoApproveLowRisk && preflight.lowRisk) {
      const chart = await approve(id);
      return { id, status: 'published', chart };
    }
    if (notify) {
      try {
        submission.notificationError = await sendSubmissionNotice(submission);
      } catch (error) {
        submission.notificationError = error.message || String(error);
      }
    }
    await writeJson(queueFile, queue);
    return { id, status: 'pending' };
  }

  async function submissionContent(id) {
    const queue = await readJson(queueFile, { pending: [], history: [] });
    const submission = (queue.pending || []).find((item) => item.id === id);
    if (!submission) throw new Error('投稿不存在或已经处理。');
    const storedFile = path.basename(String(submission.storedFile || ''));
    if (!storedFile || storedFile !== submission.storedFile) throw new Error('投稿文件路径不安全。');
    const content = JSON.parse(await readFile(path.join(pendingRoot, storedFile), 'utf8'));
    return { submission, content, preflight: preflightReview(content) };
  }

  async function publishDirect(body, address) {
    const queued = await submit(body, address, { notify: false });
    const chart = await approve(queued.id);
    return { status: 'published', chart };
  }

  async function approve(id) {
    const queue = await readJson(queueFile, { pending: [], history: [] });
    const index = (queue.pending || []).findIndex((item) => item.id === id);
    if (index < 0) throw new Error('投稿不存在或已经处理。');
    const submission = queue.pending[index];
    const source = path.join(pendingRoot, submission.storedFile);
    const payload = JSON.parse(await readFile(source, 'utf8'));
    const up = (await whitelist()).includes(normalizeEmail(submission.email));
    const submitter = { nickname: submission.username, email: publicEmail(submission.email), ...(submission.avatar ? { avatar: submission.avatar } : {}), ...(up ? { badge: 'UP' } : {}) };
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

  async function hiddenIds() {
    const value = await readJson(hiddenFile, { ids: [] });
    return [...new Set((Array.isArray(value.ids) ? value.ids : []).map((id) => String(id || '').trim()).filter(Boolean))].sort();
  }

  async function deleteChart(comboId) {
    const id = String(comboId || '').trim();
    if (!id) throw new Error('连段 ID 不能为空。');
    const removedPrivate = await removePublished(id);
    const ids = new Set(await hiddenIds());
    ids.add(id);
    await writeJson(hiddenFile, { ids: [...ids].sort() });
    if (!removedPrivate) await rebuildRelease();
    return { removedPrivate, hidden: true };
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
    const [published, owners] = await Promise.all([readJson(publishedFile, { charts: [] }), readJson(ownersFile, {})]);
    let changed = false;
    for (const item of published.charts || []) {
      const comboId = item.chart?.id;
      const shouldBadge = normalized.includes(normalizeEmail(owners[comboId]?.email));
      const submitter = record(item.chart?.submitter);
      if (Boolean(submitter.badge) === shouldBadge) continue;
      item.chart.submitter = { ...submitter, ...(shouldBadge ? { badge: 'UP' } : {}) };
      if (!shouldBadge) delete item.chart.submitter.badge;
      const packageFile = path.join(publishedRoot, item.fileName);
      const payload = await readJson(packageFile, null);
      if (payload?.chart) {
        payload.chart.community = { ...record(payload.chart.community), submitter: item.chart.submitter };
        await writeFile(packageFile, `${JSON.stringify(payload, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
      }
      changed = true;
    }
    if (changed) {
      await writeJson(publishedFile, published);
      await rebuildRelease();
    }
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

  async function setReviewSettings(body) {
    const next = { autoApproveLowRisk: body.autoApproveLowRisk === true };
    await writeJson(reviewSettingsFile, next);
    return next;
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
    const operation = downloadWrite.then(async () => {
      const counts = record(await readJson(downloadsFile, {}));
      counts[comboId] = Math.max(0, Number(counts[comboId] || 0)) + 1;
      await writeJson(downloadsFile, counts);
      return counts[comboId];
    });
    downloadWrite = operation.catch(() => {});
    return operation;
  }

  async function recordDownload(comboId, voterId) {
    const operation = downloadWrite.then(async () => {
      const [counts, engagement] = await Promise.all([
        readJson(downloadsFile, {}),
        readJson(engagementFile, { counts: {}, downloads: {}, votes: {} })
      ]);
      const normalizedCounts = record(counts);
      normalizedCounts[comboId] = Math.max(0, Number(normalizedCounts[comboId] || 0)) + 1;
      engagement.counts = record(engagement.counts);
      engagement.downloads = record(engagement.downloads);
      engagement.votes = record(engagement.votes);
      if (voterId) engagement.downloads[voterId] = { ...record(engagement.downloads[voterId]), [comboId]: Date.now() };
      await Promise.all([writeJson(downloadsFile, normalizedCounts), writeJson(engagementFile, engagement)]);
      return normalizedCounts[comboId];
    });
    downloadWrite = operation.catch(() => {});
    return operation;
  }

  async function publicEngagement(voterId = '') {
    const engagement = await readJson(engagementFile, { counts: {}, downloads: {}, votes: {} });
    const counts = record(engagement.counts);
    const downloaded = record(record(engagement.downloads)[voterId]);
    const voterVotes = record(record(engagement.votes)[voterId]);
    return { counts, downloaded, voterVotes };
  }

  async function castVote(comboId, voterId, vote) {
    if (!comboId || !voterId || !['up', 'down'].includes(vote)) throw new Error('评价参数不正确。');
    return serializeMutation(async () => {
      const engagement = await readJson(engagementFile, { counts: {}, downloads: {}, votes: {} });
      engagement.counts = record(engagement.counts);
      engagement.downloads = record(engagement.downloads);
      engagement.votes = record(engagement.votes);
      if (!record(engagement.downloads[voterId])[comboId]) {
        const error = new Error('请先下载该连段，再进行评价。');
        error.statusCode = 403;
        throw error;
      }
      const voterVotes = record(engagement.votes[voterId]);
      if (voterVotes[comboId]) {
        const error = new Error('你已经评价过这个连段。');
        error.statusCode = 409;
        throw error;
      }
      const current = record(engagement.counts[comboId]);
      const next = { up: Math.max(0, Number(current.up || 0)), down: Math.max(0, Number(current.down || 0)) };
      next[vote] += 1;
      engagement.counts[comboId] = next;
      engagement.votes[voterId] = { ...voterVotes, [comboId]: vote };
      await writeJson(engagementFile, engagement);
      return { votes: next, viewerVote: vote, canVote: false };
    });
  }

  function commissionPublic(item, voterId = '', upEmails = new Set()) {
    const owner = record(item.owner);
    const responses = (Array.isArray(item.responses) ? item.responses : []).map((response) => {
      const preview = record(response.preview);
      const responseEmail = normalizeEmail(response.email);
      return {
        id: String(response.id || ''),
        title: String(preview.title || response.fileName || '未命名连段'),
        characters: characterNames(preview.characters),
        tags: Array.isArray(preview.tags) ? preview.tags : [],
        rounds: Math.max(1, Number(preview.rounds || 1)),
        durationMs: Math.max(0, Number(preview.durationMs || 0)),
        stepCount: Math.max(0, Number(preview.stepCount || 0)),
        loopSwitchCount: Math.max(0, Number(preview.loopSwitchCount || 0)),
        fileName: String(response.fileName || ''),
        submittedAt: Number(response.submittedAt || 0),
        status: response.status === 'accepted' ? 'accepted' : 'submitted',
        ...(response.comboId ? { comboId: String(response.comboId) } : {}),
        submitter: {
          nickname: String(response.username || '未命名用户'),
          email: publicEmail(responseEmail),
          ...(response.avatar ? { avatar: String(response.avatar) } : {}),
          ...(upEmails.has(responseEmail) ? { badge: 'UP' } : {})
        },
        packageUrl: `/api/community/commissions/${encodeURIComponent(item.id)}/responses/${encodeURIComponent(response.id)}/package`
      };
    });
    const interests = record(item.interests);
    const ownerEmail = normalizeEmail(owner.email);
    return {
      id: String(item.id || ''),
      title: String(item.title || '未命名委托'),
      description: String(item.description || ''),
      characters: characterNames(item.characters),
      owner: {
        nickname: String(owner.username || '未命名用户'),
        email: publicEmail(ownerEmail),
        ...(owner.avatar ? { avatar: String(owner.avatar) } : {}),
        ...(upEmails.has(ownerEmail) ? { badge: 'UP' } : {})
      },
      status: item.status === 'completed' ? 'completed' : 'open',
      createdAt: Number(item.createdAt || 0),
      updatedAt: Number(item.updatedAt || item.createdAt || 0),
      interestCount: Object.keys(interests).length,
      viewerInterested: Boolean(voterId && interests[voterId]),
      responseCount: responses.length,
      responses,
      ...(item.acceptedResponseId ? { acceptedResponseId: String(item.acceptedResponseId) } : {}),
      ...(item.publishedComboId ? { publishedComboId: String(item.publishedComboId) } : {})
    };
  }

  async function commissionState() {
    const value = record(await readJson(commissionsFile, { version: 1, commissions: [] }));
    return { version: 1, commissions: Array.isArray(value.commissions) ? value.commissions : [] };
  }

  async function commissionPublicValue(item, voterId = '') {
    return commissionPublic(item, voterId, new Set(await whitelist()));
  }

  async function publicCommissions(voterId = '') {
    const [state, emails] = await Promise.all([commissionState(), whitelist()]);
    const upEmails = new Set(emails);
    return {
      version: 1,
      updatedAt: Math.max(0, ...state.commissions.map((item) => Number(item.updatedAt || item.createdAt || 0))),
      commissions: state.commissions
        .map((item) => commissionPublic(item, voterId, upEmails))
        .sort((left, right) => Number(left.status === 'completed') - Number(right.status === 'completed') || right.updatedAt - left.updatedAt)
    };
  }

  async function createCommission(body, voterId = '') {
    const username = String(body.username || '').trim().slice(0, 40);
    const email = normalizeEmail(body.email);
    const title = String(body.title || '').trim().slice(0, 120);
    const description = String(body.description || '').trim().slice(0, 4000);
    const characters = characterNames(body.characters);
    if (!username) throw new Error('请先填写用户名。');
    if (!email) throw new Error('邮箱格式不正确。');
    if (!title) throw new Error('请填写委托标题。');
    if (!description) throw new Error('请填写需要的具体流程。');
    if (!characters.length) throw new Error('请至少选择一名需要的角色。');
    const now = Date.now();
    const item = {
      id: randomUUID(),
      title,
      description,
      characters,
      owner: { username, email, avatar: String(body.avatar || '').trim().slice(0, 80) },
      status: 'open',
      interests: {},
      responses: [],
      createdAt: now,
      updatedAt: now
    };
    const state = await commissionState();
    state.commissions.push(item);
    await writeJson(commissionsFile, state);
    return commissionPublicValue(item, voterId);
  }

  async function addCommissionInterest(id, voterId) {
    if (!voterId) throw new Error('无法识别当前浏览器。');
    const state = await commissionState();
    const item = state.commissions.find((commission) => commission.id === id);
    if (!item) throw new Error('委托不存在。');
    if (item.status === 'completed') throw new Error('这个委托已经完成。');
    item.interests = record(item.interests);
    if (!item.interests[voterId]) {
      item.interests[voterId] = Date.now();
      item.updatedAt = Date.now();
      await writeJson(commissionsFile, state);
    }
    return commissionPublicValue(item, voterId);
  }

  async function submitCommissionResponse(id, body, address, voterId = '') {
    const username = String(body.username || '').trim().slice(0, 40);
    const email = normalizeEmail(body.email);
    if (!username) throw new Error('请先填写用户名。');
    if (!email) throw new Error('邮箱格式不正确。');
    const content = record(body.content);
    const preview = submissionPreview(content);
    const preflight = preflightReview(content);
    const serialized = `${JSON.stringify(content, null, 2)}\n`;
    if (Buffer.byteLength(serialized) > MAX_FILE_BYTES) throw new Error('连段文件不能超过 1 MB。');
    const state = await commissionState();
    const item = state.commissions.find((commission) => commission.id === id);
    if (!item) throw new Error('委托不存在。');
    if (item.status === 'completed') throw new Error('这个委托已经完成。');
    item.responses = Array.isArray(item.responses) ? item.responses : [];
    if (item.responses.length >= MAX_COMMISSION_RESPONSES) throw new Error('这个委托收到的方案已经达到上限。');
    const responseId = randomUUID();
    const storedFile = `${responseId}.wwcombo.json`;
    const response = {
      id: responseId,
      username,
      email,
      avatar: String(body.avatar || '').trim().slice(0, 80),
      fileName: safeName(body.fileName || 'combo.wwcombo.json'),
      storedFile,
      preview,
      preflight,
      status: 'submitted',
      submittedAt: Date.now(),
      address: String(address || '')
    };
    const responseRoot = path.join(commissionResponsesRoot, item.id);
    await mkdir(responseRoot, { recursive: true });
    await writeFile(path.join(responseRoot, storedFile), serialized, { encoding: 'utf8', mode: 0o600 });
    item.responses.push(response);
    item.updatedAt = response.submittedAt;
    try {
      await writeJson(commissionsFile, state);
    } catch (error) {
      await rm(path.join(responseRoot, storedFile), { force: true }).catch(() => {});
      throw error;
    }
    const publicItem = await commissionPublicValue(item, voterId);
    return { commission: publicItem, response: publicItem.responses.find((entry) => entry.id === responseId) };
  }

  async function commissionResponseContent(commissionId, responseId) {
    const state = await commissionState();
    const item = state.commissions.find((commission) => commission.id === commissionId);
    const response = (Array.isArray(item?.responses) ? item.responses : []).find((entry) => entry.id === responseId);
    if (!item || !response) throw new Error('委托方案不存在。');
    const storedFile = path.basename(String(response.storedFile || ''));
    if (!storedFile || storedFile !== response.storedFile) throw new Error('委托方案文件路径不安全。');
    return JSON.parse(await readFile(path.join(commissionResponsesRoot, item.id, storedFile), 'utf8'));
  }

  async function adoptCommissionResponse(commissionId, responseId, body, voterId = '') {
    const email = normalizeEmail(body.email);
    if (!email) throw new Error('请先登记委托时使用的邮箱。');
    const state = await commissionState();
    const item = state.commissions.find((commission) => commission.id === commissionId);
    if (!item) throw new Error('委托不存在。');
    if (normalizeEmail(item.owner?.email) !== email) throw new Error('只有委托发布者可以采纳方案。');
    if (item.status === 'completed') throw new Error('这个委托已经完成。');
    const response = (Array.isArray(item.responses) ? item.responses : []).find((entry) => entry.id === responseId);
    if (!response) throw new Error('委托方案不存在。');
    const now = Date.now();
    item.status = 'completed';
    item.acceptedResponseId = response.id;
    item.completedAt = now;
    item.updatedAt = now;
    response.status = 'accepted';
    response.acceptedAt = now;
    await writeJson(commissionsFile, state);
    return { commission: await commissionPublicValue(item, voterId) };
  }

  async function status() {
    const [queue, published, withdrawals, emails, smtp, moderation, downloads, hidden, commissions] = await Promise.all([
      readJson(queueFile, { pending: [], history: [] }),
      readJson(publishedFile, { charts: [] }),
      readJson(withdrawalsFile, { pending: [], history: [] }),
      whitelist(), smtpSettings(), reviewSettings(), readJson(downloadsFile, {}), hiddenIds(), commissionState()
    ]);
    return {
      submissions: { pending: queue.pending || [], history: (queue.history || []).slice(-30).reverse() },
      withdrawals: { pending: withdrawals.pending || [], history: (withdrawals.history || []).slice(-30).reverse() },
      published: published.charts || [],
      whitelist: emails,
      smtp: smtpPublic(smtp),
      reviewSettings: moderation,
      downloads: record(downloads),
      hidden,
      commissions: {
        total: commissions.commissions.length,
        open: commissions.commissions.filter((item) => item.status !== 'completed').length,
        completed: commissions.commissions.filter((item) => item.status === 'completed').length,
        responses: commissions.commissions.reduce((count, item) => count + (Array.isArray(item.responses) ? item.responses.length : 0), 0)
      }
    };
  }

  return {
    initialize,
    submit: (...args) => serializeMutation(() => submit(...args)),
    submissionContent,
    publishDirect: (...args) => serializeMutation(() => publishDirect(...args)),
    approve: (...args) => serializeMutation(() => approve(...args)),
    reject: (...args) => serializeMutation(() => reject(...args)),
    deleteChart: (...args) => serializeMutation(() => deleteChart(...args)),
    requestWithdrawal: (...args) => serializeMutation(() => requestWithdrawal(...args)),
    resolveWithdrawal: (...args) => serializeMutation(() => resolveWithdrawal(...args)),
    setWhitelist: (...args) => serializeMutation(() => setWhitelist(...args)),
    setSmtp: (...args) => serializeMutation(() => setSmtp(...args)),
    setReviewSettings: (...args) => serializeMutation(() => setReviewSettings(...args)),
    testSmtp,
    incrementDownload,
    recordDownload,
    publicEngagement,
    castVote,
    publicCommissions,
    createCommission: (...args) => serializeMutation(() => createCommission(...args)),
    addCommissionInterest: (...args) => serializeMutation(() => addCommissionInterest(...args)),
    submitCommissionResponse: (...args) => serializeMutation(() => submitCommissionResponse(...args)),
    commissionResponseContent,
    adoptCommissionResponse: (...args) => serializeMutation(() => adoptCommissionResponse(...args)),
    status
  };
}

import { createHash, randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { chmod, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { replaceWithRetry } from './fsSafe.mjs';

const MAX_FILE_BYTES = 1024 * 1024;
const MAX_STEPS = 5000;
const MAX_DURATION_MS = 10 * 60 * 1000;
const MAX_COMMISSION_RESPONSES = 50;
const MAX_COMMENTS_PER_COMBO = 200;
const MAX_COMMENT_BODY = 1000;
const COMMISSION_AUTO_ADOPT_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
const COMMISSION_TAGS = ['轮椅', '基础', '标准', '进阶', '冒烟', '错轮'];
const ACCOUNT_ROLE_NAMES = new Set(['wiki-admin']);
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

export function canonicalCharacterName(value) {
  const name = String(value || '').trim();
  return name === '青霄' || name === '清宵' ? '清霄' : name;
}

export function canonicalCharacterNames(value) {
  const values = Array.isArray(value) ? value : [value];
  return [...new Set(values.flatMap((item) => typeof item === 'string'
    ? item.split(/[\/／、,，;；|]/u).map(canonicalCharacterName).filter(Boolean)
    : []).map((item) => item.slice(0, 80)))].slice(0, 3);
}

function characterNames(value) {
  return canonicalCharacterNames(value);
}

function canonicalizeChartCharacters(chart) {
  const source = record(chart);
  const character = typeof source.character === 'string' ? characterNames(source.character).join(' / ') : source.character;
  const community = record(source.community);
  return {
    ...source,
    ...(typeof character === 'string' ? { character } : {}),
    ...(Object.keys(community).length ? { community: { ...community, characters: characterNames(community.characters) } } : {})
  };
}

function commissionTag(value) {
  const tag = String(value || '').trim();
  return COMMISSION_TAGS.includes(tag) ? tag : '基础';
}

function chartDuration(chart) {
  return Math.max(Number(chart.timelineDurationMs || 0), ...chart.steps.map((step) => Number(step.startMax || 0) + Number(step.durationMax || 0)));
}

function longestActionCharacter(chart, characters) {
  const intervalsBySlot = new Map();
  for (const step of Array.isArray(chart.steps) ? chart.steps : []) {
    const slot = Math.max(1, Math.round(Number(step.characterSlot || 1)));
    const start = Number.isFinite(step.startMin) ? Number(step.startMin) : Number(step.startMax);
    const duration = Number.isFinite(step.durationMax) ? Number(step.durationMax) : Number(step.durationMin);
    if (!Number.isFinite(start) || !Number.isFinite(duration) || duration <= 0) continue;
    const intervals = intervalsBySlot.get(slot) || [];
    intervals.push([start, start + duration]);
    intervalsBySlot.set(slot, intervals);
  }
  let longestSlot = 1;
  let longestDuration = -1;
  for (let slot = 1; slot <= characters.length; slot += 1) {
    const intervals = (intervalsBySlot.get(slot) || []).sort((left, right) => left[0] - right[0] || left[1] - right[1]);
    let total = 0;
    let end = 0;
    for (const [start, finish] of intervals) {
      if (start > end) total += finish - start;
      else if (finish > end) total += finish - end;
      end = Math.max(end, finish);
    }
    if (total > longestDuration) {
      longestDuration = total;
      longestSlot = slot;
    }
  }
  return characters[longestSlot - 1] || characters[0] || 'unknown';
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

function validChartPeriod(period) {
  const item = record(period);
  return ['startup_axis', 'loop_axis'].includes(item.kind)
    && Number.isFinite(item.startMs)
    && Number.isFinite(item.endMs)
    && item.startMs >= 0
    && item.endMs > item.startMs
    && item.endMs <= MAX_DURATION_MS;
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
  const missingPeriodInformation = !Array.isArray(chart.periods) || !chart.periods.some(validChartPeriod);
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
    ...unconvertibleLabels.map((item) => `自定义文字“${item.label}”含无法图标化内容“${item.remainder}”`),
    ...(missingPeriodInformation ? ['未设置有效的启动轴或循环轴时段'] : [])
  ];
  return {
    level: issues.length ? 'high' : 'low',
    lowRisk: issues.length === 0,
    checkedAt: Date.now(),
    issues,
    repeatedActionRuns,
    unconvertibleLabels,
    missingPeriodInformation
  };
}

function submissionPreview(payload) {
  const { chart } = submittedChart(payload);
  const community = record(chart.community);
  const characters = characterNames(Array.isArray(community.characters) && community.characters.length ? community.characters : chart.character);
  return {
    title: String(community.name || community.title || chart.title || '未命名连段').trim().slice(0, 120),
    characters,
    tags: (Array.isArray(community.tags) ? community.tags : chart.tags || []).filter((value) => typeof value === 'string' && value.trim()).map((value) => value.trim()).slice(0, 20),
    longestCharacter: longestActionCharacter(chart, characters),
    stepCount: chart.steps.length,
    loopSwitchCount: loopSwitchCount(chart),
    rounds: Number.isFinite(community.rounds) ? Math.max(1, Math.round(community.rounds)) : 1,
    durationMs: Math.round(chartDuration(chart))
  };
}

function chartSummary(payload, submitter) {
  const { chart } = submittedChart(payload);
  const community = record(chart.community);
  const characters = characterNames(Array.isArray(community.characters) && community.characters.length ? community.characters : chart.character);
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
    longestCharacter: longestActionCharacter(chart, characters.length ? characters : ['unknown']),
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

function commentStorageKey(comboId) {
  return createHash('sha256').update(String(comboId || '')).digest('hex');
}

function normalizeComment(value, fallbackId = '') {
  const item = record(value);
  const body = String(item.body || item.text || '').trim().slice(0, MAX_COMMENT_BODY);
  const id = String(item.id || fallbackId).trim().slice(0, 120);
  if (!body || !id) return null;
  return {
    id,
    parentId: String(item.parentId || '').trim().slice(0, 120),
    username: String(item.username || 'Guest').trim().slice(0, 40) || 'Guest',
    avatar: String(item.avatar || '').trim().slice(0, 80),
    body,
    createdAt: Number.isFinite(Number(item.createdAt)) ? Number(item.createdAt) : Date.now()
  };
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
  const accountRolesFile = path.join(root, 'account-roles.json');
  const downloadsFile = path.join(root, 'downloads.json');
  const engagementFile = path.join(root, 'engagement.json');
  const smtpFile = path.join(root, 'smtp.json');
  const reviewSettingsFile = path.join(root, 'review-settings.json');
  const hiddenFile = path.join(root, 'hidden.json');
  const commissionsFile = path.join(root, 'commissions.json');
  const commissionResponsesRoot = path.join(root, 'commission-responses');
  const commentsRoot = path.join(root, 'comments');
  const commentCountsFile = path.join(root, 'comment-counts.json');
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
      mkdir(commissionResponsesRoot, { recursive: true }),
      mkdir(commentsRoot, { recursive: true })
    ]);
  }

  function commentsFile(comboId) {
    const id = String(comboId || '').trim();
    if (!id || id.length > 240) throw new Error('Invalid combo id.');
    return path.join(commentsRoot, `${commentStorageKey(id)}.json`);
  }

  async function readComboComments(comboId) {
    const value = await readJson(commentsFile(comboId), { version: 1, comments: [] });
    const comments = Array.isArray(value?.comments) ? value.comments
      .map((item, index) => normalizeComment(item, `${comboId}-${index}`))
      .filter(Boolean)
      .slice(-MAX_COMMENTS_PER_COMBO) : [];
    return comments;
  }

  async function commentCounts() {
    const value = record(await readJson(commentCountsFile, {}));
    return Object.fromEntries(Object.entries(value)
      .map(([id, count]) => [id, Math.max(0, Math.min(MAX_COMMENTS_PER_COMBO, Math.floor(Number(count) || 0)))])
      .filter(([, count]) => count > 0));
  }

  async function publicComments(comboId) {
    const comments = await readComboComments(comboId);
    return { comments, count: comments.length };
  }

  async function addComment(comboId, body) {
    const id = String(comboId || '').trim();
    const text = record(body);
    if (!id) throw new Error('Combo id is required.');
    const commentBody = String(text.body || '').trim();
    if (!commentBody || commentBody.length > MAX_COMMENT_BODY) throw new Error('Comment must contain 1 to 1000 characters.');
    const comments = await readComboComments(id);
    const parentId = String(text.parentId || '').trim().slice(0, 120);
    if (parentId && !comments.some((comment) => comment.id === parentId)) throw new Error('The comment being replied to no longer exists.');
    const comment = normalizeComment({
      id: `comment-${randomUUID()}`,
      parentId,
      username: text.username,
      avatar: text.avatar,
      body: commentBody,
      createdAt: Date.now()
    });
    const next = [...comments, comment].slice(-MAX_COMMENTS_PER_COMBO);
    await writeJson(commentsFile(id), { version: 1, comments: next });
    const counts = await commentCounts();
    counts[id] = next.length;
    await writeJson(commentCountsFile, counts);
    return { comment, count: next.length };
  }

  async function whitelist() {
    const value = await readJson(whitelistFile, { emails: [] });
    return [...new Set((Array.isArray(value.emails) ? value.emails : []).map(normalizeEmail).filter(Boolean))].sort();
  }

  async function accountRoleMap() {
    const value = record(await readJson(accountRolesFile, { version: 1, accounts: {} }));
    const accounts = record(value.accounts);
    return Object.fromEntries(Object.entries(accounts).flatMap(([rawEmail, rawRoles]) => {
      const email = normalizeEmail(rawEmail);
      const roles = [...new Set((Array.isArray(rawRoles) ? rawRoles : [])
        .map((role) => String(role || '').trim())
        .filter((role) => ACCOUNT_ROLE_NAMES.has(role)))].sort();
      return email && roles.length ? [[email, roles]] : [];
    }));
  }

  async function accountRoles(email) {
    const normalized = normalizeEmail(email);
    if (!normalized) return [];
    return (await accountRoleMap())[normalized] || [];
  }

  async function wikiAdminEmails() {
    const accounts = await accountRoleMap();
    return Object.entries(accounts)
      .filter(([, roles]) => roles.includes('wiki-admin'))
      .map(([email]) => email)
      .sort();
  }

  async function setWikiAdminEmails(emails) {
    const normalized = [...new Set((Array.isArray(emails) ? emails : []).map(normalizeEmail).filter(Boolean))].sort();
    const selected = new Set(normalized);
    const accounts = await accountRoleMap();
    for (const [email, roles] of Object.entries(accounts)) {
      const nextRoles = roles.filter((role) => role !== 'wiki-admin');
      if (selected.has(email)) nextRoles.push('wiki-admin');
      if (nextRoles.length) accounts[email] = [...new Set(nextRoles)].sort();
      else delete accounts[email];
      selected.delete(email);
    }
    for (const email of selected) accounts[email] = ['wiki-admin'];
    await writeJson(accountRolesFile, { version: 1, accounts });
    return normalized;
  }

  async function smtpSettings() {
    return record(await readJson(smtpFile, {}));
  }

  async function sendCommunityMail(to, subject, text) {
    const recipient = normalizeEmail(to);
    if (!recipient) return '收件人邮箱不可用';
    const settings = await smtpSettings();
    if (!settings.host || !settings.user || !settings.pass) return 'SMTP 尚未配置';
    const { createTransport } = await import('nodemailer');
    const transport = createTransport({
      host: settings.host,
      port: Number(settings.port || 465),
      secure: settings.secure !== false,
      auth: { user: settings.user, pass: settings.pass }
    });
    await transport.sendMail({ from: settings.from || settings.user, to: recipient, subject, text });
    return '';
  }

  async function sendAccountLoginCode(email, code, expiresMinutes = 10) {
    const recipient = normalizeEmail(email);
    if (!recipient) throw new Error('邮箱格式不正确。');
    const error = await sendCommunityMail(
      recipient,
      '[椰之城] 邮箱登录验证码',
      `你的椰之城邮箱登录验证码是：${code}\n\n验证码将在 ${expiresMinutes} 分钟后失效。若不是你本人操作，请忽略这封邮件。`
    );
    if (error) throw new Error(error);
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
      subject: `[椰之城] 新连段待审核：${submission.fileName}`,
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
    const { chart: sourceChart } = submittedChart(payload);
    const chart = canonicalizeChartCharacters(sourceChart);
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
    await transport.sendMail({ from: settings.from || settings.user, to: settings.to, subject: '[椰之城] SMTP 测试', text: '服务器投稿通知已配置成功。' });
  }

  async function resendFailedNotifications() {
    const settings = await smtpSettings();
    if (!settings.host || !settings.user || !settings.pass || !settings.to) throw new Error('请先保存并测试 SMTP 设置。');
    const [queue, commissions] = await Promise.all([
      readJson(queueFile, { pending: [], history: [] }),
      commissionState()
    ]);
    const summary = {
      attempted: 0,
      sent: 0,
      failed: 0,
      submissions: { attempted: 0, sent: 0, failed: 0 },
      commissionResponses: { attempted: 0, sent: 0, failed: 0 },
      adoptions: { attempted: 0, sent: 0, failed: 0 },
      failures: []
    };
    let queueChanged = false;
    let commissionsChanged = false;

    async function retry(category, id, target, errorKey, sentAtKey, send) {
      summary.attempted += 1;
      summary[category].attempted += 1;
      const attemptedAt = Date.now();
      try {
        const error = await send();
        if (error) throw new Error(error);
        delete target[errorKey];
        target[sentAtKey] = attemptedAt;
        target.notificationRetryAt = attemptedAt;
        summary.sent += 1;
        summary[category].sent += 1;
      } catch (error) {
        const message = String(error?.message || error || '邮件发送失败').slice(0, 500);
        target[errorKey] = message;
        target.notificationRetryAt = attemptedAt;
        summary.failed += 1;
        summary[category].failed += 1;
        summary.failures.push({ category, id: String(id || ''), error: message });
      }
    }

    for (const submission of [...(Array.isArray(queue.pending) ? queue.pending : []), ...(Array.isArray(queue.history) ? queue.history : [])]) {
      if (!String(submission?.notificationError || '').trim()) continue;
      await retry('submissions', submission.id, submission, 'notificationError', 'notificationSentAt', () => sendSubmissionNotice(submission));
      queueChanged = true;
    }

    for (const commission of commissions.commissions) {
      for (const response of Array.isArray(commission.responses) ? commission.responses : []) {
        if (String(response.notificationError || '').trim()) {
          await retry('commissionResponses', response.id, response, 'notificationError', 'notificationSentAt', () => sendCommunityMail(
            commission.owner?.email,
            `[椰之城] 委托收到新方案：${commission.title}`,
            `你的委托收到了一份新方案。\n\n委托：${commission.title}\n方案：${response.preview?.title || response.fileName}\n上传者：${response.username}\n提交时间：${new Date(response.submittedAt).toLocaleString('zh-CN')}\n\n请打开椰之城委托广场查看和预览。`
          ));
          commissionsChanged = true;
        }
        if (String(response.adoptionNotificationError || '').trim()) {
          await retry('adoptions', response.id, response, 'adoptionNotificationError', 'adoptionNotificationSentAt', () => sendCommunityMail(
            response.email,
            `[椰之城] 你的委托方案已被采纳：${commission.title}`,
            `你为委托“${commission.title}”提交的方案“${response.preview?.title || response.fileName}”已被采纳，并已进入连段社区审核流程。\n\n审核状态：${response.moderationStatus === 'published' ? '已通过预审核并发布' : '等待维护者审核'}\n投稿编号：${response.moderationSubmissionId || '未知'}`
          ));
          commissionsChanged = true;
        }
      }
    }

    if (queueChanged) await writeJson(queueFile, queue);
    if (commissionsChanged) await writeJson(commissionsFile, commissions);
    return summary;
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
        readJson(engagementFile, { counts: {}, downloads: {}, votes: {}, feedbacks: {} })
      ]);
      const normalizedCounts = record(counts);
      normalizedCounts[comboId] = Math.max(0, Number(normalizedCounts[comboId] || 0)) + 1;
      engagement.counts = record(engagement.counts);
      engagement.downloads = record(engagement.downloads);
      engagement.votes = record(engagement.votes);
      engagement.feedbacks = record(engagement.feedbacks);
      if (voterId) engagement.downloads[voterId] = { ...record(engagement.downloads[voterId]), [comboId]: Date.now() };
      await Promise.all([writeJson(downloadsFile, normalizedCounts), writeJson(engagementFile, engagement)]);
      return normalizedCounts[comboId];
    });
    downloadWrite = operation.catch(() => {});
    return operation;
  }

  async function publicEngagement(voterId = '') {
    const engagement = await readJson(engagementFile, { counts: {}, downloads: {}, votes: {}, feedbacks: {} });
    const counts = record(engagement.counts);
    const downloaded = record(record(engagement.downloads)[voterId]);
    const voterVotes = record(record(engagement.votes)[voterId]);
    const voterFeedbacks = record(record(engagement.feedbacks)[voterId]);
    return { counts, downloaded, voterVotes, voterFeedbacks };
  }

  async function castVote(comboId, voterId, vote) {
    if (!comboId || !voterId || vote !== 'up') throw new Error('评价参数不正确。');
    return serializeMutation(async () => {
      const engagement = await readJson(engagementFile, { counts: {}, downloads: {}, votes: {}, feedbacks: {} });
      engagement.counts = record(engagement.counts);
      engagement.downloads = record(engagement.downloads);
      engagement.votes = record(engagement.votes);
      engagement.feedbacks = record(engagement.feedbacks);
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

  async function sendComboFeedback(comboId, voterId, reasonValue) {
    const reason = String(reasonValue || '').trim().slice(0, 1000);
    if (!comboId || !voterId) throw new Error('反馈参数不正确。');
    if (reason.length < 5) throw new Error('反馈理由至少需要 5 个字符。');
    const engagement = await readJson(engagementFile, { counts: {}, downloads: {}, votes: {}, feedbacks: {} });
    engagement.counts = record(engagement.counts);
    engagement.downloads = record(engagement.downloads);
    engagement.votes = record(engagement.votes);
    engagement.feedbacks = record(engagement.feedbacks);
    if (!record(engagement.downloads[voterId])[comboId]) {
      const error = new Error('请先下载该连段，再向上传者发送反馈。');
      error.statusCode = 403;
      throw error;
    }
    const voterFeedbacks = record(engagement.feedbacks[voterId]);
    if (voterFeedbacks[comboId]) {
      const error = new Error('你已经反馈过这个连段。');
      error.statusCode = 409;
      throw error;
    }

    const [owners, published, settings] = await Promise.all([
      readJson(ownersFile, {}),
      readJson(publishedFile, { charts: [] }),
      smtpSettings()
    ]);
    const ownerEmail = normalizeEmail(record(owners)[comboId]?.email);
    if (!ownerEmail || ownerEmail.endsWith('.invalid')) {
      const error = new Error('该连段没有可用的上传者邮箱，暂时无法发送反馈。');
      error.statusCode = 409;
      throw error;
    }
    if (!settings.host || !settings.user || !settings.pass) {
      const error = new Error('站点邮件服务尚未配置，暂时无法发送反馈。');
      error.statusCode = 503;
      throw error;
    }
    const publishedItem = (Array.isArray(published.charts) ? published.charts : []).find((item) => item.chart?.id === comboId);
    const title = String(publishedItem?.chart?.title || comboId).replace(/[\r\n]+/g, ' ').trim().slice(0, 120) || comboId;
    const { createTransport } = await import('nodemailer');
    const transport = createTransport({
      host: settings.host,
      port: Number(settings.port || 465),
      secure: settings.secure !== false,
      auth: { user: settings.user, pass: settings.pass }
    });
    await transport.sendMail({
      from: settings.from || settings.user,
      to: ownerEmail,
      subject: `[椰之城] 连段反馈：${title}`,
      text: `你的连段收到了一条匿名反馈。\n\n连段：${title}\nID：${comboId}\n\n反馈内容：\n${reason}\n\n此邮件由椰之城社区自动发送，请勿直接回复站点邮箱。`
    });
    engagement.feedbacks[voterId] = { ...voterFeedbacks, [comboId]: Date.now() };
    await writeJson(engagementFile, engagement);
    return { feedbackSubmitted: true, canFeedback: false };
  }

  function commissionPublic(item, voterId = '', upEmails = new Set(), viewerEmail = '', counts = {}) {
    const owner = record(item.owner);
    const viewer = normalizeEmail(viewerEmail);
    const responses = (Array.isArray(item.responses) ? item.responses : []).map((response) => {
      const preview = record(response.preview);
      const responseEmail = normalizeEmail(response.email);
      return {
        id: String(response.id || ''),
        title: String(preview.title || response.fileName || '未命名连段'),
        characters: characterNames(preview.characters),
        longestCharacter: String(preview.longestCharacter || '').trim(),
        tags: Array.isArray(preview.tags) ? preview.tags : [],
        rounds: Math.max(1, Number(preview.rounds || 1)),
        durationMs: Math.max(0, Number(preview.durationMs || 0)),
        stepCount: Math.max(0, Number(preview.stepCount || 0)),
        loopSwitchCount: Math.max(0, Number(preview.loopSwitchCount || 0)),
        fileName: String(response.fileName || ''),
        submittedAt: Number(response.submittedAt || 0),
        status: response.status === 'accepted' ? 'accepted' : 'submitted',
        viewerIsSubmitter: Boolean(viewer && responseEmail === viewer),
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
      tag: commissionTag(item.tag),
      owner: {
        nickname: String(owner.username || '未命名用户'),
        email: publicEmail(ownerEmail),
        ...(owner.avatar ? { avatar: String(owner.avatar) } : {}),
        ...(upEmails.has(ownerEmail) ? { badge: 'UP' } : {})
      },
      viewerIsOwner: Boolean(viewer && ownerEmail === viewer),
      status: item.status === 'completed' ? 'completed' : 'open',
      createdAt: Number(item.createdAt || 0),
      updatedAt: Number(item.updatedAt || item.createdAt || 0),
      interestCount: Object.keys(interests).length,
      viewerInterested: Boolean(voterId && interests[voterId]),
      responseCount: responses.length,
      commentCount: Math.max(0, Number(counts[`commission:${item.id}`] || 0)),
      responses,
      ...(item.acceptedResponseId ? { acceptedResponseId: String(item.acceptedResponseId) } : {}),
      ...(item.publishedComboId ? { publishedComboId: String(item.publishedComboId) } : {})
    };
  }

  async function commissionState() {
    const value = record(await readJson(commissionsFile, { version: 1, commissions: [] }));
    return { version: 1, commissions: Array.isArray(value.commissions) ? value.commissions : [] };
  }

  async function commissionPublicValue(item, voterId = '', viewerEmail = '') {
    const [emails, counts] = await Promise.all([whitelist(), commentCounts()]);
    return commissionPublic(item, voterId, new Set(emails), viewerEmail, counts);
  }

  async function publicCommissions(voterId = '', viewerEmail = '') {
    const [state, emails, counts] = await Promise.all([commissionState(), whitelist(), commentCounts()]);
    const upEmails = new Set(emails);
    return {
      version: 1,
      updatedAt: Math.max(0, ...state.commissions.map((item) => Number(item.updatedAt || item.createdAt || 0))),
      commissions: state.commissions
        .map((item) => commissionPublic(item, voterId, upEmails, viewerEmail, counts))
        .sort((left, right) => Number(left.status === 'completed') - Number(right.status === 'completed') || right.updatedAt - left.updatedAt)
    };
  }

  async function createCommission(body, voterId = '') {
    const username = String(body.username || '').trim().slice(0, 40);
    const email = normalizeEmail(body.email);
    const title = String(body.title || '').trim().slice(0, 120);
    const description = String(body.description || '').trim().slice(0, 4000);
    const characters = characterNames(body.characters);
    const tag = String(body.tag || '').trim();
    if (!username) throw new Error('请先填写用户名。');
    if (!email) throw new Error('邮箱格式不正确。');
    if (!title) throw new Error('请填写委托标题。');
    if (!description) throw new Error('请填写需要的具体流程。');
    if (!characters.length) throw new Error('请至少选择一名需要的角色。');
    if (!COMMISSION_TAGS.includes(tag)) throw new Error('请选择有效的委托标签。');
    const now = Date.now();
    const item = {
      id: randomUUID(),
      title,
      description,
      characters,
      tag,
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
    return commissionPublicValue(item, voterId, email);
  }

  async function addCommissionInterest(id, voterId, viewerEmail = '') {
    if (!voterId) throw new Error('无法识别当前浏览器。');
    const state = await commissionState();
    const item = state.commissions.find((commission) => commission.id === id);
    if (!item) throw new Error('委托不存在。');
    if (item.status === 'completed') throw new Error('这个委托已经完成。');
    if (normalizeEmail(viewerEmail) === normalizeEmail(record(item.owner).email)) throw new Error('委托者已经计入想要人数。');
    item.interests = record(item.interests);
    if (!item.interests[voterId]) {
      item.interests[voterId] = Date.now();
      item.updatedAt = Date.now();
      await writeJson(commissionsFile, state);
    }
    return commissionPublicValue(item, voterId, viewerEmail);
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
    try {
      response.notificationError = await sendCommunityMail(
        item.owner?.email,
        `[椰之城] 委托收到新方案：${item.title}`,
        `你的委托收到了一份新方案。\n\n委托：${item.title}\n方案：${preview.title}\n上传者：${username}\n提交时间：${new Date(response.submittedAt).toLocaleString('zh-CN')}\n\n请打开椰之城委托广场查看和预览。`
      );
    } catch (error) {
      response.notificationError = error.message || String(error);
    }
    if (response.notificationError) await writeJson(commissionsFile, state);
    const publicItem = await commissionPublicValue(item, voterId, email);
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

  async function adoptCommissionResponseInternal(commissionId, responseId, { email = '', voterId = '', automatic = false, admin = false } = {}) {
    const state = await commissionState();
    const item = state.commissions.find((commission) => commission.id === commissionId);
    if (!item) throw new Error('委托不存在。');
    if (!automatic && !admin && normalizeEmail(item.owner?.email) !== email) throw new Error('只有委托发布者可以采纳方案。');
    if (item.status === 'completed') throw new Error('这个委托已经完成。');
    const response = (Array.isArray(item.responses) ? item.responses : []).find((entry) => entry.id === responseId);
    if (!response) throw new Error('委托方案不存在。');
    if (response.status !== 'submitted') throw new Error('这份委托方案当前不可采纳。');
    const storedFile = path.basename(String(response.storedFile || ''));
    if (!storedFile || storedFile !== response.storedFile) throw new Error('委托方案文件路径不安全。');
    const content = JSON.parse(await readFile(path.join(commissionResponsesRoot, item.id, storedFile), 'utf8'));
    const moderation = await submit({
      username: response.username,
      email: response.email,
      avatar: response.avatar,
      fileName: response.fileName,
      content
    }, 'commission-adoption');
    const now = Date.now();
    item.status = 'completed';
    item.acceptedResponseId = response.id;
    item.completedAt = now;
    item.updatedAt = now;
    if (automatic) item.autoAdopted = true;
    response.status = 'accepted';
    response.acceptedAt = now;
    if (automatic) response.autoAdopted = true;
    response.moderationSubmissionId = moderation.id;
    response.moderationStatus = moderation.status;
    if (moderation.chart?.id) {
      response.comboId = moderation.chart.id;
      item.publishedComboId = moderation.chart.id;
    }
    try {
      response.adoptionNotificationError = await sendCommunityMail(
        response.email,
        `[椰之城] 你的委托方案已被采纳：${item.title}`,
        `你为委托“${item.title}”提交的方案“${response.preview?.title || response.fileName}”已被采纳，并已进入连段社区审核流程。\n\n审核状态：${moderation.status === 'published' ? '已通过预审核并发布' : '等待维护者审核'}\n投稿编号：${moderation.id}`
      );
    } catch (error) {
      response.adoptionNotificationError = error.message || String(error);
    }
    await writeJson(commissionsFile, state);
    return {
      commission: await commissionPublicValue(item, voterId, email),
      moderation: { id: moderation.id, status: moderation.status, ...(moderation.chart?.id ? { comboId: moderation.chart.id } : {}) }
    };
  }

  async function adminCommissions() {
    const state = await commissionState();
    return {
      version: 1,
      updatedAt: Math.max(0, ...state.commissions.map((item) => Number(item.updatedAt || item.createdAt || 0))),
      commissions: state.commissions.map((item) => ({
        id: String(item.id || ''), title: String(item.title || '未命名委托'), description: String(item.description || ''), characters: characterNames(item.characters), tag: commissionTag(item.tag),
        owner: { username: String(item.owner?.username || '未命名用户'), email: normalizeEmail(item.owner?.email), avatar: String(item.owner?.avatar || '') },
        status: item.status === 'completed' ? 'completed' : 'open', createdAt: Number(item.createdAt || 0), updatedAt: Number(item.updatedAt || item.createdAt || 0), completedAt: Number(item.completedAt || 0), acceptedResponseId: String(item.acceptedResponseId || ''), publishedComboId: String(item.publishedComboId || ''), interestCount: Object.keys(record(item.interests)).length + 1, responseCount: Array.isArray(item.responses) ? item.responses.length : 0,
        responses: (Array.isArray(item.responses) ? item.responses : []).map((response) => ({
          id: String(response.id || ''), title: String(response.preview?.title || response.fileName || '未命名连段'), fileName: String(response.fileName || ''), username: String(response.username || '未命名用户'), email: normalizeEmail(response.email), avatar: String(response.avatar || ''), characters: characterNames(response.preview?.characters), tags: Array.isArray(response.preview?.tags) ? response.preview.tags : [], rounds: Math.max(1, Number(response.preview?.rounds || 1)), durationMs: Math.max(0, Number(response.preview?.durationMs || 0)), stepCount: Math.max(0, Number(response.preview?.stepCount || 0)), submittedAt: Number(response.submittedAt || 0), status: response.status === 'accepted' ? 'accepted' : 'submitted', preflight: response.preflight || { lowRisk: false, issues: ['尚未完成预审核'] }, moderationSubmissionId: String(response.moderationSubmissionId || ''), moderationStatus: String(response.moderationStatus || '')
        }))
      })).sort((left, right) => Number(left.status === 'completed') - Number(right.status === 'completed') || right.updatedAt - left.updatedAt)
    };
  }

  async function adoptCommissionResponse(commissionId, responseId, body, voterId = '') {
    const email = normalizeEmail(body.email);
    if (!email) throw new Error('请先登记委托时使用的邮箱。');
    return adoptCommissionResponseInternal(commissionId, responseId, { email, voterId });
  }

  async function adminAdoptCommissionResponse(commissionId, responseId) {
    return adoptCommissionResponseInternal(commissionId, responseId, { admin: true });
  }

  async function autoAdoptExpiredCommissions(now = Date.now()) {
    const state = await commissionState();
    const cutoff = Number(now) - COMMISSION_AUTO_ADOPT_AFTER_MS;
    const candidates = state.commissions
      .filter((commission) => commission.status !== 'completed' && !commission.acceptedResponseId)
      .map((commission) => {
        const response = (Array.isArray(commission.responses) ? commission.responses : [])
          .filter((item) => item?.status === 'submitted')
          .sort((left, right) => Number(left.submittedAt || 0) - Number(right.submittedAt || 0))[0];
        const submittedAt = Number(response?.submittedAt || 0);
        return response && Number.isFinite(submittedAt) && submittedAt > 0 && submittedAt <= cutoff
          ? { commission, response }
          : null;
      })
      .filter(Boolean)
      .sort((left, right) => Number(left.response.submittedAt || 0) - Number(right.response.submittedAt || 0));

    const results = [];
    for (const { commission, response } of candidates) {
      try {
        const result = await adoptCommissionResponseInternal(commission.id, response.id, { automatic: true });
        results.push({ commissionId: commission.id, responseId: response.id, status: 'completed', moderation: result.moderation });
      } catch (error) {
        results.push({ commissionId: commission.id, responseId: response.id, status: 'failed', error: String(error?.message || error) });
      }
    }
    return { checked: state.commissions.length, eligible: candidates.length, results };
  }

  async function withdrawCommissionResponse(commissionId, responseId, body, voterId = '') {
    const email = normalizeEmail(body.email);
    if (!email) throw new Error('请先登记提交方案时使用的邮箱。');
    const state = await commissionState();
    const item = state.commissions.find((commission) => commission.id === commissionId);
    if (!item) throw new Error('委托不存在。');
    if (item.status === 'completed') throw new Error('已完成委托的方案不能撤回。');
    const responses = Array.isArray(item.responses) ? item.responses : [];
    const index = responses.findIndex((entry) => entry.id === responseId);
    if (index < 0) throw new Error('委托方案不存在。');
    const response = responses[index];
    if (normalizeEmail(response.email) !== email) throw new Error('只有方案上传者可以撤回方案。');
    if (response.status === 'accepted') throw new Error('已采纳的方案不能撤回。');
    const storedFile = path.basename(String(response.storedFile || ''));
    if (!storedFile || storedFile !== response.storedFile) throw new Error('委托方案文件路径不安全。');
    responses.splice(index, 1);
    item.responses = responses;
    item.updatedAt = Date.now();
    await writeJson(commissionsFile, state);
    await rm(path.join(commissionResponsesRoot, item.id, storedFile), { force: true }).catch(() => {});
    return {
      commission: await commissionPublicValue(item, voterId, email),
      responseId,
      status: 'withdrawn'
    };
  }

  async function withdrawCommission(commissionId, body) {
    const email = normalizeEmail(body.email);
    if (!email) throw new Error('请先登记发布委托时使用的邮箱。');
    const state = await commissionState();
    const index = state.commissions.findIndex((commission) => commission.id === commissionId);
    if (index < 0) throw new Error('委托不存在。');
    const item = state.commissions[index];
    if (normalizeEmail(item.owner?.email) !== email) throw new Error('只有委托发布者可以撤回委托。');
    if (item.status === 'completed') throw new Error('已完成的委托不能撤回。');
    state.commissions.splice(index, 1);
    await writeJson(commissionsFile, state);
    await rm(path.join(commissionResponsesRoot, item.id), { recursive: true, force: true }).catch(() => {});
    const commentsId = `commission:${item.id}`;
    await rm(commentsFile(commentsId), { force: true }).catch(() => {});
    const counts = await commentCounts();
    if (Object.hasOwn(counts, commentsId)) {
      delete counts[commentsId];
      await writeJson(commentCountsFile, counts);
    }
    return { id: item.id, status: 'withdrawn' };
  }

  async function status() {
    const [queue, published, withdrawals, emails, wikiAdmins, smtp, moderation, downloads, hidden, commissions] = await Promise.all([
      readJson(queueFile, { pending: [], history: [] }),
      readJson(publishedFile, { charts: [] }),
      readJson(withdrawalsFile, { pending: [], history: [] }),
      whitelist(), wikiAdminEmails(), smtpSettings(), reviewSettings(), readJson(downloadsFile, {}), hiddenIds(), commissionState()
    ]);
    return {
      submissions: { pending: queue.pending || [], history: (queue.history || []).slice(-30).reverse() },
      withdrawals: { pending: withdrawals.pending || [], history: (withdrawals.history || []).slice(-30).reverse() },
      published: published.charts || [],
      whitelist: emails,
      wikiAdmins,
      smtp: smtpPublic(smtp),
      failedNotifications: [
        ...(queue.pending || []),
        ...(queue.history || []),
        ...commissions.commissions.flatMap((item) => Array.isArray(item.responses) ? item.responses : [])
      ].reduce((count, item) => count + Number(Boolean(item?.notificationError)) + Number(Boolean(item?.adoptionNotificationError)), 0),
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
    setWikiAdminEmails: (...args) => serializeMutation(() => setWikiAdminEmails(...args)),
    accountRoles,
    sendAccountLoginCode,
    setSmtp: (...args) => serializeMutation(() => setSmtp(...args)),
    setReviewSettings: (...args) => serializeMutation(() => setReviewSettings(...args)),
    testSmtp,
    resendFailedNotifications: (...args) => serializeMutation(() => resendFailedNotifications(...args)),
    incrementDownload,
    recordDownload,
    publicEngagement,
    publicComments,
    addComment: (...args) => serializeMutation(() => addComment(...args)),
    commentCounts,
    castVote,
    sendComboFeedback: (...args) => serializeMutation(() => sendComboFeedback(...args)),
    publicCommissions,
    adminCommissions,
    createCommission: (...args) => serializeMutation(() => createCommission(...args)),
    addCommissionInterest: (...args) => serializeMutation(() => addCommissionInterest(...args)),
    submitCommissionResponse: (...args) => serializeMutation(() => submitCommissionResponse(...args)),
    commissionResponseContent,
    adoptCommissionResponse: (...args) => serializeMutation(() => adoptCommissionResponse(...args)),
    adminAdoptCommissionResponse: (...args) => serializeMutation(() => adminAdoptCommissionResponse(...args)),
    autoAdoptExpiredCommissions: (...args) => serializeMutation(() => autoAdoptExpiredCommissions(...args)),
    withdrawCommissionResponse: (...args) => serializeMutation(() => withdrawCommissionResponse(...args)),
    withdrawCommission: (...args) => serializeMutation(() => withdrawCommission(...args)),
    status,
    preflight: (payload) => preflightReview(payload)
  };
}

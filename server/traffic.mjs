import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { replaceWithRetry } from './fsSafe.mjs';

const TIME_ZONE = 'Asia/Shanghai';
const DAY_RETENTION = 366;
const VISITOR_RETENTION = 31;
const FLUSH_DELAY_MS = 2000;
const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  hourCycle: 'h23'
});

function asRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function dateParts(value = Date.now()) {
  const parts = Object.fromEntries(dateFormatter.formatToParts(new Date(value)).map((part) => [part.type, part.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Math.max(0, Math.min(23, Number(parts.hour || 0)))
  };
}

function dayKeyOffset(offset) {
  const today = dateParts().date;
  const [year, month, day] = today.split('-').map(Number);
  const target = new Date(Date.UTC(year, month - 1, day + offset, 12));
  return target.toISOString().slice(0, 10);
}

function normalizedHours(value) {
  return Array.from({ length: 24 }, (_, index) => Math.max(0, Number(Array.isArray(value) ? value[index] : 0) || 0));
}

function normalizedCounts(value, keys) {
  const source = asRecord(value);
  return Object.fromEntries(keys.map((key) => [key, Math.max(0, Number(source[key] || 0))]));
}

function normalizedDay(value) {
  const source = asRecord(value);
  const visitors = Array.isArray(source.visitors)
    ? [...new Set(source.visitors.map((item) => String(item || '')).filter(Boolean).slice(0, 50000))]
    : [];
  return {
    date: String(source.date || ''),
    views: Math.max(0, Number(source.views || 0)),
    uniqueVisitors: Math.max(visitors.length, Number(source.uniqueVisitors || 0)),
    hours: normalizedHours(source.hours),
    sections: normalizedCounts(source.sections, ['combos', 'commissions']),
    sources: normalizedCounts(source.sources, ['browser', 'client']),
    ...(visitors.length ? { visitors } : {})
  };
}

function emptyState() {
  return { version: 1, startedAt: Date.now(), totalViews: 0, days: [] };
}

function normalizedState(value) {
  const source = asRecord(value);
  const days = (Array.isArray(source.days) ? source.days : [])
    .map(normalizedDay)
    .filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day.date))
    .sort((left, right) => left.date.localeCompare(right.date))
    .slice(-DAY_RETENTION);
  return {
    version: 1,
    startedAt: Math.max(0, Number(source.startedAt || Date.now())),
    totalViews: Math.max(days.reduce((sum, day) => sum + day.views, 0), Number(source.totalViews || 0)),
    days
  };
}

function visitorHash(value) {
  return createHash('sha256').update(String(value || '')).digest('base64url').slice(0, 16);
}

function emptyDay(date) {
  return {
    date,
    views: 0,
    uniqueVisitors: 0,
    hours: Array(24).fill(0),
    sections: { combos: 0, commissions: 0 },
    sources: { browser: 0, client: 0 },
    visitors: []
  };
}

function sumBreakdown(days, key, names) {
  return Object.fromEntries(names.map((name) => [name, days.reduce((sum, day) => sum + Number(day[key]?.[name] || 0), 0)]));
}

function peakWindow(hours) {
  let start = 0;
  let views = 0;
  for (let candidate = 0; candidate < 24; candidate += 1) {
    const total = [0, 1, 2].reduce((sum, offset) => sum + hours[(candidate + offset) % 24], 0);
    if (total > views) {
      start = candidate;
      views = total;
    }
  }
  const end = (start + 3) % 24;
  return { start, end, views, label: `${String(start).padStart(2, '0')}:00-${String(end).padStart(2, '0')}:00` };
}

export function isHumanPageRequest(userAgent) {
  const value = String(userAgent || '').trim();
  if (!value) return false;
  return !/(?:bot|spider|crawler|slurp|headless|lighthouse|curl|wget|undici|node(?:-fetch)?|healthcheck|monitor|uptime)/iu.test(value);
}

export function createTrafficService({ runtimeRoot }) {
  const root = path.join(runtimeRoot, 'traffic');
  const stateFile = path.join(root, 'traffic.json');
  let state = emptyState();
  let revision = 0;
  let writtenRevision = 0;
  let flushTimer = null;
  let writeQueue = Promise.resolve();

  function prune() {
    state.days = state.days.sort((left, right) => left.date.localeCompare(right.date)).slice(-DAY_RETENTION);
    const visitorCutoff = dayKeyOffset(-(VISITOR_RETENTION - 1));
    for (const day of state.days) {
      if (day.date < visitorCutoff) delete day.visitors;
    }
  }

  async function initialize() {
    await mkdir(root, { recursive: true });
    try {
      state = normalizedState(JSON.parse(await readFile(stateFile, 'utf8')));
    } catch {
      state = emptyState();
    }
    prune();
  }

  function scheduleFlush() {
    if (flushTimer) return;
    flushTimer = setTimeout(() => {
      flushTimer = null;
      void flush().catch((error) => console.error(`[wwcombo] 访问统计保存失败: ${error.message || error}`));
    }, FLUSH_DELAY_MS);
    flushTimer.unref?.();
  }

  function record({ visitorId, section = 'combos', source = 'browser', at = Date.now() }) {
    if (!visitorId) return;
    const current = dateParts(at);
    let day = state.days.find((item) => item.date === current.date);
    if (!day) {
      day = emptyDay(current.date);
      state.days.push(day);
    }
    day.views += 1;
    day.hours[current.hour] += 1;
    day.sections[section === 'commissions' ? 'commissions' : 'combos'] += 1;
    day.sources[source === 'client' ? 'client' : 'browser'] += 1;
    const hash = visitorHash(visitorId);
    day.visitors = Array.isArray(day.visitors) ? day.visitors : [];
    if (!day.visitors.includes(hash) && day.visitors.length < 50000) day.visitors.push(hash);
    day.uniqueVisitors = Math.max(day.uniqueVisitors, day.visitors.length);
    state.totalViews += 1;
    revision += 1;
    prune();
    scheduleFlush();
  }

  async function flush() {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    if (writtenRevision === revision) return writeQueue;
    const targetRevision = revision;
    const serialized = `${JSON.stringify(state, null, 2)}\n`;
    writeQueue = writeQueue.catch(() => {}).then(async () => {
      const temporary = `${stateFile}.${process.pid}.tmp`;
      await writeFile(temporary, serialized, { encoding: 'utf8', mode: 0o600 });
      await replaceWithRetry(temporary, stateFile);
      writtenRevision = Math.max(writtenRevision, targetRevision);
      if (writtenRevision !== revision) scheduleFlush();
    });
    return writeQueue;
  }

  function summary() {
    const todayKey = dayKeyOffset(0);
    const yesterdayKey = dayKeyOffset(-1);
    const recent30Keys = Array.from({ length: 30 }, (_, index) => dayKeyOffset(index - 29));
    const recent14Keys = recent30Keys.slice(-14);
    const recent7Keys = recent30Keys.slice(-7);
    const byDate = new Map(state.days.map((day) => [day.date, day]));
    const recent30 = recent30Keys.map((date) => byDate.get(date) || emptyDay(date));
    const recent7 = recent7Keys.map((date) => byDate.get(date) || emptyDay(date));
    const today = byDate.get(todayKey) || emptyDay(todayKey);
    const yesterday = byDate.get(yesterdayKey) || emptyDay(yesterdayKey);
    const last7Visitors = new Set(recent7.flatMap((day) => Array.isArray(day.visitors) ? day.visitors : []));
    const hourly = Array.from({ length: 24 }, (_, hour) => recent30.reduce((sum, day) => sum + Number(day.hours[hour] || 0), 0));
    const busiestDay = recent30.reduce((best, day) => day.views > best.views ? day : best, emptyDay(''));
    return {
      timeZone: TIME_ZONE,
      startedAt: state.startedAt,
      totalViews: state.totalViews,
      today: { views: today.views, visitors: today.uniqueVisitors },
      yesterday: { views: yesterday.views, visitors: yesterday.uniqueVisitors },
      last7Days: {
        views: recent7.reduce((sum, day) => sum + day.views, 0),
        visitors: last7Visitors.size
      },
      last30Days: {
        views: recent30.reduce((sum, day) => sum + day.views, 0),
        peakWindow: peakWindow(hourly),
        busiestDay: { date: busiestDay.date, views: busiestDay.views },
        sections: sumBreakdown(recent30, 'sections', ['combos', 'commissions']),
        sources: sumBreakdown(recent30, 'sources', ['browser', 'client'])
      },
      daily: recent14Keys.map((date) => {
        const day = byDate.get(date) || emptyDay(date);
        return { date, views: day.views, visitors: day.uniqueVisitors };
      }),
      hourly,
      updatedAt: Date.now()
    };
  }

  return { initialize, record, summary, flush };
}

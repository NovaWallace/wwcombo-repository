import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { moveWithRetry, replaceWithRetry } from './fsSafe.mjs';

const execFileAsync = promisify(execFile);
const PUBLIC_SITE_ENTRIES = ['.nojekyll', 'index.html', 'app.js', 'i18n.js', 'styles.css', 'site.webmanifest', 'robots.txt', 'sitemap.xml', 'assets'];
const DEFAULT_REPOSITORY_URLS = {
  deta1: 'https://github.com/NovaWallace/wwcombo-deta1.git',
  deta2: 'https://github.com/NovaWallace/wwcombo-deta2.git'
};

async function run(command, args, options = {}) {
  const result = await execFileAsync(command, args, {
    cwd: options.cwd,
    windowsHide: true,
    maxBuffer: 8 * 1024 * 1024,
    env: process.env
  });
  return { stdout: result.stdout || '', stderr: result.stderr || '' };
}

function logLine(onLog, message) {
  onLog?.(String(message));
}

function repositoryPaths(runtimeRoot) {
  const repositoriesRoot = path.join(runtimeRoot, 'repositories');
  return {
    deta1: path.join(repositoriesRoot, 'deta1'),
    deta2: path.join(repositoriesRoot, 'deta2')
  };
}

async function ensureDataRepository(id, target, { update, onLog }) {
  const url = process.env[`WWCOMBO_${id.toUpperCase()}_REPO_URL`] || DEFAULT_REPOSITORY_URLS[id];
  if (!existsSync(path.join(target, '.git'))) {
    await mkdir(path.dirname(target), { recursive: true });
    logLine(onLog, `正在 clone ${id}`);
    await run('git', ['clone', '--depth', '1', '--branch', 'main', url, target]);
    return;
  }
  if (!update) return;
  const dirty = await run('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: target });
  if (dirty.stdout.trim()) throw new Error(`${id} clone 存在本地修改，已停止更新。`);
  logLine(onLog, `正在更新 ${id}`);
  await run('git', ['remote', 'set-url', 'origin', url], { cwd: target });
  await run('git', ['pull', '--ff-only', 'origin', 'main'], { cwd: target });
}

async function updateMainRepository(mainRoot, onLog) {
  if (!existsSync(path.join(mainRoot, '.git'))) throw new Error('主目录不是 Git clone，无法从 GitHub 更新。');
  const dirty = await run('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: mainRoot });
  if (dirty.stdout.trim()) throw new Error('主仓库存在本地修改，已停止更新以免覆盖文件。');
  logLine(onLog, '正在更新主仓库 repository');
  await run('git', ['pull', '--ff-only', 'origin', 'main'], { cwd: mainRoot });
}

async function commitOf(repository) {
  return (await run('git', ['rev-parse', 'HEAD'], { cwd: repository })).stdout.trim();
}

function publishedParts(url) {
  const pathname = new URL(String(url), 'https://wwcombo.invalid').pathname;
  const marker = '/published/';
  const markerIndex = pathname.indexOf(marker);
  if (markerIndex < 0) throw new Error(`连段地址缺少 ${marker}: ${url}`);
  const decoded = decodeURIComponent(pathname.slice(markerIndex + marker.length));
  const parts = decoded.split('/').filter(Boolean);
  if (!parts.length || parts.some((part) => part === '.' || part === '..' || part.includes('\\'))) {
    throw new Error(`不安全的连段路径: ${url}`);
  }
  return parts;
}

function encodedPublishedPath(parts) {
  return parts.map((part) => encodeURIComponent(part)).join('/');
}

async function copyPublicRelease({ mainRoot, dataPaths, stagingRoot }) {
  for (const entry of PUBLIC_SITE_ENTRIES) {
    const source = path.join(mainRoot, entry);
    if (!existsSync(source)) throw new Error(`主仓库缺少网站文件: ${entry}`);
    await cp(source, path.join(stagingRoot, entry), { recursive: true, force: true });
  }
  const adminSource = path.join(mainRoot, 'server', 'admin');
  if (!existsSync(adminSource)) throw new Error('主仓库缺少 server/admin 管理页面。');
  await cp(adminSource, path.join(stagingRoot, '.admin'), { recursive: true, force: true });

  for (const [id, repository] of Object.entries(dataPaths)) {
    const source = path.join(repository, 'published');
    const target = path.join(stagingRoot, 'data', id, 'published');
    await mkdir(target, { recursive: true });
    if (existsSync(source)) await cp(source, target, { recursive: true, force: true });
  }
}

async function countFiles(root) {
  let files = 0;
  let bytes = 0;
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.isFile()) {
        files += 1;
        bytes += (await stat(full)).size;
      }
    }
  }
  await walk(root);
  return { files, bytes };
}

async function writeAtomicJson(target, value) {
  const temporary = `${target}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await replaceWithRetry(temporary, target);
}

async function readState(runtimeRoot) {
  try {
    return JSON.parse(await readFile(path.join(runtimeRoot, 'state.json'), 'utf8'));
  } catch {
    return {};
  }
}

async function mergeCommunityPublished({ runtimeRoot, stagingRoot, index }) {
  const communityRoot = path.join(runtimeRoot, 'community');
  const manifest = await readStateFile(path.join(communityRoot, 'published.json'), { charts: [] });
  const items = Array.isArray(manifest.charts) ? manifest.charts : [];
  if (!items.length) return;
  const targetRoot = path.join(stagingRoot, 'data', 'community', 'published');
  await mkdir(targetRoot, { recursive: true });
  const directCharts = [];
  for (const item of items) {
    if (!item || typeof item !== 'object' || !item.chart || typeof item.fileName !== 'string') continue;
    const fileName = path.basename(item.fileName);
    if (fileName !== item.fileName || !/\.wwcombo\.json$/i.test(fileName)) continue;
    const source = path.join(communityRoot, 'published', fileName);
    if (!existsSync(source)) continue;
    await cp(source, path.join(targetRoot, fileName), { force: true });
    directCharts.push({ ...item.chart, repository: 'community', url: `/data/community/published/${encodeURIComponent(fileName)}` });
  }
  const directIds = new Set(directCharts.map((chart) => chart.id));
  index.charts = [...directCharts, ...index.charts.filter((chart) => !directIds.has(chart.id))];
  index.updatedAt = Date.now();
}

async function applyCommunityHidden({ runtimeRoot, stagingRoot, index }) {
  const state = await readStateFile(path.join(runtimeRoot, 'community', 'hidden.json'), { ids: [] });
  const ids = new Set((Array.isArray(state.ids) ? state.ids : []).map((id) => String(id || '').trim()).filter(Boolean));
  if (!ids.size) return;
  for (const chart of index.charts) {
    if (!ids.has(chart.id) || !['deta1', 'deta2'].includes(chart.repository)) continue;
    const publishedRoot = path.resolve(stagingRoot, 'data', chart.repository, 'published');
    const target = path.resolve(publishedRoot, ...publishedParts(chart.url));
    if (target !== publishedRoot && target.startsWith(`${publishedRoot}${path.sep}`)) await rm(target, { force: true });
  }
  index.charts = index.charts.filter((chart) => !ids.has(chart.id));
  index.updatedAt = Date.now();
}

async function readStateFile(file, fallback) {
  try {
    return JSON.parse((await readFile(file, 'utf8')).replace(/^\ufeff/, ''));
  } catch {
    return fallback;
  }
}

async function pruneReleases(runtimeRoot, keep = 3) {
  const releasesRoot = path.join(runtimeRoot, 'releases');
  const entries = await readdir(releasesRoot, { withFileTypes: true });
  const releases = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const full = path.join(releasesRoot, entry.name);
    releases.push({ full, modifiedAt: (await stat(full)).mtimeMs });
  }
  releases.sort((left, right) => right.modifiedAt - left.modifiedAt);
  const normalizedKeep = Number.isInteger(keep) ? Math.min(20, Math.max(2, keep)) : 3;
  for (const release of releases.slice(normalizedKeep)) {
    const relative = path.relative(releasesRoot, release.full);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('拒绝删除发布目录之外的文件。');
    await rm(release.full, { recursive: true, force: true });
  }
}

export async function buildRelease({ mainRoot, runtimeRoot, onLog }) {
  const dataPaths = repositoryPaths(runtimeRoot);
  const releasesRoot = path.join(runtimeRoot, 'releases');
  await mkdir(releasesRoot, { recursive: true });

  const commits = {
    repository: await commitOf(mainRoot),
    deta1: await commitOf(dataPaths.deta1),
    deta2: await commitOf(dataPaths.deta2)
  };
  const releaseId = [
    new Date().toISOString().replace(/[-:.]/g, ''),
    commits.repository.slice(0, 8),
    commits.deta1.slice(0, 8),
    commits.deta2.slice(0, 8),
    randomUUID().slice(0, 8)
  ].join('-');
  const stagingRoot = path.join(releasesRoot, `.${releaseId}.${randomUUID()}.tmp`);
  const releaseRoot = path.join(releasesRoot, releaseId);

  try {
    await mkdir(stagingRoot, { recursive: true });
    await copyPublicRelease({ mainRoot, dataPaths, stagingRoot });
    const index = JSON.parse((await readFile(path.join(mainRoot, 'community-index.json'), 'utf8')).replace(/^\ufeff/, ''));
    if (index.type !== 'wwcombo-community-index' || !Array.isArray(index.charts)) throw new Error('社区索引格式不正确。');

    for (const chart of index.charts) {
      const repositoryId = chart.repository;
      if (!dataPaths[repositoryId]) throw new Error(`未知的数据仓库: ${repositoryId}`);
      const parts = publishedParts(chart.url);
      const localFile = path.join(stagingRoot, 'data', repositoryId, 'published', ...parts);
      if (!existsSync(localFile)) throw new Error(`索引对应的连段不存在: ${chart.id}`);
      chart.url = `/data/${repositoryId}/published/${encodedPublishedPath(parts)}`;
    }

    await mergeCommunityPublished({ runtimeRoot, stagingRoot, index });
    await applyCommunityHidden({ runtimeRoot, stagingRoot, index });

    await writeFile(path.join(stagingRoot, 'community-index.json'), `${JSON.stringify(index, null, 2)}\n`, 'utf8');
    const totals = await countFiles(stagingRoot);
    const buildInfo = {
      type: 'wwcombo-server-release',
      version: 1,
      releaseId,
      createdAt: new Date().toISOString(),
      charts: index.charts.length,
      files: totals.files,
      bytes: totals.bytes,
      commits
    };
    await writeFile(path.join(stagingRoot, 'build-info.json'), `${JSON.stringify(buildInfo, null, 2)}\n`, 'utf8');
    await moveWithRetry(stagingRoot, releaseRoot);

    const previousState = await readState(runtimeRoot);
    const state = {
      version: 1,
      currentRelease: releaseId,
      previousRelease: previousState.currentRelease || '',
      activatedAt: Date.now(),
      buildInfo
    };
    await writeAtomicJson(path.join(runtimeRoot, 'state.json'), state);
    await pruneReleases(runtimeRoot, Number(process.env.WWCOMBO_KEEP_RELEASES || 3));
    logLine(onLog, `发布快照已生成: ${releaseId}`);
    return { releaseId, releaseRoot, state };
  } catch (error) {
    await rm(stagingRoot, { recursive: true, force: true });
    throw error;
  }
}

export async function currentRelease({ mainRoot, runtimeRoot, onLog }) {
  await mkdir(runtimeRoot, { recursive: true });
  const state = await readState(runtimeRoot);
  if (state.currentRelease) {
    const releaseRoot = path.join(runtimeRoot, 'releases', state.currentRelease);
    if (existsSync(path.join(releaseRoot, 'community-index.json'))) return { releaseId: state.currentRelease, releaseRoot, state };
  }

  const dataPaths = repositoryPaths(runtimeRoot);
  await ensureDataRepository('deta1', dataPaths.deta1, { update: true, onLog });
  await ensureDataRepository('deta2', dataPaths.deta2, { update: true, onLog });
  return buildRelease({ mainRoot, runtimeRoot, onLog });
}

export async function updateRepositoriesAndBuild({ mainRoot, runtimeRoot, onLog }) {
  const dataPaths = repositoryPaths(runtimeRoot);
  await ensureDataRepository('deta1', dataPaths.deta1, { update: true, onLog });
  await ensureDataRepository('deta2', dataPaths.deta2, { update: true, onLog });
  await updateMainRepository(mainRoot, onLog);
  return buildRelease({ mainRoot, runtimeRoot, onLog });
}

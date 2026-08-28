import { createHash, randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { cp, mkdir, open, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { moveWithRetry, replaceWithRetry } from './fsSafe.mjs';

const SCHEMA_VERSION = 1;
const LANGUAGES = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'];
const IMAGE_TYPES = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp']
]);
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_RELEASE_BYTES = 500 * 1024 * 1024;
const RELEASE_EXTENSIONS = new Set(['.exe', '.msi', '.zip']);

function cleanText(value, maxLength = 120) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function canonicalCharacterName(value) {
  const name = cleanText(value, 80);
  return name === '青霄' || name === '清宵' ? '清霄' : name;
}

function bounded(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function normalizeNames(value, fallbackName = '') {
  const names = Object.fromEntries(LANGUAGES.map((language) => [language, cleanText(value?.[language], 80)]));
  names['zh-CN'] = canonicalCharacterName(names['zh-CN'] || fallbackName);
  if (!names['zh-CN']) throw new Error('请填写角色中文名。');
  return names;
}

function normalizeId(value, chineseName) {
  const supplied = cleanText(value, 100);
  if (supplied && !/[\\/\u0000-\u001f]/.test(supplied)) return supplied;
  return `character_${createHash('sha256').update(chineseName).digest('hex').slice(0, 16)}`;
}

function normalizeBasePreset(value, previous) {
  if (value === null) return null;
  if (!value && !previous) return null;
  const source = value || previous || {};
  const crop = {
    x: bounded(source.crop?.x, 0, 100, 0),
    y: bounded(source.crop?.y, 0, 100, 0),
    w: bounded(source.crop?.w, 0.1, 100, 100),
    h: bounded(source.crop?.h, 0.1, 100, 100)
  };
  crop.w = Math.min(crop.w, 100 - crop.x);
  crop.h = Math.min(crop.h, 100 - crop.y);
  const stretch = {
    left: bounded(source.stretch?.left, 0, 99.9, 25),
    right: bounded(source.stretch?.right, 0.1, 100, 75)
  };
  if (stretch.right <= stretch.left) throw new Error('拉伸右边界必须大于左边界。');
  return {
    src: cleanText(source.src, 500),
    imageWidth: Math.round(bounded(source.imageWidth, 1, 8192, previous?.imageWidth || 426)),
    imageHeight: Math.round(bounded(source.imageHeight, 1, 8192, previous?.imageHeight || 426)),
    crop,
    stretch,
    edge: bounded(source.edge, 0, 100, 0)
  };
}

function normalizeCharacter(value, previous) {
  const names = normalizeNames(value?.names, value?.name || previous?.names?.['zh-CN']);
  const id = normalizeId(value?.id || previous?.id, names['zh-CN']);
  return {
    id,
    names,
    basePreset: normalizeBasePreset(value?.basePreset, previous?.basePreset),
    updatedAt: cleanText(value?.updatedAt || previous?.updatedAt, 60) || new Date().toISOString()
  };
}

function normalizeManifest(value) {
  const source = Array.isArray(value?.characters) ? value.characters : [];
  const characters = [];
  const ids = new Set();
  for (const item of source) {
    try {
      const character = normalizeCharacter(item);
      if (ids.has(character.id)) continue;
      ids.add(character.id);
      characters.push(character);
    } catch {
      // Ignore a malformed seed entry instead of preventing the server from starting.
    }
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    revision: Math.max(1, Math.round(Number(value?.revision) || 1)),
    updatedAt: cleanText(value?.updatedAt, 60) || new Date().toISOString(),
    characters
  };
}

async function writeAtomicJson(target, value) {
  const temporary = `${target}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await replaceWithRetry(temporary, target);
}

function decodeImageDataUrl(value) {
  if (!value) return null;
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([a-z0-9+/=\r\n]+)$/i.exec(String(value));
  if (!match || !IMAGE_TYPES.has(match[1].toLowerCase())) throw new Error('底图只支持 PNG、JPEG 或 WebP。');
  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length || buffer.length > MAX_IMAGE_BYTES) throw new Error('底图大小必须在 3 MB 以内。');
  return { buffer, extension: IMAGE_TYPES.get(match[1].toLowerCase()) };
}

function managedImageName(src) {
  const prefix = '/api/project-assets/v1/images/';
  if (typeof src !== 'string' || !src.startsWith(prefix)) return '';
  const fileName = decodeURIComponent(src.slice(prefix.length));
  return /^[a-f0-9]{20}\.(?:png|jpg|webp)$/.test(fileName) ? fileName : '';
}

function normalizeRelease(value, previous = {}) {
  const version = cleanText(value?.version ?? previous.version, 40) || '0.2.0';
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('客户端版本号必须使用 0.2.1 这样的三段数字。');
  const suppliedDownload = value?.download && typeof value.download === 'object' ? value.download : null;
  const previousDownload = previous.download && typeof previous.download === 'object' ? previous.download : null;
  const previousManagedDownload = previousDownload?.url === '/api/app-release/download';
  const previousLinks = previous.downloadLinks && typeof previous.downloadLinks === 'object' ? previous.downloadLinks : {};
  const suppliedLinks = value?.downloadLinks && typeof value.downloadLinks === 'object' ? value.downloadLinks : {};
  const fallbackQuarkUrl = previousLinks.quark ?? previousLinks.china ?? '';
  const fallbackGithubUrl = previousLinks.github ?? previousLinks.global ?? previous.globalDownloadUrl ?? (!previousManagedDownload ? previousDownload?.url : '');
  const requestedLinks = {
    quark: value?.quarkDownloadUrl !== undefined ? value.quarkDownloadUrl : suppliedLinks.quark !== undefined ? suppliedLinks.quark : value?.chinaDownloadUrl !== undefined ? value.chinaDownloadUrl : fallbackQuarkUrl,
    baidu: value?.baiduDownloadUrl !== undefined ? value.baiduDownloadUrl : suppliedLinks.baidu ?? '',
    cloud123: value?.cloud123DownloadUrl !== undefined ? value.cloud123DownloadUrl : suppliedLinks.cloud123 ?? suppliedLinks.lanzou ?? '',
    github: value?.githubDownloadUrl !== undefined ? value.githubDownloadUrl : suppliedLinks.github !== undefined ? suppliedLinks.github : value?.globalDownloadUrl !== undefined ? value.globalDownloadUrl : value?.downloadUrl !== undefined ? value.downloadUrl : fallbackGithubUrl
  };
  const downloadLinks = Object.fromEntries(Object.entries(requestedLinks).map(([key, url]) => [key, cleanText(url, 1000)]));
  for (const [key, url] of Object.entries(downloadLinks)) {
    if (url && !/^https?:\/\//i.test(url)) throw new Error('Download link ' + key + ' must use http:// or https://.');
  }
  const download = suppliedDownload || (previousManagedDownload ? previousDownload : null);
  return {
    schemaVersion: 1,
    version,
    title: cleanText(value?.title ?? previous.title, 120),
    notes: cleanText(value?.notes ?? previous.notes, 4000),
    publishedAt: cleanText(value?.publishedAt ?? previous.publishedAt, 60) || new Date().toISOString(),
    download,
    downloadLinks: {
      ...downloadLinks,
      china: downloadLinks.quark,
      global: downloadLinks.github
    }
  };
}

function normalizeMobileRelease(value, previous = {}) {
  const version = cleanText(value?.version ?? previous.version, 40) || '0.1.0';
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('手机端版本号必须使用 0.1.0 这样的三段数字。');
  const links = value?.downloadLinks && typeof value.downloadLinks === 'object' ? value.downloadLinks : {};
  const previousLinks = previous.downloadLinks && typeof previous.downloadLinks === 'object' ? previous.downloadLinks : {};
  const android = value?.androidDownloadUrl !== undefined ? value.androidDownloadUrl : links.android !== undefined ? links.android : previousLinks.android || '';
  if (android && !/^https?:\/\//i.test(String(android))) throw new Error('手机端下载链接必须使用 http:// 或 https://。');
  return {
    schemaVersion: 1,
    platform: 'mobile',
    version,
    title: cleanText(value?.title ?? previous.title, 120),
    notes: cleanText(value?.notes ?? previous.notes, 4000),
    publishedAt: cleanText(value?.publishedAt ?? previous.publishedAt, 60) || new Date().toISOString(),
    downloadLinks: { android: cleanText(android, 1000) }
  };
}

function managedReleaseName(download) {
  if (download?.url !== '/api/app-release/download') return '';
  const fileName = cleanText(download?.storedName, 120);
  return /^[a-f0-9]{20}\.(?:exe|msi|zip)$/.test(fileName) ? fileName : '';
}

export function createProjectAssetsService({ runtimeRoot, serverDir }) {
  const root = path.join(runtimeRoot, 'project-assets');
  const imageRoot = path.join(root, 'images');
  const manifestPath = path.join(root, 'manifest.json');
  const releaseRoot = path.join(root, 'release');
  const releasePath = path.join(releaseRoot, 'release.json');
  const mobileReleasePath = path.join(root, 'mobile-release.json');
  const seedRoot = path.join(serverDir, 'project-assets-seed');
  let manifest = normalizeManifest({ characters: [] });
  let seedManifest = normalizeManifest({ characters: [] });
  let release = normalizeRelease({ version: '0.2.0', title: 'WW Combo Trainer 0.2.0', notes: '', downloadUrl: '' });
  let mobileRelease = normalizeMobileRelease({ version: '0.1.0', title: 'WW Combo Trainer Mobile' });
  let writeQueue = Promise.resolve();

  async function persist(next) {
    manifest = next;
    await writeAtomicJson(manifestPath, manifest);
    return manifest;
  }

  async function initialize() {
    await mkdir(imageRoot, { recursive: true });
    await mkdir(releaseRoot, { recursive: true });
    const seedManifestPath = path.join(seedRoot, 'manifest.json');
    seedManifest = existsSync(seedManifestPath)
      ? normalizeManifest(JSON.parse((await readFile(seedManifestPath, 'utf8')).replace(/^\ufeff/, '')))
      : normalizeManifest({ characters: [] });
    const seed = seedManifest;
    if (existsSync(path.join(seedRoot, 'images'))) {
      await cp(path.join(seedRoot, 'images'), imageRoot, { recursive: true, force: false, errorOnExist: false });
    }
    if (existsSync(manifestPath)) {
      const storedManifest = JSON.parse((await readFile(manifestPath, 'utf8')).replace(/^\ufeff/, ''));
      manifest = normalizeManifest(storedManifest);
      const now = new Date().toISOString();
      const seedById = new Map(seed.characters.map((item) => [item.id, item]));
      const storedById = new Map((Array.isArray(storedManifest?.characters) ? storedManifest.characters : []).map((item) => [cleanText(item?.id, 100), item]));
      let namesChanged = manifest.characters.some((item) => cleanText(storedById.get(item.id)?.names?.['zh-CN'], 80) !== item.names['zh-CN']);
      const mergedCharacters = manifest.characters.map((item) => {
        const seeded = seedById.get(item.id);
        if (!seeded) return item;

        const names = { ...item.names };
        let changed = false;
        for (const key of ['en-US', 'ja-JP', 'ko-KR']) {
          if (!names[key] && seeded.names[key]) {
            names[key] = seeded.names[key];
            changed = true;
            namesChanged = true;
          }
        }
        return changed ? { ...item, names, updatedAt: now } : item;
      });
      const known = new Set(mergedCharacters.map((item) => item.id));
      const additions = seed.characters.filter((item) => !known.has(item.id));
      if (namesChanged || additions.length) {
        manifest = await persist({
          ...manifest,
          revision: manifest.revision + 1,
          updatedAt: now,
          characters: [...mergedCharacters, ...additions]
        });
      }
    } else {
      await persist(seed);
    }
    if (existsSync(releasePath)) release = normalizeRelease(JSON.parse((await readFile(releasePath, 'utf8')).replace(/^\ufeff/, '')));
    else await writeAtomicJson(releasePath, release);
    if (existsSync(mobileReleasePath)) mobileRelease = normalizeMobileRelease(JSON.parse((await readFile(mobileReleasePath, 'utf8')).replace(/^\ufeff/, '')));
    else await writeAtomicJson(mobileReleasePath, mobileRelease);
    return manifest;
  }

  function publicManifest() {
    return manifest;
  }

  function adminManifest() {
    return { ...manifest, imageLimitBytes: MAX_IMAGE_BYTES };
  }

  function serialize(task) {
    const operation = writeQueue.then(task, task);
    writeQueue = operation.catch(() => {});
    return operation;
  }

  async function upsert(payload) {
    return serialize(async () => {
      const requestedId = cleanText(payload?.id, 100);
      const originalId = cleanText(payload?.originalId, 100);
      const previous = manifest.characters.find((item) => item.id === originalId)
        || manifest.characters.find((item) => item.id === requestedId)
        || manifest.characters.find((item) => item.names['zh-CN'] === cleanText(payload?.names?.['zh-CN'], 80));
      const character = normalizeCharacter(payload, previous);
      const image = decodeImageDataUrl(payload?.imageDataUrl);
      if (image) {
        const hash = createHash('sha256').update(image.buffer).digest('hex').slice(0, 20);
        const fileName = `${hash}.${image.extension}`;
        await writeFile(path.join(imageRoot, fileName), image.buffer, { flag: 'wx' }).catch(async (error) => {
          if (error.code !== 'EEXIST') throw error;
          const details = await stat(path.join(imageRoot, fileName));
          if (details.size !== image.buffer.length) throw new Error('底图缓存文件校验失败。');
        });
        character.basePreset ||= normalizeBasePreset({}, previous?.basePreset);
        character.basePreset.src = `/api/project-assets/v1/images/${encodeURIComponent(fileName)}`;
      }
      if (character.basePreset && !character.basePreset.src) throw new Error('请上传底图，或关闭该角色的底图设置。');
      character.updatedAt = new Date().toISOString();
      const characters = manifest.characters.filter((item) => item.id !== previous?.id && item.id !== character.id);
      characters.push(character);
      characters.sort((left, right) => left.names['zh-CN'].localeCompare(right.names['zh-CN'], 'zh-CN'));
      const oldImage = managedImageName(previous?.basePreset?.src);
      const nextImage = managedImageName(character.basePreset?.src);
      const next = await persist({ ...manifest, revision: manifest.revision + 1, updatedAt: character.updatedAt, characters });
      if (oldImage && oldImage !== nextImage) await rm(path.join(imageRoot, oldImage), { force: true }).catch(() => {});
      return { manifest: next, character };
    });
  }

  async function remove(id) {
    return serialize(async () => {
      const previous = manifest.characters.find((item) => item.id === id);
      if (!previous) throw new Error('没有找到这个角色。');
      const now = new Date().toISOString();
      const next = await persist({ ...manifest, revision: manifest.revision + 1, updatedAt: now, characters: manifest.characters.filter((item) => item.id !== id) });
      const oldImage = managedImageName(previous.basePreset?.src);
      if (oldImage) await rm(path.join(imageRoot, oldImage), { force: true }).catch(() => {});
      return next;
    });
  }

  async function syncSeedNames() {
    return serialize(async () => {
      const now = new Date().toISOString();
      const seedById = new Map(seedManifest.characters.map((item) => [item.id, item]));
      let updatedCharacters = 0;
      let filledNames = 0;
      const characters = manifest.characters.map((item) => {
        const seeded = seedById.get(item.id);
        if (!seeded) return item;
        const names = { ...item.names };
        let changed = false;
        for (const key of ['en-US', 'ja-JP', 'ko-KR']) {
          if (!names[key] && seeded.names[key]) {
            names[key] = seeded.names[key];
            filledNames += 1;
            changed = true;
          }
        }
        if (!changed) return item;
        updatedCharacters += 1;
        return { ...item, names, updatedAt: now };
      });
      const known = new Set(characters.map((item) => item.id));
      const additions = seedManifest.characters.filter((item) => !known.has(item.id));
      if (!updatedCharacters && !additions.length) {
        return { manifest, updatedCharacters: 0, filledNames: 0, addedCharacters: 0 };
      }
      const next = await persist({
        ...manifest,
        revision: manifest.revision + 1,
        updatedAt: now,
        characters: [...characters, ...additions]
      });
      return { manifest: next, updatedCharacters, filledNames, addedCharacters: additions.length };
    });
  }

  function publicRelease() {
    const { storedName: _storedName, ...download } = release.download || {};
    return { ...release, download: release.download ? download : null };
  }

  function adminRelease() {
    return { ...release, maxPackageBytes: MAX_RELEASE_BYTES };
  }

  function publicMobileRelease() {
    return mobileRelease;
  }

  function adminMobileRelease() {
    return mobileRelease;
  }

  async function saveMobileRelease(payload) {
    return serialize(async () => {
      mobileRelease = normalizeMobileRelease(payload, mobileRelease);
      mobileRelease.publishedAt = new Date().toISOString();
      await writeAtomicJson(mobileReleasePath, mobileRelease);
      return mobileRelease;
    });
  }

  async function saveRelease(payload) {
    return serialize(async () => {
      const previousName = managedReleaseName(release.download);
      release = normalizeRelease(payload, release);
      release.publishedAt = new Date().toISOString();
      await writeAtomicJson(releasePath, release);
      if (previousName && !managedReleaseName(release.download)) await rm(path.join(releaseRoot, previousName), { force: true }).catch(() => {});
      return release;
    });
  }

  async function uploadReleasePackage(stream, fileName, contentLength) {
    return serialize(async () => {
      const safeFileName = path.basename(cleanText(fileName, 160));
      const extension = path.extname(safeFileName).toLowerCase();
      if (!safeFileName || !RELEASE_EXTENSIONS.has(extension)) throw new Error('安装包只支持 EXE、MSI 或 ZIP。');
      if (Number(contentLength) > MAX_RELEASE_BYTES) throw new Error('安装包不能超过 500 MB。');
      const temporary = path.join(releaseRoot, `.upload-${process.pid}-${randomUUID()}.tmp`);
      const handle = await open(temporary, 'wx');
      const hash = createHash('sha256');
      let bytes = 0;
      try {
        for await (const chunk of stream) {
          bytes += chunk.length;
          if (bytes > MAX_RELEASE_BYTES) throw new Error('安装包不能超过 500 MB。');
          hash.update(chunk);
          await handle.write(chunk);
        }
      } catch (error) {
        await handle.close().catch(() => {});
        await rm(temporary, { force: true }).catch(() => {});
        throw error;
      }
      await handle.close();
      if (!bytes) {
        await rm(temporary, { force: true });
        throw new Error('安装包文件为空。');
      }
      const sha256 = hash.digest('hex');
      const storedName = `${sha256.slice(0, 20)}${extension}`;
      const target = path.join(releaseRoot, storedName);
      if (existsSync(target)) await rm(temporary, { force: true });
      else await moveWithRetry(temporary, target);
      const previousName = managedReleaseName(release.download);
      release = {
        ...release,
        publishedAt: new Date().toISOString(),
        download: { url: '/api/app-release/download', fileName: safeFileName, storedName, bytes, sha256 }
      };
      await writeAtomicJson(releasePath, release);
      if (previousName && previousName !== storedName) await rm(path.join(releaseRoot, previousName), { force: true }).catch(() => {});
      return release;
    });
  }

  return { initialize, publicManifest, adminManifest, upsert, remove, syncSeedNames, imageRoot, publicRelease, adminRelease, saveRelease, uploadReleasePackage, releaseRoot, publicMobileRelease, adminMobileRelease, saveMobileRelease };
}

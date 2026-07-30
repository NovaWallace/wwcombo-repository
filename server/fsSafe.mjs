import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { constants } from 'node:fs';
import { copyFile, cp, rename, rm, stat } from 'node:fs/promises';

const RETRYABLE_CODES = new Set(['EACCES', 'EBUSY', 'ENOTEMPTY', 'EPERM']);

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function renameWithRetry(source, target) {
  let lastError = null;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      await rename(source, target);
      return;
    } catch (error) {
      lastError = error;
      if (!RETRYABLE_CODES.has(error?.code) || attempt === 19) throw error;
      await wait(50 * (attempt + 1));
    }
  }
  throw lastError;
}

export async function moveWithRetry(source, target) {
  try {
    await renameWithRetry(source, target);
    return;
  } catch (error) {
    if (process.platform !== 'win32' || !RETRYABLE_CODES.has(error?.code)) throw error;
  }

  const sourceStat = await stat(source);
  try {
    if (sourceStat.isDirectory()) await cp(source, target, { recursive: true, force: false, errorOnExist: true });
    else await copyFile(source, target, constants.COPYFILE_EXCL);
    await rm(source, { recursive: sourceStat.isDirectory(), force: true });
  } catch (error) {
    await rm(target, { recursive: sourceStat.isDirectory(), force: true }).catch(() => {});
    throw error;
  }
}

export async function replaceWithRetry(source, target) {
  if (process.platform !== 'win32' || !existsSync(target)) {
    await renameWithRetry(source, target);
    return;
  }

  const backup = `${target}.${process.pid}.${randomUUID()}.bak`;
  await moveWithRetry(target, backup);
  try {
    await moveWithRetry(source, target);
    await rm(backup, { recursive: true, force: true });
  } catch (error) {
    if (existsSync(target)) await rm(target, { recursive: true, force: true }).catch(() => {});
    await moveWithRetry(backup, target).catch(() => {});
    throw error;
  }
}

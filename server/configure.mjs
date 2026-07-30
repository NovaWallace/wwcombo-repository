import { randomBytes, scryptSync } from 'node:crypto';
import { existsSync } from 'node:fs';
import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { replaceWithRetry } from './fsSafe.mjs';

function parseArgs(argv) {
  const result = { runtime: '' };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === '--runtime') result.runtime = argv[++index] || '';
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));
if (!args.runtime) throw new Error('configure.mjs requires --runtime PATH');
const runtimeRoot = path.resolve(args.runtime);
const configPath = path.join(runtimeRoot, 'config.json');
const suppliedPassword = String(process.env.WWCOMBO_ADMIN_PASSWORD || '');

await mkdir(runtimeRoot, { recursive: true });
let existing = null;
if (existsSync(configPath)) {
  existing = JSON.parse(await readFile(configPath, 'utf8'));
  if (!suppliedPassword) {
    console.log('管理员密码配置已存在。');
    process.exit(0);
  }
}

if (!suppliedPassword) throw new Error('首次配置必须由维护者明确设置管理员密码，使用 WWCOMBO_ADMIN_PASSWORD 传入。');
if (suppliedPassword.length < 10) throw new Error('管理员密码至少需要 10 个字符。');
const salt = randomBytes(16).toString('hex');
const config = {
  version: 1,
  createdAt: existing?.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  admin: {
    salt,
    hash: scryptSync(suppliedPassword, salt, 64).toString('hex')
  },
  sessionSecret: existing?.sessionSecret || randomBytes(32).toString('hex')
};
const temporary = `${configPath}.${process.pid}.tmp`;
await writeFile(temporary, `${JSON.stringify(config, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
await replaceWithRetry(temporary, configPath);
await chmod(configPath, 0o600);

console.log(existing ? '管理员密码已重置。' : '管理员密码已设置。');

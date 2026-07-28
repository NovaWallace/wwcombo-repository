import { randomBytes, scryptSync } from 'node:crypto';
import { existsSync } from 'node:fs';
import { chmod, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

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

const generatedPassword = suppliedPassword || randomBytes(12).toString('base64url');
if (generatedPassword.length < 10) throw new Error('管理员密码至少需要 10 个字符。');
const salt = randomBytes(16).toString('hex');
const config = {
  version: 1,
  createdAt: existing?.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  admin: {
    salt,
    hash: scryptSync(generatedPassword, salt, 64).toString('hex')
  },
  sessionSecret: existing?.sessionSecret || randomBytes(32).toString('hex')
};
const temporary = `${configPath}.${process.pid}.tmp`;
await writeFile(temporary, `${JSON.stringify(config, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
await rename(temporary, configPath);
await chmod(configPath, 0o600);

if (suppliedPassword) console.log(existing ? '管理员密码已重置。' : '管理员密码已设置。');
else console.log(`首次管理员密码：${generatedPassword}`);

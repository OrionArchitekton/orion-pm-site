import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const source = readFileSync(new URL('../constants.ts', import.meta.url), 'utf8');
const data = JSON.parse(source.match(/export const PRODUCT_DATA: ProductData = ([\s\S]+);/)[1]);

test('the recorded release manifest passes the exact digest gate', () => {
  const folder = mkdtempSync(join(tmpdir(), 'pm-manifest-pin-'));
  try {
    writeFileSync(join(folder, 'SHA256SUMS'), readFileSync(new URL('./fixtures/orion-pm-0.1.1-SHA256SUMS', import.meta.url)));
    const command = data.quickstart.blocks[0].command.split('&&\n')[0];
    const result = spawnSync('bash', ['--noprofile', '--norc', '-c', command], { cwd: folder, encoding: 'utf8', timeout: 10000 });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /SHA256SUMS: OK/);
  } finally { rmSync(folder, { recursive: true, force: true }); }
});

test('the same checksum selection accepts a matching wheel entry', () => {
  const folder = mkdtempSync(join(tmpdir(), 'pm-listed-wheel-'));
  try {
    const name = 'orion_pm-0.1.1-py3-none-any.whl';
    const bytes = 'synthetic checksum fixture';
    writeFileSync(join(folder, name), bytes);
    writeFileSync(join(folder, 'SHA256SUMS'), `${createHash('sha256').update(bytes).digest('hex')}  ${name}\n`);
    // The manifest pin has its own fixture; this checks exact-file selection.
    const check = data.quickstart.blocks[0].command.split('&&\n').slice(1).join('&&\n').split('&&\npython3 -m venv')[0];
    const result = spawnSync('bash', ['--noprofile', '--norc', '-c', check], { cwd: folder, encoding: 'utf8', timeout: 10000 });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /orion_pm-0\.1\.1-py3-none-any\.whl: OK/);
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test('the independent origin serves Works-prefixed entry and asset requests', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.ok(config.rewrites?.some(r => r.source === '/works/orion-pm/' && r.destination === '/'));
  assert.ok(config.rewrites?.some(r => r.source === '/works/orion-pm/:path*' && r.destination === '/:path*'));
});

test('the independent origin redirects the bare Works path to its canonical trailing slash', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.ok(config.redirects?.some(r => r.source === '/works/orion-pm' && r.destination === '/works/orion-pm/' && r.permanent === true));
});

test('install refuses a manifest that authenticates only a different file', () => {
  const folder = mkdtempSync(join(tmpdir(), 'pm-unlisted-wheel-'));
  try {
    writeFileSync(join(folder, 'orion_pm-0.1.1-py3-none-any.whl'), 'unverified bytes');
    writeFileSync(join(folder, 'other.txt'), 'another asset');
    const sha = createHash('sha256').update('another asset').digest('hex');
    writeFileSync(join(folder, 'SHA256SUMS'), `${sha}  other.txt\n`);
    const result = spawnSync('bash', ['--noprofile', '--norc', '-c', data.quickstart.blocks[0].command], { cwd: folder, encoding: 'utf8', timeout: 10000 });
    assert.equal(result.error, undefined);
    assert.notEqual(result.status, null);
    assert.notEqual(result.status, 0);
    assert.equal(existsSync(join(folder, '.venv')), false, 'unlisted wheel reached environment creation');
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test('a listed wheel with changed bytes refuses before environment creation', () => {
  const folder = mkdtempSync(join(tmpdir(), 'pm-changed-wheel-'));
  try {
    writeFileSync(join(folder, 'SHA256SUMS'), readFileSync(new URL('./fixtures/orion-pm-0.1.1-SHA256SUMS', import.meta.url)));
    writeFileSync(join(folder, 'orion_pm-0.1.1-py3-none-any.whl'), 'changed wheel');
    const result = spawnSync('bash', ['--noprofile', '--norc', '-c', data.quickstart.blocks[0].command], { cwd: folder, encoding: 'utf8', timeout: 10000 });
    assert.equal(result.error, undefined);
    assert.notEqual(result.status, null);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /orion_pm-0\.1\.1-py3-none-any\.whl: FAILED/);
    assert.equal(existsSync(join(folder, '.venv')), false);
  } finally { rmSync(folder, { recursive: true, force: true }); }
});

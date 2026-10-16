import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const source = readFileSync(new URL('../constants.ts', import.meta.url), 'utf8');
const data = JSON.parse(source.match(/export const PRODUCT_DATA: ProductData = ([\s\S]+);/)[1]);

test('the independent origin serves Works-prefixed entry and asset requests', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.ok(config.rewrites?.some(r => r.source === '/works/orion-pm/' && r.destination === '/'));
  assert.ok(config.rewrites?.some(r => r.source === '/works/orion-pm/:path*' && r.destination === '/:path*'));
});

test('install refuses a manifest that authenticates only a different file', () => {
  const folder = mkdtempSync(join(tmpdir(), 'pm-unlisted-wheel-'));
  try {
    writeFileSync(join(folder, 'orion_pm-0.1.1-py3-none-any.whl'), 'unverified bytes');
    writeFileSync(join(folder, 'other.txt'), 'another asset');
    const sha = createHash('sha256').update('another asset').digest('hex');
    writeFileSync(join(folder, 'SHA256SUMS'), `${sha}  other.txt\n`);
    const result = spawnSync('bash', ['--noprofile', '--norc', '-c', data.quickstart.blocks[0].command], { cwd: folder, encoding: 'utf8', timeout: 10000 });
    assert.notEqual(result.status, 0);
    assert.equal(existsSync(join(folder, '.venv')), false, 'unlisted wheel reached environment creation');
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

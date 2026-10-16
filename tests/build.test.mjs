import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

test('a reader without JavaScript can obtain the exact release and see install checks', () => {
  const visibleMarkup = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[\s\S]*?<\/script>/g, '');
  assert.match(visibleMarkup, /<a\b[^>]*href="https:\/\/github\.com\/OrionArchitekton\/orion-pm-oss\/releases\/tag\/v0\.1\.1"[^>]*>Download v0\.1\.1 release<\/a>/);
  assert.match(visibleMarkup, /<p>Stop if checksum verification fails<\/p>/);
});

test('built PM positioning, local setup and guide are visible without JavaScript', () => {
  assert.match(html, /rel="canonical" href="https:\/\/www\.danmercede\.com\/works\/orion-pm\/"/);
  assert.match(html, /<h1[^>]*>orion-pm<\/h1>/);
  assert.match(html, /guides\/coordinate-local-agents-with-orion-pm/);
  assert.match(html, /--generation/);
  assert.match(html, /--expect-revision/);
  assert.match(html, /orion_pm-0\.1\.1-py3-none-any\.whl/);
  assert.match(html, /not.*permission|does not.*permission/i);
  assert.doesNotMatch(html, /mcp-context-budget|pypi\.org|pip install orion-pm|v0\.4\.0|0\.1\.1\.dev0/);
});

test('all scripts, styles and metadata resolve through the Works prefix', () => {
  const assets = [...html.matchAll(/(?:src|href)="(\/works\/orion-pm\/assets\/[^"?#]+)"/g)].map(m => m[1]);
  assert.ok(assets.some(a => a.endsWith('.js')));
  assert.ok(assets.some(a => a.endsWith('.css')));
  for (const asset of assets) assert.ok(existsSync(new URL('../dist/'+asset.replace('/works/orion-pm/',''), import.meta.url)), asset);
  assert.match(html, /https:\/\/www\.danmercede\.com\/works\/orion-pm\/og-card.png/);
  const manifest = JSON.parse(readFileSync(new URL('../dist/site.webmanifest', import.meta.url), 'utf8'));
  assert.equal(manifest.start_url, '/works/orion-pm/');
  for (const icon of manifest.icons) assert.ok(icon.src.startsWith('/works/orion-pm/'));
});

test('internal section links remain native document anchors after React mounts', () => {
  assert.match(html, /href="#quickstart"/);
  assert.match(html, /id="quickstart"/);
  assert.doesNotMatch(readFileSync(new URL('../App.tsx', import.meta.url),'utf8'), /react-router|window\.location\.pathname/);
});

test('independent origin configuration retains stripped asset caching and no template host redirect', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url),'utf8'));
  assert.doesNotMatch(JSON.stringify(config), /mcp-context-budget|danmercede\.com/);
  assert.ok(config.headers.some(h => h.source === '/assets/(.*)'));
  assert.ok(existsSync(new URL('../LICENSE', import.meta.url)));
});

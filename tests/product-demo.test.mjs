import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const slug = 'orion-pm';
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
test('product demo is accessible in the built document and uses this product media', () => {
  const videos = [...html.matchAll(/<video\b[^>]*>[\s\S]*?<\/video>/g)];
  assert.equal(videos.length, 1, 'one native product demo must exist without JavaScript');
  const player = videos[0][0];
  assert.match(player, /\bcontrols(?:[ =/>])/);
  assert.match(player, /preload="none"/);
  assert.doesNotMatch(player, /\bautoplay\b/i);
  assert.ok(player.includes(`/works/${slug}/media/${slug}-demo.mp4`));
  assert.ok(player.includes(`/works/${slug}/media/${slug}-demo.vtt`));
  assert.match(player, /kind="captions"/);
  assert.match(player, /src[Ll]ang="en"/);
  assert.ok(player.includes(`/works/${slug}/media/${slug}-demo.jpg`));
  assert.match(html.replace(player, ''), /<a\b[^>]*\bdownload(?:[ =/>])[^>]*>Download the demo video<\/a>/);
  assert.match(html, /<summary[^>]*>Read the transcript<\/summary>/);
  assert.match(html, /id="product-demo-disclosure"/);
  const manifest = JSON.parse(readFileSync(new URL('../demos/product/media-manifest.json', import.meta.url), 'utf8'));
  assert.equal(manifest.slug, slug);
  for (const ext of ['mp4','jpg','vtt']) {
    const name = `${slug}-demo.${ext}`;
    const bytes = readFileSync(new URL(`../dist/media/${name}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.files[name]);
    if (ext === 'vtt') {
      assert.ok(bytes.toString().startsWith('WEBVTT'));
      assert.match(bytes.toString(), /\d\d:\d\d:\d\d\.\d{3} --> /);
    }
  }
});

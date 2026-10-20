import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import type { Plugin } from 'vite';
import App from './App';

// Render the exact tree the client hydrates so a playing native video survives startup.
// This runs during the static build only; there is no server runtime.
export function renderBakedBody(): string {
  return renderToString(createElement(App));
}

export function bodyBake(): Plugin {
  return {
    name: 'orion-pm-body-bake',
    // Apply only to the production build; the dev server keeps the empty root.
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html: string) {
        const baked = renderBakedBody();
        // Fail loud if the rendered body is empty/headingless — prefer a hard
        // build failure over silently shipping a blank crawler body.
        if (!/<h1[ >]/.test(baked) || !/<p[ >]/.test(baked)) {
          throw new Error(
            'body-bake: rendered body is missing an <h1> or <p> — refusing to emit empty crawler content',
          );
        }
        // Use a replacer function so any `$` in `baked` (dynamic data) is treated
        // literally, not as a `$&`/`$1`/etc. replacement pattern.
        const replaced = html.replace(
          /<div id="root">\s*<\/div>/,
          () => `<div id="root">${baked}</div>`,
        );
        if (replaced === html) {
          // Fail loud at build time if the root anchor ever changes shape.
          throw new Error(
            'body-bake: could not find `<div id="root"></div>` to inject crawlable body content',
          );
        }
        return replaced;
      },
    },
  };
}

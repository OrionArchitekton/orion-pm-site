# Orion PM Works microsite

Project positioning page for [Orion PM core](https://github.com/OrionArchitekton/orion-pm-oss), served at https://www.danmercede.com/works/orion-pm/ through the brand hub's prefix-stripped Vercel proxy.

Run `npm ci`, `npx tsc --noEmit`, `npm run build`, then `npm test`. Tests inspect built HTML. Verify desktop/mobile and mounted section navigation before deploying. The product core, guide and hub wiring have separate sources.

MIT-licensed; adapted from the Dan Mercede mcp-context-budget site template. Dependency notices and Dan Mercede brand asset attribution are retained separately. The production origin is https://orion-pm-site.vercel.app/. Never reuse another project's `.vercel/` linkage.

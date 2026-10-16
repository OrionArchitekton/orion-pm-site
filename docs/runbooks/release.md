---
verified: 2026-10-15
review_after: 2026-11-15
topics: [orion-pm, product-page, private-release-preparation]
references: [vite.config.ts, vercel.json, constants.ts, index.html, specs/orion-pm-product-page-spec.md]
---

# Release the product page

Run npm ci, npm run build, npm test and inspect mounted desktop/mobile behavior.
Verify the guide, section anchors, canonical URL, social image and stripped asset
paths in a local proxy preview. Keep unpublished source and operational receipts private for review.
This template-derived branch must never be pushed to the template's remote.

After approval, export fresh source with no .vercel linkage or template Git
history. Confirm the chosen site source home/admission and new remote/project
before any public action. The independent origin is https://orion-pm-site.vercel.app/. Record the actual
project identity and READY production deployment before claiming it live.

Replace planned-source labels only once the exact core source/release exists.
Deploy the approved independent site first and verify HTML/assets without an
authentication wall. Then apply the reviewed hub card, no-slash redirect, explicit
bare Works rewrite and prefix-stripped asset rewrite. Do not add a physical hub
route at the proxy path. Publish the guide only with its reviewed canonical.

Monitor the canonical page title, asset content type, guide destination and native
anchor behavior after deployment. A homepage or login wall returning HTTP 200 is
not success. To roll back, restore the previous independent site deployment and
revert the hub card/routing/guide change through normal review. Keep source and
artifact digests for any withdrawn release. Private preparation needs only local
server shutdown; it changes no deployed service or account.

## Build-tool dependency maintenance

The private review migrated the build to Tailwind 4.3.3 and its official Vite
adapter because the Tailwind 3 dependency chain contains unpatched braces
GHSA-vfj7-8cjw-p6xm. There are no advisory suppressions or package overrides.
Authored UI sources are enumerated explicitly; private fixtures are not scanned.
Brand tokens remain in the explicitly loaded configuration. Renamed utilities
and base border/button/placeholder rules preserve the prior presentation.

Run `npm ci`, `npm audit`, `npm audit --omit=dev`, build, tests and typecheck.
Inspect desktop/mobile pages after every toolchain update. Tailwind 4 requires
modern browsers: Safari 16.4+, Chrome 111+, Firefox 128+; this package's observed
UI receipt covers the named Chrome version only. Other browsers remain untested.
An audit result is point-in-time dependency evidence, not a security guarantee.
The old private package is retained for comparison and reversal. The original
PM repository and estate runtime stay private and unchanged.

Upstream references: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm and
https://tailwindcss.com/docs/upgrade-guide.

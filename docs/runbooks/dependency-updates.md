---
verified: 2026-10-19
review_after: 2027-01-19
topics: [dependencies, dependabot, site-release]
references: [.github/dependabot.yml, package.json, package-lock.json, .github/workflows/ci.yml, docs/runbooks/product-demo.md]
---

# Site dependency updates

Dependabot checks npm and Actions weekly. React/runtime types, Vite/plugin and Tailwind packages travel in their respective families, including major updates. Other minor/patch updates share a routine PR; other major updates stay separate. Security fixes use a separate group and retain GitHub's security-update handling. Groups reduce duplicate PRs; they grant no merge authority and do not change branch protection.

Review release notes and install/build compatibility before merging. Keep React and React DOM versions aligned. TypeScript 7 requires the real React type packages and Vite client declarations for CSS imports; do not hide new type errors by disabling the compiler's strict checks. Vite 8 and React plugin 6 must be updated together.

Run npm ci, the repository's npm test/build checks, npx tsc --noEmit, npm audit and git diff --check. Verify desktop/mobile rendering and JavaScript-free product-demo playback, seeking, captions, download and delayed startup. Keep the accepted media bytes unchanged. Check the exact current PR head's CI/review results; repair failures and merge conflicts before any authorized merge. An admin merge may satisfy an authorized review override; it is not evidence that checks pass.

After merge, verify the default branch and actual Works route against the selected build. Preserve this site's own Vercel project and hub rewrite. A project without Git deployment linkage needs explicit deployment authority. Recheck playback after any release; operator playback is not audience analytics.

Rollback with a protected revert of the dependency batch and, if separately authorized, restore the preceding deployment in the same project. Do not revert or replace demo media, source-tool releases, guides, or another project's configuration. Record failed attempts and the accepted commit in the release receipt.

References: https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#groups ; https://vite.dev/guide/migration ; https://tailwindcss.com/docs/upgrade-guide .

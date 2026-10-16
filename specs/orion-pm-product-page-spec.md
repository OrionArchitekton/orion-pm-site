# Orion PM product page

The reader can understand local task claims, start with the reviewed artifact,
and continue into the full guide. Dan approved publication on 2026-10-15.

1. Initial HTML and mounted content identify Orion PM and MIT, explain one local
   claim with generation/revision guards, and distinguish claims from permissions.
2. Start locally is a native document anchor that reaches the quickstart after
   React mounts. Commands target a new store and the supplied v0.1.0 wheel; no
   unverified package-index installation is offered.
3. The guide link names the complete canonical tutorial. Source links resolve to the public core and release; labels reflect the observed
   publication state.
4. Scripts, styles, icons, canonical and social assets resolve under the product's
   Works prefix. The independent origin receives prefix-stripped asset paths.
5. The site preserves the established brand and remains usable on desktop/mobile,
   with semantic landmarks, focus styles and reduced-motion support.

Test seams: built HTML/assets via the existing node test runner; one local browser
pass through the assembled hub/Works proxy, including mounted anchor clicks and
mobile overflow. Production acceptance additionally checks the public origin and Works proxy.

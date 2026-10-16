import type { ProductData } from './types';

export const PRODUCT_DATA: ProductData = {
  "name": "orion-pm",
  "tagline": "Give cooperating agents a shared view of work.",
  "credibility": "MIT licensed · Local Python CLI · Exclusive task claims · No third-party runtime packages",
  "canonical": "https://www.danmercede.com/works/orion-pm/",
  "metaDescription": "Local task coordination for cooperating agents: exclusive claims, generation guards, durable task revisions and scoped evidence. Compose with your existing tools.",
  "problem": {
    "heading": "Two chats can start the same task.",
    "body": "Separate agents can pick the same task and both begin editing. A status label records progress, but it does not establish which worker currently owns the task."
  },
  "whatItDoes": {
    "heading": "Claim before you work.",
    "body": "Probe for overlapping work, then claim a task before editing. Keep the returned claim generation and task revision. Use those handles to attach evidence, complete the task, or return unfinished work. Browsers and other tools keep their own resource leases and action permissions."
  },
  "cta": {
    "primaryLabel": "Start locally",
    "primaryUrl": "#quickstart",
    "secondaryLabel": "Read the complete guide",
    "secondaryUrl": "https://www.danmercede.com/guides/coordinate-local-agents-with-orion-pm"
  },
  "quickstart": {
    "heading": "One store. Two workers. Clear ownership.",
    "intro": "Put the reviewed v0.1.1 wheel and its matching SHA256SUMS in an empty folder. Run these blocks in one shell. Verified on CPython 3.11.14, WSL2 Linux and ext4; no package-index download is required.",
    "blocks": [
      {
        "title": "Install the reviewed wheel",
        "note": "Stop if checksum verification fails",
        "command": "awk '$2 == \"orion_pm-0.1.1-py3-none-any.whl\" {print; found=1} END {exit !found}' SHA256SUMS > wheel.sha256 &&\nsha256sum --strict --check wheel.sha256 &&\nawk '{print \"./\" $2 \" --hash=sha256:\" $1}' wheel.sha256 > wheel.requirements &&\npython3 -m venv .venv &&\n.venv/bin/python -m pip install --no-index --no-deps --require-hashes -r wheel.requirements"
      },
      {
        "title": "Create a new local store",
        "command": "umask 077\nexport PM_DEMO_HOME=\"$(mktemp -d)/pm-store\"\nprintf '%s\\n' '{\"schema_version\":1,\"projects\":[{\"id\":\"sample\"}]}' > projects.json\n.venv/bin/orion-pm --json --home \"$PM_DEMO_HOME\" init --projects projects.json\n.venv/bin/orion-pm --json --home \"$PM_DEMO_HOME\" add --id example --title \"Example work\" --project sample --status todo"
      },
      {
        "title": "Claim a task, then return it to todo",
        "note": "The full guide adds a second worker and completes a task",
        "command": ".venv/bin/orion-pm --json --home \"$PM_DEMO_HOME\" probe example\n.venv/bin/orion-pm --json --home \"$PM_DEMO_HOME\" claim example --holder session-a > claim.json\nGENERATION=$(.venv/bin/python -c 'import json; print(json.load(open(\"claim.json\"))[\"data\"][\"claim\"][\"generation\"])')\nREVISION=$(.venv/bin/python -c 'import json; print(json.load(open(\"claim.json\"))[\"data\"][\"task\"][\"revision\"])')\n.venv/bin/orion-pm --json --home \"$PM_DEMO_HOME\" release example --holder session-a --generation \"$GENERATION\" --expect-revision \"$REVISION\""
      }
    ]
  },
  "commands": [
    {
      "name": "probe · show · surface",
      "description": "Inspect overlapping work, validated ownership and the shared task view. Unknown state remains unknown."
    },
    {
      "name": "claim · renew · release",
      "description": "Acquire a task, retain its generation, renew while working, and return unfinished work to todo."
    },
    {
      "name": "evidence · transition",
      "description": "Attach a scoped result and complete against --generation and the current --expect-revision."
    },
    {
      "name": "overdue · triage · audit",
      "description": "Read recovery information. Triage is report-only; takeover and recovery are explicit guarded operations."
    }
  ],
  "demo": {
    "heading": "Two workers ask. One claim wins.",
    "intro": "Illustrative flow. Use the actual generation and revision returned by your CLI calls.",
    "lines": [
      {
        "kind": "command",
        "text": "orion-pm --json --home \"$STORE\" claim example --holder agent-a"
      },
      {
        "kind": "output",
        "text": "agent-a: live claim; retain generation and task revision",
        "tone": "ok"
      },
      {
        "kind": "command",
        "text": "orion-pm --json --home \"$STORE\" claim example --holder agent-b"
      },
      {
        "kind": "output",
        "text": "ownership refusal (exit 3): agent-b does no work or resource call",
        "tone": "fail"
      },
      {
        "kind": "comment",
        "text": "Only the winner works, attaches evidence and completes."
      },
      {
        "kind": "comment",
        "text": "After completion: task = done; claim = absent."
      }
    ]
  },
  "differentiators": {
    "heading": "Small core. Useful boundaries.",
    "points": [
      {
        "title": "A generation, not just a name",
        "body": "Reacquiring a task creates a new generation. A delayed worker cannot renew, release or complete a replacement claim using its old handle."
      },
      {
        "title": "Evidence with a precise scope",
        "body": "Bind a result to an artifact, observation time and reference. A task marked done is not proof of publication or deployment."
      },
      {
        "title": "Tools keep their leases",
        "body": "A PM task claim does not grant action permission or release a browser or phone. Each tool keeps its own native lease, cleanup and authorization checks."
      },
      {
        "title": "Coordination on one trusted host",
        "body": "Normal operations stay local and offline. The core has no scheduler or legacy-store migration and does not fence workers on another host or isolate hostile same-user processes."
      }
    ]
  },
  "links": [
    {
      "label": "View source on GitHub",
      "url": "https://github.com/OrionArchitekton/orion-pm-oss",
      "primary": true
    },
    {
      "label": "Download v0.1.1 release",
      "url": "https://github.com/OrionArchitekton/orion-pm-oss/releases/tag/v0.1.1",
      "primary": true
    },
    {
      "label": "Complete guide",
      "url": "https://www.danmercede.com/guides/coordinate-local-agents-with-orion-pm",
      "primary": true
    },
    {
      "label": "Browser composition",
      "url": "https://github.com/OrionArchitekton/orion-pm-oss/blob/main/docs/browser-composition.md"
    },
    {
      "label": "Dan Mercede",
      "url": "https://www.danmercede.com"
    }
  ],
  "footerNote": "MIT core by Dan Mercede. v0.1.1 source and release assets on GitHub."
};

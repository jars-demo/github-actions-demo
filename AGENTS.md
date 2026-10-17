# AGENTS.md

Guidance for AI coding agents and developers. Humans: start with [README.md](README.md).

## What this is

A hands-on workshop, "GitHub Actions: CI/CD from zero". The **workflows in `.github/` and the
chapters in `workshop/` are the product**. `backend/` is a deliberately tiny app for them to
automate, and `frontend/` is the site that presents the chapters.

## Map

```text
backend/src/app.ts             route(method, url, info): the whole API as a pure function
backend/src/server.ts          node:http server around route()
backend/src/status-page.ts     builds status-page/index.html for the Pages deploy
backend/test/                  node:test tests (run after tsc builds them)
backend/openapi.yaml           the API contract; keep it in sync with app.ts
backend/Dockerfile             two-stage, non-root image with a health check
.github/workflows/             ci, nightly, reusable-test, release, container, pages, frontend
.github/actions/setup-backend/ composite action: setup-node with cache, then npm ci
.github/dependabot.yml         actions and npm, weekly, 14-day cooldown
workshop/NN-slug.md            chapters; quote workflow code exactly as it is in the files
frontend/                      Next.js 16 site; src/lib/workshop.ts reads ../workshop
docs/                          architecture.md, running-the-workshop.md, CHANGELOG.md
```

## Commands

```bash
cd backend && npm ci && npm run typecheck && npm test && npm start
cd frontend && npm ci && npm run verify        # run before every push
cd frontend && npm run test:e2e
docker compose up --build                      # Pulse on http://localhost:3000
```

## Rules

1. **The pipeline follows its own lessons.** Every workflow starts with
   `permissions: contents: read`; jobs raise only what they need. Every external action is
   pinned to a full commit SHA with a `# vX.Y.Z` comment, released at least 14 days earlier.
   Every job has `timeout-minutes`. `frontend/tests/unit/site.test.ts` enforces the first two.
2. **No untrusted text in scripts.** Pass `${{ github.* }}` values into `run:` through `env:`.
3. **Chapters quote real code.** Change a workflow and update the chapter that quotes it, in the
   same commit. Unit tests check that every workflow a chapter names exists.
4. **Publishing only on tags.** Nothing is released or pushed to a registry from a branch.
5. **Writing style.** Plain English, short sentences, no em dashes in code, docs or commits.
6. **Git.** Conventional Commits, one logical change per commit, no AI attribution trailers.

## Skills

Follows the [JARS Skills](https://github.com/jars-demo/jars-skills) playbooks: `tokenjars`,
`api-design`, `write-tests`, `commit-style`, `code-review`, `changelog` and `release`.

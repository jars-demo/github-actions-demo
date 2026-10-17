# GitHub Actions: CI/CD from zero

**A hands-on workshop that takes a small app from no automation to tested on every push, released
on every tag, shipped as a container and deployed to a live page.** Every workflow in this
repository is real and runs on every change, so you can learn from the code and from the
[live runs](https://github.com/jars-demo/github-actions-demo/actions) side by side.

[![Backend CI](https://github.com/jars-demo/github-actions-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/jars-demo/github-actions-demo/actions/workflows/ci.yml)
[![Container](https://github.com/jars-demo/github-actions-demo/actions/workflows/container.yml/badge.svg)](https://github.com/jars-demo/github-actions-demo/actions/workflows/container.yml)
[![Status page](https://github.com/jars-demo/github-actions-demo/actions/workflows/pages.yml/badge.svg)](https://github.com/jars-demo/github-actions-demo/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-1d4ed8.svg)](LICENSE)

Workshop site: **[githubactions.jishanahmed.in](https://githubactions.jishanahmed.in)**

## Start

You need Node.js 22, git and a GitHub account. Fork the repository first, so the workflows run
under your name.

```bash
git clone https://github.com/YOUR-NAME/github-actions-demo.git
cd github-actions-demo/backend
npm ci
npm test
npm start            # http://localhost:3000/health
```

Or run the container: `docker compose up --build`.

## The workflows

| File                                                        | On                           | What it does                                                          | Chapter  |
| ----------------------------------------------------------- | ---------------------------- | --------------------------------------------------------------------- | -------- |
| [`ci.yml`](.github/workflows/ci.yml)                        | push, pull request           | Types and tests on Node 22 and 24, Linux and Windows; keeps the build | 04 to 06 |
| [`nightly.yml`](.github/workflows/nightly.yml)              | schedule, manual             | Tests against the newest Node.js                                      | 07       |
| [`reusable-test.yml`](.github/workflows/reusable-test.yml)  | workflow_call                | A test job other workflows call                                       | 08       |
| [`setup-backend`](.github/actions/setup-backend/action.yml) | (composite action)           | Node.js, cache and `npm ci` in one step                               | 08       |
| [`release.yml`](.github/workflows/release.yml)              | `v*` tag                     | Checks the version, tests, packs, publishes a GitHub release          | 09       |
| [`container.yml`](.github/workflows/container.yml)          | push, pull request, `v*` tag | Builds and smoke tests the image; publishes to GHCR on tags           | 10       |
| [`pages.yml`](.github/workflows/pages.yml)                  | push to main, manual         | Deploys the status page through the `github-pages` environment        | 11       |
| [`frontend.yml`](.github/workflows/frontend.yml)            | push, pull request           | Lint, types, tests and build for the workshop site                    | 04       |
| [`dependabot.yml`](.github/dependabot.yml)                  | weekly                       | Updates actions and packages after a 14-day cooldown                  | 12       |

Every workflow starts read-only (`permissions: contents: read`), raises single jobs only where
needed, pins every action to a full commit SHA, and sets a timeout. A unit test in
`frontend/tests/unit/site.test.ts` fails if any of that stops being true.

## The workshop

| #   | Chapter                                                                 | Minutes |
| --- | ----------------------------------------------------------------------- | ------- |
| 01  | [Why CI/CD](workshop/01-why-ci-cd.md)                                   | 10      |
| 02  | [Set up](workshop/02-set-up.md)                                         | 10      |
| 03  | [Your first workflow](workshop/03-first-workflow.md)                    | 15      |
| 04  | [Continuous integration](workshop/04-continuous-integration.md)         | 20      |
| 05  | [Matrix builds](workshop/05-matrix-builds.md)                           | 15      |
| 06  | [Caching and artifacts](workshop/06-caching-and-artifacts.md)           | 15      |
| 07  | [Schedules and manual runs](workshop/07-schedules-and-inputs.md)        | 10      |
| 08  | [Reuse: composite actions and reusable workflows](workshop/08-reuse.md) | 15      |
| 09  | [Releases on tags](workshop/09-releases.md)                             | 15      |
| 10  | [Containers](workshop/10-containers.md)                                 | 20      |
| 11  | [Deploy with environments](workshop/11-deploy.md)                       | 15      |
| 12  | [Secure and fast](workshop/12-secure-and-fast.md)                       | 20      |

Teaching it? See the [facilitator guide](docs/running-the-workshop.md).

## Repository layout

```text
backend/             Pulse: a tiny TypeScript status API (src/, test/, Dockerfile, openapi.yaml)
.github/workflows/   the workflows above
.github/actions/     the shared composite action
workshop/            the chapters, in Markdown
frontend/            the workshop site (Next.js), rendered from workshop/
docs/                architecture, facilitator guide, changelog
compose.yaml         run Pulse in Docker locally
```

## Checks

```bash
# Backend
cd backend && npm ci && npm run typecheck && npm test

# Frontend
cd frontend && npm ci && npm run verify && npm run test:e2e
```

## Deploying the site

The site is a Next.js app in `frontend/`. On Vercel, import the repository and set **Root
Directory** to `frontend`. It reads the chapters from `../workshop` at build time.

## More from JARS Demo

[TypeScript](https://typescript.jishanahmed.in) ·
[FastAPI](https://fastapi.jishanahmed.in) ·
[gRPC](https://grpc.jishanahmed.in) ·
[OpenTelemetry](https://otel.jishanahmed.in) ·
[Local AI](https://local-ai.jishanahmed.in) ·
[MCP vs API](https://mcp-vs-api.jishanahmed.in) ·
[Cognee](https://cognee.jishanahmed.in) ·
[FalkorDB](https://falkordb.jishanahmed.in) ·
[JARS Skills](https://skills.jishanahmed.in)

## Licence

[MIT](LICENSE).

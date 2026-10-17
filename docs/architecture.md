# Architecture

Three independent parts share one repository, each with its own folder, dependencies and checks.

| Part           | Folder      | Built with                           | Checked by                  | Ships to                            |
| -------------- | ----------- | ------------------------------------ | --------------------------- | ----------------------------------- |
| Pulse, the app | `backend/`  | TypeScript, `node:http`, `node:test` | `ci.yml`, `container.yml`   | GitHub Releases, GHCR, GitHub Pages |
| The lessons    | `workshop/` | Markdown                             | `frontend.yml` (unit tests) | the site                            |
| The site       | `frontend/` | Next.js 16, Tailwind CSS 4           | `frontend.yml`              | Vercel                              |

## Pulse

`route(method, url, info)` is the whole API as a pure function returning `{ status, body,
headers }`. The server is a thin wrapper, so tests need no network and run in milliseconds,
which keeps every CI chapter fast. Errors share one shape, `{ "error": { "code", "message" } }`,
documented in `backend/openapi.yaml`. `readInfo` stamps builds with `GITHUB_SHA`, which is how the
deployed status page proves which commit is live.

Pulse has no runtime dependencies on purpose: the workshop is about the pipeline, and a small
dependency tree keeps installs, caches and images easy to reason about.

## The pipeline

```text
push / pull request
  ci.yml         test (Node 22, Node 24, Windows) -> build -> artifact pulse-dist
  container.yml  build -> smoke test (health, version, non-root)
push to main
  pages.yml      build status page -> deploy (environment: github-pages)
tag v*
  release.yml    check tag = package.json -> test -> npm pack -> gh release create
  container.yml  build -> publish ghcr.io/<owner>/pulse:<tag> and :latest
schedule / manual
  nightly.yml    -> reusable-test.yml (Node: node, lts/*, 24 or 22)
```

### Decisions

| Decision                                         | Why                                                          |
| ------------------------------------------------ | ------------------------------------------------------------ |
| Read-only token by default, raised per job       | Least privilege; a compromised step can do little.           |
| Actions pinned by commit SHA                     | Tags can move; SHAs cannot. Dependabot keeps them current.   |
| 14-day cooldown on updates                       | New releases get time to be checked by others first.         |
| Publishing only from `v*` tags, in separate jobs | Branches and pull requests can never publish.                |
| `paths` filters per part                         | A change to the lessons does not rebuild the image.          |
| Composite action for setup                       | One place for Node.js, caching and `npm ci`.                 |
| Pages deploy with OIDC (`id-token`)              | No stored deploy secret.                                     |
| Quoted glob for `node --test`                    | Same behaviour in bash and PowerShell on the Windows runner. |

## The site

`frontend/src/lib/workshop.ts` reads `../workshop/NN-slug.md` at build time; every chapter is
prerendered. `src/lib/site.ts` lists the workflows shown on the home page, and a unit test checks
each listed file exists with the listed triggers.

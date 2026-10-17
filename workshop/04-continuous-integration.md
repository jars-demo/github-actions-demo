# Continuous integration

> Check out, install, type check and test on every push and pull request.

**Time:** 20 minutes

## Goal

Read and understand `.github/workflows/ci.yml`, the workflow that guards `main`.

## When it runs

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - '.github/actions/**'
      - '.github/workflows/ci.yml'
  pull_request:
    paths:
      - 'backend/**'
      - '.github/actions/**'
      - '.github/workflows/ci.yml'
  workflow_dispatch:
```

- `push` to `main`, and every `pull_request`, so a change is tested before and after it merges.
- `workflow_dispatch` adds a **Run workflow** button, handy to re-run CI on demand.
- `paths` skips the run when nothing it tests changed, like an edit to the workshop text.

## Least privilege

```yaml
permissions:
  contents: read
```

Every run gets a `GITHUB_TOKEN`. This line makes it read-only for the whole workflow. Jobs that
need more (publishing, deploying) ask for exactly that, by name. More in chapter 12.

## Cancel outdated runs

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Push three commits quickly and only the newest one finishes. Faster feedback, less waste.

## The test job

```yaml
steps:
  - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
  - uses: ./.github/actions/setup-backend
    with:
      node-version: ${{ matrix.node }}
  - name: Type check
    run: npm run typecheck
    working-directory: backend
  - name: Test
    run: npm test
    working-directory: backend
```

1. **Check out** the commit being tested.
2. **Set up** Node.js and install exact dependencies: a shared step, explained in chapter 08.
3. **Type check**, then **test**, inside `backend/`.

`timeout-minutes: 10` on the job stops a stuck run from burning hours.

## Make it a gate

A check only protects `main` if merging waits for it. In your fork: **Settings**, **Branches**,
**Add branch ruleset** (or protection rule) for `main`, turn on **Require status checks to
pass**, and pick the **Test** and **Build** checks.

## Check it works

Open a pull request in your fork that breaks a test, for example change `'ok'` to `'okay'` in
`backend/src/app.ts`. The checks go red and the merge button warns you. Fix it and they go green.

## Exercise

Add a step that fails the build when `backend/openapi.yaml` is missing. Hint:
`test -f openapi.yaml`.

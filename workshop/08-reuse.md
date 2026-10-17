# Reuse: composite actions and reusable workflows

> Write shared steps and shared jobs once, and call them from every workflow.

**Time:** 15 minutes

## Goal

Know the two ways to stop copying YAML, and when to use each.

## Composite actions share steps

Every backend job needs Node.js, the cache and `npm ci`. Those steps live once in
`.github/actions/setup-backend/action.yml`:

```yaml
name: Set up the backend
inputs:
  node-version:
    required: false
    default: '22'
runs:
  using: composite
  steps:
    - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
      with:
        node-version: ${{ inputs.node-version }}
        cache: npm
        cache-dependency-path: backend/package-lock.json
    - name: Install dependencies
      run: npm ci
      shell: bash
      working-directory: backend
```

Any job uses it as a step, after checking out the code (the action lives in the repository):

```yaml
- uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
- uses: ./.github/actions/setup-backend
  with:
    node-version: '24'
```

Note `shell: bash` on `run` steps: composite actions must say which shell to use.

## Reusable workflows share whole jobs

`.github/workflows/reusable-test.yml` is a complete test job that takes an input:

```yaml
on:
  workflow_call:
    inputs:
      node-version:
        type: string
        required: true
```

`nightly.yml` calls it as a job, not a step:

```yaml
jobs:
  test:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: ${{ inputs.node-version || 'node' }}
```

## Which one?

| Share...                                          | Use               | Called as                                   |
| ------------------------------------------------- | ----------------- | ------------------------------------------- |
| a few steps inside jobs                           | composite action  | a step: `uses: ./.github/actions/name`      |
| whole jobs, with their own runner and permissions | reusable workflow | a job: `uses: ./.github/workflows/file.yml` |

Both can live in another repository too, for sharing across a team.

## Check it works

Change the default `node-version` in the composite action to `'24'` on a branch and open a pull
request: the **Build** job now runs on Node 24, because it does not pass a version.

## Exercise

Make `ci.yml`'s **Build** job pass `node-version: '22'` explicitly, so it no longer depends on the
action's default.

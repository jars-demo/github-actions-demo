# Caching and artifacts

> Reuse downloads between runs, and keep build output after a run ends.

**Time:** 15 minutes

## Goal

Make installs fast with a cache, and hand files from one job (or run) to people and other jobs
with artifacts.

## A cache is for speed

Runners start empty, so every run downloads dependencies again. `actions/setup-node` can cache
npm's download folder, keyed on the lockfile. From `.github/actions/setup-backend/action.yml`:

```yaml
- uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
  with:
    node-version: ${{ inputs.node-version }}
    cache: npm
    cache-dependency-path: backend/package-lock.json
```

When `package-lock.json` changes, the key changes and a fresh cache is saved. A cache is only an
optimisation: the run must still pass when it is empty.

## An artifact is for keeping

The **Build** job uploads the compiled app:

```yaml
- name: Keep the build for 7 days
  uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
  with:
    name: pulse-dist
    path: backend/dist
    retention-days: 7
```

Anyone with access can download it from the run page. Another job in the same run can fetch it
with `actions/download-artifact`.

|                 | Cache                       | Artifact                            |
| --------------- | --------------------------- | ----------------------------------- |
| Purpose         | speed up later runs         | keep or pass on the output of a run |
| Missing?        | the run still works, slower | the job that needs it fails         |
| Typical content | dependency downloads        | builds, test reports, coverage      |

## Keep artifacts small and short-lived

`retention-days` deletes them automatically. Never upload secrets, `.env` files or whole
`node_modules` folders.

## Check it works

Open a **Backend CI** run and scroll to **Artifacts**: `pulse-dist` is there. Compare the
**Install dependencies** step of two runs: the second one is faster thanks to the cache.

## Exercise

Add a third job that `needs: build`, downloads `pulse-dist` with
`actions/download-artifact@3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c # v8.0.1`, and lists its
files with `ls -R`.

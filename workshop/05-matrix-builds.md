# Matrix builds

> One job definition, many machines: Node versions and operating systems in parallel.

**Time:** 15 minutes

## Goal

Test on every Node version and operating system you support, without copying the job.

## The matrix

From `.github/workflows/ci.yml`:

```yaml
test:
  name: Test (Node ${{ matrix.node }}, ${{ matrix.os }})
  runs-on: ${{ matrix.os }}
  strategy:
    fail-fast: false
    matrix:
      os: [ubuntu-latest]
      node: ['22', '24']
      include:
        - os: windows-latest
          node: '22'
```

GitHub multiplies the lists: Ubuntu with Node 22 and with Node 24, then `include` adds one more
combination, Windows with Node 22. Three jobs, running at the same time.

| Key                        | Meaning                                                        |
| -------------------------- | -------------------------------------------------------------- |
| `matrix.os`, `matrix.node` | read the current combination anywhere in the job               |
| `include`                  | add specific combinations (or extra values to existing ones)   |
| `exclude`                  | remove combinations you do not need                            |
| `fail-fast: false`         | let the others finish when one fails, so you see every failure |

## Why Windows

Paths, line endings and shells differ. Pulse's test command uses a quoted glob,
`node --test "dist/test/**/*.test.js"`, so Node expands it the same way on every system instead
of leaving it to bash or PowerShell. A Windows job is how you find out about such things before
your users do.

## Cost

Each combination is a separate job and counts towards your minutes on private repositories
(public repositories are free). Test the versions you actually support, not everything.

## Check it works

Open a **Backend CI** run. The graph shows three **Test** jobs side by side, and **Build** waits
for all of them because of `needs: test`.

## Exercise

Add `macos-latest` with Node 24 through `include`. How long does the macOS job take compared with
Linux?

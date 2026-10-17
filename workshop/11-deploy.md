# Deploy with environments

> Deploy to GitHub Pages on every push to main, through a protected environment.

**Time:** 15 minutes

## Goal

Continuous deployment: `main` is always live, and the live page tells you which commit it is.

## Turn on Pages

In your fork: **Settings**, **Pages**, **Source: GitHub Actions**. That is all; there is no
branch to configure.

## Build, then deploy

`.github/workflows/pages.yml` has two jobs. The first builds the page and uploads it:

```yaml
- name: Build the status page
  run: npm run status-page
  working-directory: backend
- uses: actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5.0.0
  with:
    path: backend/status-page
```

The second deploys it, and is the only job allowed to:

```yaml
deploy:
  needs: build
  permissions:
    pages: write
    id-token: write
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
  steps:
    - id: deployment
      uses: actions/deploy-pages@368f82528645a54fb793d4d04e342629a3f51346 # v5.0.1
```

- `id-token: write` lets the job prove its identity to Pages with a short-lived token (OIDC),
  instead of a stored password.
- `url:` puts a link to the live site on the run page.

## Environments

An **environment** is a named deploy target with its own rules: required reviewers, a wait timer,
which branches may deploy, and its own secrets. Open **Settings**, **Environments**,
**github-pages** to see them. For a real production server you would add a reviewer, so every
deploy waits for a human to approve it.

## Never two deploys at once

```yaml
concurrency:
  group: pages
  cancel-in-progress: false
```

Deploys queue instead of cancelling each other, so a half-finished deploy is never interrupted.

## Check it works

Push a change under `backend/` to `main`. When **Status page** is green, open the link on the run.
The page shows the first 12 characters of your commit: the same as `git rev-parse --short=12 HEAD`.

## Exercise

Add a required reviewer to the `github-pages` environment, push again, and approve the deploy
from the run page.

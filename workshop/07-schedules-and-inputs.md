# Schedules and manual runs

> Run on a timer, and add a button with options for running by hand.

**Time:** 10 minutes

## Goal

Catch problems that do not come from your own commits, like a new Node.js release, with a nightly
run you can also start by hand.

## The nightly workflow

`.github/workflows/nightly.yml`:

```yaml
on:
  schedule:
    - cron: '17 3 * * *' # 03:17 UTC; avoid :00, when GitHub's schedulers are busiest
  workflow_dispatch:
    inputs:
      node-version:
        description: Node.js version to test
        type: choice
        options: ['node', 'lts/*', '24', '22']
        default: 'node'
```

- **`schedule`** uses cron syntax, always in UTC: minute, hour, day, month, weekday.
- **`workflow_dispatch`** adds a **Run workflow** button, here with a dropdown.
- `node` means the newest Node.js release; `lts/*` the newest long-term support release.

## Using the input

```yaml
jobs:
  test:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: ${{ inputs.node-version || 'node' }}
```

A scheduled run has no inputs, so `||` falls back to `node`. (The `uses:` line calls a reusable
workflow: chapter 08.)

## Good to know

- Schedules run on the default branch only.
- GitHub can delay scheduled runs at busy times, and pauses schedules in repositories with no
  activity for 60 days.

## Check it works

Open **Actions**, **Nightly**, **Run workflow**, pick `24`, and start it. The job name shows
`Test on Node 24`.

## Exercise

Add a `weekly` schedule on Mondays at 06:30 UTC to the same workflow. Check your cron at
[crontab.guru](https://crontab.guru).

# Why CI/CD

> What continuous integration and delivery buy you, and the pipeline we build in this workshop.

**Time:** 10 minutes

## Goal

Know what CI/CD is for, what GitHub Actions is, and where each chapter takes the pipeline.

## The problem

Without automation, every change depends on someone remembering to run the tests, build the
app, tag a release, push an image and deploy. People forget, machines differ, and "works on my
laptop" ships.

- **Continuous integration (CI):** every push and pull request is built and tested the same way,
  on clean machines, before it is merged.
- **Continuous delivery (CD):** a change that passes is packaged and deployed by the same
  automation, the same way every time.

## GitHub Actions in one picture

```text
event (push, pull_request, tag, schedule, button)
  -> workflow   a YAML file in .github/workflows/
       -> jobs  run in parallel on fresh machines called runners
            -> steps  shell commands or reusable actions, in order
```

You describe this in YAML. GitHub provides the runners (Linux, Windows, macOS) and shows every
run, log and result on the repository's **Actions** tab.

## What we automate

**Pulse** is a tiny TypeScript status API in `backend/`. It has no runtime dependencies, so every
minute of this workshop goes on automation, not on the app. By the end:

| On                          | Workflow                       | Result                                         |
| --------------------------- | ------------------------------ | ---------------------------------------------- |
| every push and pull request | `ci.yml`                       | types and tests on 3 machines, then a build    |
| every push and pull request | `container.yml`                | a Docker image, built and smoke tested         |
| push to `main`              | `pages.yml`                    | a live status page showing the deployed commit |
| a `v*` tag                  | `release.yml`, `container.yml` | a GitHub release and a published image         |
| every night                 | `nightly.yml`                  | tests against the newest Node.js               |

## The repository

```text
backend/             Pulse: src/, test/, Dockerfile, openapi.yaml
.github/workflows/   the workflows above
.github/actions/     a composite action they share
workshop/            these chapters
frontend/            the workshop site
docs/                architecture, facilitator guide, changelog
```

## Check it works

Open the repository's **Actions** tab. Every workflow in the table has real runs you can open.
Click one, then a job, then a step, and read its log.

## Exercise

Write down the last thing that broke in one of your projects because a manual step was skipped.
You will automate something like it by chapter 04.

# Your first workflow

> Events, jobs, steps and runners, in a workflow you write and run in two minutes.

**Time:** 15 minutes

## Goal

Write a workflow, trigger it, and read its log. Understand every line.

## Write it

In your fork, create `.github/workflows/hello.yml`:

```yaml
name: Hello

on:
  push:
  workflow_dispatch:

jobs:
  greet:
    runs-on: ubuntu-latest
    steps:
      - name: Say hello
        run: echo "Hello from ${{ github.actor }} on ${{ runner.os }}"
      - name: Show the commit
        run: echo "This run is for commit $GITHUB_SHA"
```

Commit and push it.

## Every line

| Line          | Meaning                                                                     |
| ------------- | --------------------------------------------------------------------------- |
| `name:`       | what the Actions tab shows                                                  |
| `on:`         | the **events** that start it: here every push, and a manual button          |
| `jobs:`       | one or more jobs; they run in parallel unless one `needs` another           |
| `runs-on:`    | the **runner**: a fresh virtual machine, thrown away afterwards             |
| `steps:`      | run in order; a failing step stops the job                                  |
| `run:`        | a shell command (bash on Linux and macOS, PowerShell on Windows by default) |
| `${{ ... }}`  | an **expression**, filled in by GitHub before the step runs                 |
| `$GITHUB_SHA` | an environment variable the runner sets for every step                      |

## Actions are reusable steps

A step can `run` a command or `uses` an action: someone else's packaged step. The most common is
checking out your code, because a runner starts empty:

```yaml
steps:
  - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
  - run: ls
```

That long string is a commit SHA, not a version number. Chapter 12 explains why.

## Check it works

Open **Actions**, then **Hello**, then the newest run. Expand **Say hello**: you see your username
and `Linux`. Then try the **Run workflow** button on the right: that is `workflow_dispatch`.

## Exercise

Add a second job, `when`, that prints `date -u`. Make it run only after `greet` with
`needs: greet`, and watch the graph on the run page change.

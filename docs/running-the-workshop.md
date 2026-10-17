# Running the workshop

## Who it is for

Developers who use git and GitHub and have run tests from a terminal. No CI/CD or YAML experience
needed.

## Formats

| Format    | Chapters                                                          | Time                 |
| --------- | ----------------------------------------------------------------- | -------------------- |
| Lightning | 01, 03, 04 live, then the pipeline diagram                        | 45 minutes           |
| Half day  | 01 to 08 hands-on, 09 to 12 as a demo                             | 3 hours with a break |
| Full day  | All twelve, every exercise, then CI for a repository of their own | 5 to 6 hours         |

## Before the day

Ask everyone to fork the repository, enable Actions in the fork, and run `npm ci && npm test` in
`backend/`. For chapter 10, Docker is optional: the container work runs on GitHub's runners.

- [ ] Your own fork has green runs for Backend CI, Container and Status page.
- [ ] Pages is set to **Source: GitHub Actions** in your fork.
- [ ] You know your fork's Actions URL to put on screen.

## The moments that land

- **Chapter 03:** a five-line workflow runs within seconds of `git push`.
- **Chapter 04:** a pull request with a broken test goes red, and the merge button warns.
- **Chapter 05:** three matrix jobs appear side by side.
- **Chapter 09:** one `git push` of a tag produces a release with notes and a download.
- **Chapter 11:** the live page shows the exact commit that was just pushed.
- **Chapter 12:** the script injection example, read aloud with a malicious title.

## Common snags

| Symptom                                  | Fix                                                                        |
| ---------------------------------------- | -------------------------------------------------------------------------- |
| No runs appear in a fork                 | Open the Actions tab and enable workflows.                                 |
| `Resource not accessible by integration` | The job lacks a permission; add it to that job only.                       |
| Pages deploy fails with "not enabled"    | Settings, Pages, Source: GitHub Actions.                                   |
| Release fails on the version check       | Bump `backend/package.json` to match the tag.                              |
| Push to GHCR is denied                   | The publish job needs `packages: write`; the image name must be lowercase. |
| A scheduled run never starts             | Schedules only run on the default branch, and may be delayed.              |

# Releases on tags

> Push a version tag and get a tested, packaged GitHub release with notes.

**Time:** 15 minutes

## Goal

Turn "cutting a release" into one command: `git push` of a tag.

## Triggered by tags

`.github/workflows/release.yml`:

```yaml
on:
  push:
    tags: ['v*']
```

Only tags starting with `v` start it, like `v0.2.0`. Ordinary pushes do not.

## Write access, for this job only

```yaml
permissions:
  contents: read

jobs:
  release:
    permissions:
      contents: write
```

Creating a release needs `contents: write`. The workflow stays read-only and only this job is
raised.

## Refuse a wrong tag

```yaml
- name: Check the tag matches package.json
  working-directory: backend
  env:
    TAG: ${{ github.ref_name }}
  run: |
    version="v$(node -p "require('./package.json').version")"
    if [ "$version" != "$TAG" ]; then
      echo "::error::Tag $TAG does not match package.json version $version"
      exit 1
    fi
```

`::error::` is a **workflow command**: it shows as a red annotation on the run summary. The tag
reaches the script through `env`, not by pasting `${{ }}` into the script (chapter 12 says why).

## Test, pack, publish

```yaml
- name: Test
  run: npm test
  working-directory: backend
- name: Pack
  run: npm pack
  working-directory: backend
- name: Create the release
  env:
    GH_TOKEN: ${{ github.token }}
    TAG: ${{ github.ref_name }}
  run: gh release create "$TAG" backend/*.tgz --verify-tag --generate-notes --title "Pulse $TAG"
```

The `gh` CLI is preinstalled on GitHub's runners. `--generate-notes` lists the pull requests
since the last release.

## Cut a release in your fork

```bash
cd backend
npm version 0.2.0 --no-git-tag-version   # updates package.json and the lockfile
cd ..
git commit -am "chore: Release v0.2.0"
git tag v0.2.0
git push origin main v0.2.0
```

## Check it works

Open **Actions**, **Release**: the run is green. Then the repository's **Releases** page shows
`Pulse v0.2.0` with notes and the `.tgz` file attached.

## Exercise

Push a tag that does not match (`v9.9.9`) and read the annotation. Then delete the tag:
`git push origin :refs/tags/v9.9.9`.

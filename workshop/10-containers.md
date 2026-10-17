# Containers

> Build and smoke test a Docker image on every change; publish it to GHCR only on releases.

**Time:** 20 minutes

## Goal

Ship Pulse as an image anyone can run, published by CI with the built-in token.

## The image

`backend/Dockerfile` has two stages: one with the compiler to build, and a small one to run, as the
unprivileged `node` user, with a health check:

```dockerfile
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
COPY --from=build /app/dist ./dist
USER node
```

## Build and smoke test on every change

From `.github/workflows/container.yml`:

```yaml
- name: Build the image
  run: docker build -t pulse:ci backend
- name: Smoke test
  env:
    COMMIT: ${{ github.sha }}
  run: |
    docker run -d --name pulse -p 3000:3000 -e PULSE_COMMIT="$COMMIT" pulse:ci
    for i in $(seq 1 20); do curl -fs localhost:3000/health && break; sleep 1; done
    curl -fs localhost:3000/api/version | grep -q '"name":"pulse"'
    test "$(docker exec pulse whoami)" = node
```

Docker is preinstalled on Ubuntu runners. The smoke test proves the image starts, answers, and
does not run as root.

## Publish only on tags

```yaml
publish:
  if: startsWith(github.ref, 'refs/tags/v')
  needs: build
  permissions:
    contents: read
    packages: write
```

- `if:` skips the job unless a `v*` tag started the run.
- Only this job can write packages, and pull requests never reach it.

```yaml
run: |
  image="ghcr.io/${OWNER,,}/pulse"
  echo "$TOKEN" | docker login ghcr.io -u "$ACTOR" --password-stdin
  docker build --label "org.opencontainers.image.source=$SOURCE" \
    -t "$image:$VERSION" -t "$image:latest" backend
  docker push "$image:$VERSION"
  docker push "$image:latest"
```

`${OWNER,,}` lowercases the owner (image names must be lowercase). `--password-stdin` keeps the
token out of the process list. The `source` label links the package to the repository.

## Check it works

After the release in chapter 09, open your profile's **Packages** tab. Then run it anywhere:

```bash
docker run --rm -p 3000:3000 ghcr.io/YOUR-NAME/pulse:v0.2.0
```

## Exercise

Add a step to the build job that fails when the image is larger than 300 MB. Hint:
`docker image inspect pulse:ci --format '{{.Size}}'`.

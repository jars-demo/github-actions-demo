# Set up

> Fork the repository, run Pulse on your machine, and switch on Actions in your fork.

**Time:** 10 minutes

## Goal

Your own fork, with Pulse running locally and its workflows enabled on GitHub.

## Steps

1. **Fork** [jars-demo/github-actions-demo](https://github.com/jars-demo/github-actions-demo)
   with the **Fork** button. Workflows run in your fork, under your account, for free on public
   repositories.

2. **Enable Actions.** In your fork, open the **Actions** tab. GitHub pauses workflows in new
   forks until you click **I understand my workflows, go ahead and enable them**.

3. **Clone and run Pulse.** You need Node.js 22 or newer.

   ```bash
   git clone https://github.com/YOUR-NAME/github-actions-demo.git
   cd github-actions-demo/backend
   npm ci
   npm test
   npm start
   ```

4. **Try it.**

   ```bash
   curl http://localhost:3000/health
   curl "http://localhost:3000/api/greet?name=Ada"
   curl http://localhost:3000/api/version
   ```

`/api/version` says `"commit":"local"`. In CI it shows the real commit, because the code reads
`GITHUB_SHA`, a variable every workflow run sets:

```ts
commit: (env.GITHUB_SHA ?? env.PULSE_COMMIT ?? 'local').slice(0, 12),
```

## What the commands do

| Command             | What it runs                                                 |
| ------------------- | ------------------------------------------------------------ |
| `npm ci`            | installs the exact versions in `package-lock.json`           |
| `npm run typecheck` | the TypeScript compiler, checking types only                 |
| `npm test`          | builds, then runs the tests with Node's built-in test runner |
| `npm start`         | the server in `dist/src/server.js`                           |

These are exactly the commands CI runs. A good pipeline runs what you run, nothing magic.

## Check it works

`npm test` reports every test passing, and `curl http://localhost:3000/health` returns
`{"status":"ok"}`.

## Exercise

Read `backend/openapi.yaml`. Which status code and error code do you get for
`/api/greet?name=` with an empty name? Check it with `curl -i`.

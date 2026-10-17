// Builds Pulse's status page into status-page/index.html. The Pages workflow deploys it, so the live page
// always says exactly which commit it was built from.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

import { readInfo } from './app.js'

const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
  version: string
}
const info = readInfo(process.env, pkg.version)
const built = new Date().toISOString().replace('T', ' ').slice(0, 16)

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pulse status</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #fbf8f1;
         color: #141412; font: 16px/1.6 ui-sans-serif, system-ui, sans-serif; }
  main { padding: 2rem; max-width: 28rem; }
  h1 { font: 400 2.6rem/1.1 Georgia, serif; margin: 0 0 1rem; }
  dl { display: grid; grid-template-columns: auto 1fr; gap: .4rem 1.5rem; margin: 0; }
  dt { color: #6b675f; } dd { margin: 0; font-family: ui-monospace, monospace; }
  .ok { color: #15803d; }
</style>
</head>
<body>
<main>
  <h1>Pulse is <span class="ok">up</span>.</h1>
  <dl>
    <dt>Version</dt><dd>${info.version}</dd>
    <dt>Commit</dt><dd>${info.commit}</dd>
    <dt>Built</dt><dd>${built} UTC</dd>
  </dl>
</main>
</body>
</html>
`

mkdirSync('status-page', { recursive: true })
writeFileSync('status-page/index.html', html)
console.log(`Wrote status-page/index.html for ${info.version} (${info.commit})`)

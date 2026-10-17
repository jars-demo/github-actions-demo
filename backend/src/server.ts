// The HTTP server: reads the port, wires requests to route(), and logs one line per request.

import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'

import { readInfo, route } from './app.js'

const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
  version: string
}
const info = readInfo(process.env, pkg.version)
const port = Number(process.env.PORT ?? 3000)

createServer((request, response) => {
  const reply = route(request.method ?? 'GET', request.url ?? '/', info)
  response.writeHead(reply.status, { 'content-type': 'application/json', ...reply.headers })
  response.end(JSON.stringify(reply.body))
  console.log(JSON.stringify({ method: request.method, path: request.url, status: reply.status }))
}).listen(port, () => {
  console.log(`Pulse ${info.version} (${info.commit}) on http://localhost:${port}`)
})

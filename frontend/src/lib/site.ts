// Site-wide content. The workflow list mirrors the real files in .github/; a unit test checks
// that every file exists and really has the triggers listed here.

export const REPO_URL = 'https://github.com/jars-demo/github-actions-demo'
export const ACTIONS_URL = `${REPO_URL}/actions`

export type Workflow = {
  file: string
  name: string
  /** Event names exactly as they appear under `on:` in the file. */
  triggers: string[]
  does: string
  chapter: string
}

export const WORKFLOWS: Workflow[] = [
  {
    file: '.github/workflows/ci.yml',
    name: 'Backend CI',
    triggers: ['push', 'pull_request'],
    does: 'Type checks and tests on Node 22 and 24, Linux and Windows, then keeps the build.',
    chapter: '04-continuous-integration',
  },
  {
    file: '.github/workflows/nightly.yml',
    name: 'Nightly',
    triggers: ['schedule', 'workflow_dispatch'],
    does: 'Tests against the newest Node.js every night, or on demand with a chosen version.',
    chapter: '07-schedules-and-inputs',
  },
  {
    file: '.github/workflows/reusable-test.yml',
    name: 'Reusable test',
    triggers: ['workflow_call'],
    does: 'One test job other workflows call with a Node version.',
    chapter: '08-reuse',
  },
  {
    file: '.github/workflows/release.yml',
    name: 'Release',
    triggers: ['push'],
    does: 'On a v* tag: check the version, test, pack and publish a GitHub release.',
    chapter: '09-releases',
  },
  {
    file: '.github/workflows/container.yml',
    name: 'Container',
    triggers: ['push', 'pull_request'],
    does: 'Builds and smoke tests the image; a v* tag also publishes it to GHCR.',
    chapter: '10-containers',
  },
  {
    file: '.github/workflows/pages.yml',
    name: 'Status page',
    triggers: ['push', 'workflow_dispatch'],
    does: 'Deploys the status page to GitHub Pages through a protected environment.',
    chapter: '11-deploy',
  },
  {
    file: '.github/workflows/frontend.yml',
    name: 'Frontend',
    triggers: ['push', 'pull_request'],
    does: 'Lint, types, tests and a production build for this site.',
    chapter: '04-continuous-integration',
  },
]

export const QUICKSTART = `git clone https://github.com/jars-demo/github-actions-demo.git
cd github-actions-demo/backend
npm ci
npm test
npm start   # http://localhost:3000/health`

export type Workshop = { name: string; about: string; href: string }

/** The other JARS Demo workshops and tools. */
export const WORKSHOPS: Workshop[] = [
  {
    name: 'TypeScript',
    about: 'Types, unions, generics and safe parsing.',
    href: 'https://typescript.jishanahmed.in',
  },
  {
    name: 'FastAPI',
    about: 'A production-shaped Python API, step by step.',
    href: 'https://fastapi.jishanahmed.in',
  },
  {
    name: 'gRPC',
    about: 'HTTP/2, TLS and gRPC, and how to debug them.',
    href: 'https://grpc.jishanahmed.in',
  },
  {
    name: 'OpenTelemetry',
    about: 'Break a system, trace it, find the root cause.',
    href: 'https://otel.jishanahmed.in',
  },
  {
    name: 'Local AI',
    about: 'A full-stack AI app that runs fully offline.',
    href: 'https://local-ai.jishanahmed.in',
  },
  {
    name: 'MCP vs API',
    about: 'One request through MCP and a classic API.',
    href: 'https://mcp-vs-api.jishanahmed.in',
  },
  {
    name: 'Cognee',
    about: 'Memory for AI apps with knowledge graphs.',
    href: 'https://cognee.jishanahmed.in',
  },
  {
    name: 'FalkorDB',
    about: 'A fast, open-source graph database.',
    href: 'https://falkordb.jishanahmed.in',
  },
  {
    name: 'PyArmor',
    about: 'Protect, verify and ship a Python app.',
    href: 'https://pyarmor.jishanahmed.in',
  },
  {
    name: 'MailingKit',
    about: 'One typed email API for any provider.',
    href: 'https://mailingkit.jishanahmed.in',
  },
  {
    name: 'Companion Kit',
    about: 'Small, accessible companions for web apps.',
    href: 'https://companion.jishanahmed.in',
  },
  {
    name: 'JARS Skills',
    about: 'Agent skills for everyday engineering work.',
    href: 'https://skills.jishanahmed.in',
  },
]

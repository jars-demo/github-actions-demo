// The pipeline this workshop builds, drawn as a run graph: what a push does, and what a version
// tag adds. Static and labelled as a diagram; the real runs are on the repository's Actions tab.

type Node = { name: string; detail: string }

const PUSH: Node[][] = [
  [{ name: 'Push or pull request', detail: 'on: push, pull_request' }],
  [
    { name: 'Test · Node 22', detail: 'ubuntu-latest' },
    { name: 'Test · Node 24', detail: 'ubuntu-latest' },
    { name: 'Test · Node 22', detail: 'windows-latest' },
  ],
  [{ name: 'Build', detail: 'artifact: pulse-dist' }],
  [
    { name: 'Container', detail: 'build and smoke test' },
    { name: 'Status page', detail: 'deploy to Pages' },
  ],
]

const TAG: Node[] = [
  { name: 'Tag v0.2.0', detail: 'on: push tags' },
  { name: 'Release', detail: 'notes and package' },
  { name: 'Publish image', detail: 'ghcr.io' },
]

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="var(--color-ok, #15803d)" />
      <path
        d="M4.6 8.2 7 10.5l4.4-4.6"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Box({ node }: { node: Node }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-xl bg-surface px-3 py-2.5 shadow-soft ring-1 ring-hairline">
      <Check />
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-[13px] font-medium text-ink">{node.name}</span>
        <span className="truncate font-mono text-[11px] text-muted">{node.detail}</span>
      </span>
    </div>
  )
}

function Arrow() {
  return (
    <span aria-hidden="true" className="hidden self-center text-muted lg:block">
      →
    </span>
  )
}

export function Pipeline() {
  return (
    <figure className="glass-strong flex min-w-0 flex-col gap-5 rounded-panel p-4 sm:p-6">
      <figcaption className="flex items-center justify-between gap-3 text-[12px] text-muted">
        <span className="font-medium tracking-[0.12em] uppercase">The pipeline you build</span>
        <span>Diagram</span>
      </figcaption>
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        {PUSH.map((column, i) => (
          <div key={i} className="contents">
            {i > 0 ? <Arrow /> : null}
            <div className="flex min-w-0 flex-col justify-center gap-2">
              {column.map((node, j) => (
                <Box key={`${node.name}-${j}`} node={node} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-hairline pt-4">
        <p className="mb-2 text-[12px] text-muted">And when you push a version tag:</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {TAG.map((node) => (
            <Box key={node.name} node={node} />
          ))}
        </div>
      </div>
    </figure>
  )
}

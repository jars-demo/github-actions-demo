import Link from 'next/link'

import { CodeBlock } from '@/components/CopyButton'
import { Pipeline } from '@/components/Pipeline'
import { ACTIONS_URL, QUICKSTART, REPO_URL, WORKFLOWS, WORKSHOPS } from '@/lib/site'
import { CHAPTERS } from '@/lib/workshop'

const LAYOUT = [
  {
    path: 'backend/',
    about: 'Pulse, the small TypeScript API the pipeline tests, ships and deploys.',
  },
  { path: '.github/workflows/', about: 'Seven real workflows. One chapter teaches each.' },
  { path: '.github/actions/', about: 'A composite action every backend job shares.' },
  { path: 'workshop/', about: 'The chapters, in Markdown. This site renders them.' },
  { path: 'frontend/', about: 'This site: Next.js, deployed on its own.' },
  { path: 'docs/', about: 'Architecture, facilitator guide and changelog.' },
]

export default function Home() {
  const minutes = CHAPTERS.reduce((sum, chapter) => sum + chapter.minutes, 0)
  const hours = Math.round((minutes / 60) * 2) / 2

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-24 px-4 pt-14 pb-28 sm:pt-20">
      <section className="flex flex-col gap-10">
        <div className="flex max-w-3xl min-w-0 flex-col gap-6">
          <span className="rise text-[12px] font-medium tracking-[0.16em] text-muted uppercase">
            Workshop · {CHAPTERS.length} chapters · about {hours} hours
          </span>
          <h1
            className="rise font-display text-[3.2rem] leading-[0.98] tracking-[-0.035em] text-balance sm:text-7xl"
            style={{ '--delay': '60ms' } as React.CSSProperties}
          >
            GitHub Actions: <em className="text-gradient italic">CI/CD from zero.</em>
          </h1>
          <p
            className="rise max-w-2xl text-[18px] leading-relaxed text-ink-2"
            style={{ '--delay': '120ms' } as React.CSSProperties}
          >
            Take a small app from no automation to tested on every push, released on every tag,
            shipped as a container and deployed to a live page. Real workflows, running in this
            repository, explained one chapter at a time.
          </p>
          <div
            className="rise flex flex-wrap gap-3"
            style={{ '--delay': '180ms' } as React.CSSProperties}
          >
            <Link
              href="/workshop/01-why-ci-cd"
              className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-[15px] font-medium text-canvas transition-opacity hover:opacity-85"
            >
              Start the workshop
            </Link>
            <a
              href={ACTIONS_URL}
              className="glass inline-flex h-12 items-center rounded-full px-6 text-[15px] font-medium"
            >
              See the live runs
            </a>
          </div>
        </div>
        <div className="rise" style={{ '--delay': '240ms' } as React.CSSProperties}>
          <Pipeline />
        </div>
      </section>

      <section aria-labelledby="workflows" className="flex flex-col gap-8">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 id="workflows" className="font-display text-5xl leading-none tracking-[-0.03em]">
            The workflows you <em className="text-gradient italic">write.</em>
          </h2>
          <p className="text-[16px] leading-relaxed text-ink-2">
            Every one of these runs in the repository today. You will write each of them yourself.
          </p>
        </div>
        <ul className="glass flex flex-col divide-y divide-hairline rounded-panel">
          {WORKFLOWS.map((workflow) => (
            <li key={workflow.file}>
              <Link
                href={`/workshop/${workflow.chapter}`}
                className="flex flex-col gap-1.5 px-5 py-4 transition-colors hover:bg-surface/60 sm:flex-row sm:items-center sm:gap-6"
              >
                <span className="flex min-w-0 flex-col sm:w-64 sm:shrink-0">
                  <span className="text-[15px] font-semibold tracking-tight">{workflow.name}</span>
                  <code className="truncate font-mono text-[12px] text-muted">{workflow.file}</code>
                </span>
                <span className="min-w-0 flex-1 text-[14px] text-ink-2">{workflow.does}</span>
                <span className="flex flex-wrap gap-1.5">
                  {workflow.triggers.map((trigger) => (
                    <span
                      key={trigger}
                      className="rounded-full bg-accent-wash px-2 py-0.5 font-mono text-[11px] text-accent-text"
                    >
                      {trigger}
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="layout" className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-3">
          <h2 id="layout" className="font-display text-5xl leading-none tracking-[-0.03em]">
            One repository, <em className="text-gradient italic">clear parts.</em>
          </h2>
          <p className="text-[16px] leading-relaxed text-ink-2">
            The app, the automation, the lessons and this site each have their own folder, their own
            checks and their own owner in the pipeline. Nothing is mixed.
          </p>
        </div>
        <dl className="glass grid gap-x-6 gap-y-4 rounded-panel p-6 sm:grid-cols-[auto_1fr]">
          {LAYOUT.map((item) => (
            <div key={item.path} className="contents">
              <dt className="font-mono text-[13px] text-ink">{item.path}</dt>
              <dd className="text-[14px] text-ink-2">{item.about}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="chapters" className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="chapters" className="font-display text-5xl leading-none tracking-[-0.03em]">
            {CHAPTERS.length} short <em className="text-gradient italic">chapters.</em>
          </h2>
          <Link href="/workshop" className="text-[15px] font-medium text-accent-text">
            See them all
          </Link>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.slug}>
              <Link
                href={`/workshop/${chapter.slug}`}
                className="glass lift flex h-full items-start gap-4 rounded-card p-4"
              >
                <span className="font-display text-3xl leading-none text-accent-text tabular-nums">
                  {chapter.number}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-[15px] font-semibold tracking-tight">{chapter.title}</span>
                  <span className="text-[13px] text-muted">{chapter.minutes} minutes</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="glass-strong grid gap-8 rounded-panel p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div className="flex min-w-0 flex-col gap-4">
          <h2 className="font-display text-5xl leading-none tracking-[-0.03em]">
            Running in <em className="text-gradient italic">a minute.</em>
          </h2>
          <p className="text-[16px] leading-relaxed text-ink-2">
            You need Node.js 22, git and a GitHub account. Fork the repository so the workflows run
            under your name, then follow chapter 02.
          </p>
          <a href={REPO_URL} className="w-fit text-[15px] font-medium text-accent-text">
            Fork it on GitHub
          </a>
        </div>
        <div className="min-w-0">
          <CodeBlock code={QUICKSTART} />
        </div>
      </section>

      <section aria-labelledby="more" className="flex flex-col gap-6">
        <h2 id="more" className="text-[13px] font-medium tracking-[0.16em] text-muted uppercase">
          More from JARS Demo
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {WORKSHOPS.map((workshop) => (
            <li key={workshop.name}>
              <a
                href={workshop.href}
                className="glass lift flex h-full flex-col gap-1 rounded-card p-4"
              >
                <span className="text-[15px] font-semibold tracking-tight">{workshop.name}</span>
                <span className="text-[13px] leading-snug text-muted">{workshop.about}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

import Link from 'next/link'

import { REPO_URL } from '@/lib/site'

import { BackToTop } from './BackToTop'

// Navigation, footer and the back-to-top button, shared by every page.

export function LogoMark({ size = 28 }: { size?: number }) {
  // Three jobs joined into a pipeline.
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#141412" />
      <path d="M10 11v5c0 2.2 1.8 4 4 4h4" fill="none" stroke="#f5f2ea" strokeWidth="2" />
      <path d="M10 11h12" fill="none" stroke="#f5f2ea" strokeWidth="2" />
      <circle cx="10" cy="11" r="3" fill="#f5f2ea" />
      <circle cx="22" cy="11" r="3" fill="#f5f2ea" />
      <circle cx="21" cy="20" r="3.4" fill="#2563eb" />
    </svg>
  )
}

const NAV = [
  { href: '/workshop', label: 'Workshop' },
  { href: '/workshop/02-set-up', label: 'Set up' },
]

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-3 z-30 px-3 sm:top-4 sm:px-4">
        <nav
          aria-label="Main"
          className="glass-strong mx-auto flex h-13 max-w-5xl items-center justify-between gap-2 rounded-full pr-2 pl-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full text-[16px] font-semibold tracking-[-0.02em]"
          >
            <LogoMark />
            <span className="hidden sm:inline">GitHub Actions Workshop</span>
          </Link>
          <ul className="flex items-center gap-0.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex h-9 items-center rounded-full px-3 text-sm font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={REPO_URL}
                className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-sm font-medium text-canvas transition-opacity hover:opacity-85"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <LogoMark size={20} />
            GitHub Actions: CI/CD from zero, a JARS Demo workshop
          </span>
          <span>
            MIT licensed ·{' '}
            <a className="hover:text-ink" href={REPO_URL}>
              GitHub
            </a>
          </span>
        </div>
      </footer>
      <BackToTop />
    </>
  )
}

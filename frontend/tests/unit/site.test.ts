import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { WORKFLOWS } from '@/lib/site'
import { CHAPTERS, findChapter } from '@/lib/workshop'

const ROOT = path.join(process.cwd(), '..')
const read = (file: string) => fs.readFileSync(path.join(ROOT, file), 'utf8')

function filesUnder(dir: string): string[] {
  return fs
    .readdirSync(path.join(ROOT, dir), { recursive: true, encoding: 'utf8' })
    .filter((file) => /\.ya?ml$/.test(file))
    .map((file) => path.join(dir, file).replace(/\\/g, '/'))
}

describe('workshop chapters', () => {
  it('has twelve chapters numbered in order', () => {
    expect(CHAPTERS.map((chapter) => chapter.number)).toEqual(
      Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')),
    )
  })

  it.each(CHAPTERS.map((chapter) => [chapter.slug, chapter] as const))(
    '%s has a summary, a time and the standard sections',
    (_slug, chapter) => {
      expect(chapter.summary.length).toBeGreaterThan(10)
      expect(chapter.minutes).toBeGreaterThan(0)
      expect(chapter.body).toMatch(/^## Goal$/m)
      expect(chapter.body).toMatch(/^## Check it works$/m)
      expect(chapter.body).toMatch(/^## Exercise$/m)
    },
  )

  it('only mentions workflow files that exist, apart from the one chapter 03 asks you to write', () => {
    const mentioned = new Set(
      CHAPTERS.flatMap((chapter) =>
        [...chapter.body.matchAll(/\.github\/(?:workflows|actions)\/[\w./-]+\.ya?ml/g)].map(
          (match) => match[0],
        ),
      ),
    )
    mentioned.delete('.github/workflows/hello.yml') // chapter 03 asks you to write it
    mentioned.delete('.github/workflows/file.yml') // a placeholder in chapter 08's table

    expect(mentioned.size).toBeGreaterThan(5)
    for (const file of mentioned) {
      expect(fs.existsSync(path.join(ROOT, file)), `${file} is missing`).toBe(true)
    }
  })
})

describe('the workflows on the site', () => {
  it.each(WORKFLOWS.map((workflow) => [workflow.file, workflow] as const))(
    '%s exists, has its listed triggers and links to a real chapter',
    (file, workflow) => {
      const source = read(file)

      for (const trigger of workflow.triggers)
        expect(source).toMatch(new RegExp(`^  ${trigger}:`, 'm'))
      expect(findChapter(workflow.chapter), workflow.chapter).toBeDefined()
    },
  )
})

describe('the pipeline follows its own rules', () => {
  const files = [...filesUnder('.github/workflows'), ...filesUnder('.github/actions')]

  it.each(files)('%s pins every action to a full commit SHA with a version comment', (file) => {
    const uses = [...read(file).matchAll(/^\s*-?\s*uses:\s*(\S+)(.*)$/gm)]
    const remote = uses.filter(([, target]) => !target?.startsWith('./'))

    for (const [line, target, rest] of remote) {
      expect(target, line).toMatch(/^[\w.-]+\/[\w./-]+@[0-9a-f]{40}$/)
      expect(rest, line).toMatch(/# v\d/)
    }
  })

  it.each(filesUnder('.github/workflows'))('%s starts read-only', (file) => {
    expect(read(file)).toMatch(/^permissions:\n {2}contents: read$/m)
  })
})

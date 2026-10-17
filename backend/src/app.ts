// Pulse's routes as one pure function: a request in, a reply out. No server is needed to test it,
// which keeps the CI chapters fast.

export type Info = { name: string; version: string; commit: string }

export type ErrorCode = 'NOT_FOUND' | 'METHOD_NOT_ALLOWED' | 'INVALID_NAME'

export type Reply = {
  status: number
  body: unknown
  headers?: Record<string, string>
}

const NAME = /^[\p{L}\p{N} .'-]{1,40}$/u

function error(
  status: number,
  code: ErrorCode,
  message: string,
  headers?: Record<string, string>,
): Reply {
  return { status, body: { error: { code, message } }, ...(headers ? { headers } : {}) }
}

export function route(method: string, url: string, info: Info): Reply {
  const { pathname, searchParams } = new URL(url, 'http://localhost')
  if (method !== 'GET' && method !== 'HEAD') {
    return error(405, 'METHOD_NOT_ALLOWED', 'Only GET is supported.', { allow: 'GET, HEAD' })
  }

  switch (pathname) {
    case '/health':
      return { status: 200, body: { status: 'ok' } }
    case '/api/version':
      return { status: 200, body: info }
    case '/api/greet': {
      const name = searchParams.get('name')?.trim() ?? ''
      if (!NAME.test(name)) {
        return error(400, 'INVALID_NAME', 'Give a name of 1 to 40 letters, like ?name=Ada.')
      }
      return { status: 200, body: { message: `Hello, ${name}!` } }
    }
    default:
      return error(404, 'NOT_FOUND', `No route for ${pathname}.`)
  }
}

/** Build details come from the environment, so CI can stamp every build with its commit. */
export function readInfo(env: Record<string, string | undefined>, version: string): Info {
  return {
    name: 'pulse',
    version,
    commit: (env.GITHUB_SHA ?? env.PULSE_COMMIT ?? 'local').slice(0, 12),
  }
}

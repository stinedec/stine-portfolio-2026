/**
 * Thin, typed wrapper around fetch. Swap for ofetch/axios later if needed;
 * keep call sites going through `api` so that change stays in one place.
 */
export class HttpError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.body = body
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers })

  const isJson = response.headers.get('Content-Type')?.includes('application/json')
  const body: unknown = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    throw new HttpError(
      response.status,
      `Request failed: ${response.status} ${response.statusText}`.trim(),
      body,
    )
  }

  return body as T
}

const withBody = (data: unknown) => (data === undefined ? undefined : JSON.stringify(data))

export const api = {
  get: <T>(path: string, init?: RequestInit) => http<T>(path, { ...init, method: 'GET' }),
  post: <T>(path: string, data?: unknown, init?: RequestInit) =>
    http<T>(path, { ...init, method: 'POST', body: withBody(data) }),
  put: <T>(path: string, data?: unknown, init?: RequestInit) =>
    http<T>(path, { ...init, method: 'PUT', body: withBody(data) }),
  patch: <T>(path: string, data?: unknown, init?: RequestInit) =>
    http<T>(path, { ...init, method: 'PATCH', body: withBody(data) }),
  delete: <T>(path: string, init?: RequestInit) => http<T>(path, { ...init, method: 'DELETE' }),
}

import { afterEach, describe, expect, it, vi } from 'vitest'

import { api, HttpError } from '../http'

function mockFetch(body: unknown, init: ResponseInit = {}) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    }),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('api', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('parses JSON responses', async () => {
    mockFetch({ id: 1, name: 'Ada' })
    await expect(api.get<{ id: number; name: string }>('/users/1')).resolves.toEqual({
      id: 1,
      name: 'Ada',
    })
  })

  it('serializes request bodies as JSON', async () => {
    const fetchMock = mockFetch({ ok: true })
    await api.post('/users', { name: 'Ada' })

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(init.method).toBe('POST')
    expect(init.body).toBe('{"name":"Ada"}')
    expect(new Headers(init.headers).get('Content-Type')).toBe('application/json')
  })

  it('throws HttpError with status and body on failure', async () => {
    mockFetch({ message: 'Not found' }, { status: 404 })
    const error = await api.get('/missing').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(HttpError)
    expect(error).toMatchObject({ status: 404, body: { message: 'Not found' } })
  })
})

import { setParams } from '@reservoir0x/reservoir-sdk'

const fetcher = async (
  url: string,
  params: Record<string, any> = {},
  data: RequestInit = {}
) => {
  const headers = new Headers()

  if (process.env.NEXT_PUBLIC_RESERVOIR_API_KEY) {
    headers.set('x-api-key', process.env.NEXT_PUBLIC_RESERVOIR_API_KEY)
  }

  const path = new URL(url)
  setParams(path, params)

  const response = await fetch(path.href, {
    headers,
    ...data,
  })
  const json = await response.json()

  return { data: json, response }
}

export const basicFetcher = async (href: string, options?: RequestInit) => {
  const response = await fetch(href, options)
  const json = await response.json()

  return { data: json, response }
}

export const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController()
  const signal = controller.signal
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { ...options, signal })
    clearTimeout(timeoutId)
    return response
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out')
      }
    }
    throw error
  }
}

export default fetcher

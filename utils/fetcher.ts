import { setParams } from '@nftearth/reservoir-sdk'

const fetcher = async (
  url: string,
  params: Record<string, any> = {},
  data: RequestInit = {}
) => {
  try {
    const headers = new Headers()
    const path = new URL(url)
    setParams(path, params)

    const response = await fetch(path.href, {
      headers,
      ...data,
    })
    const json = await response.json()

    return { data: json, response }
  } catch (e: any) {
    return { data: null, response: { status: 400, ok: false, url: url } }
  }
}

export const basicFetcher = async (href: string, options?: RequestInit) => {
  const response = await fetch(href, options)
  const json = await response.json()

  return { data: json, response }
}

export default fetcher

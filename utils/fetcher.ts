import { setParams } from '@reservoir0x/reservoir-kit-client'

const fetcher = async (
  url: string,
  params: Record<string, any> = {},
  data: RequestInit = {}
) => {
  const headers: RequestInit['headers'] = data['headers'] || {}

  if (process.env.NEXT_PUBLIC_RESERVOIR_API_KEY) {
    headers['x-api-key'] = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY
  }

  const path = new URL(`${process.env.NEXT_PUBLIC_RESERVOIR_API_BASE}/${url}`)
  setParams(path, params)

  const response = await fetch(path.href, {
    headers,
    ...data,
  })
  const json = await response.json()

  return json
}

export default fetcher

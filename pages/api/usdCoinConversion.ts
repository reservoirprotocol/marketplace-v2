import supportedChains from 'utils/chains'
import { NextResponse } from 'next/server'
import { fetchWithTimeout } from 'utils/fetcher'

export const config = {
  runtime: 'experimental-edge',
}

let ids = supportedChains.map((chain) => chain.coingeckoId).join(',')

export default async function handler() {
  let prices
  let cacheSettings = 'maxage=0, s-maxage=86400 stale-while-revalidate' // Default cache settings
  let cfRay = ''
  try {
    const response = await fetchWithTimeout(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=${ids}`,
      {},
      5000 // Timeout in milliseconds (5 seconds)
    )

    cfRay = response.headers.get('CF-RAY') || ''

    prices = await response.json()
  } catch (error) {
    console.error('Error fetching Coingecko data:', error)
    prices = null
    cacheSettings = 'maxage=0, s-maxage=300 stale-while-revalidate' // Reduce cache time if Coingecko API fails
  }

  return new NextResponse(
    JSON.stringify({
      prices,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'Cache-Control': cacheSettings,
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
      },
    }
  )
}

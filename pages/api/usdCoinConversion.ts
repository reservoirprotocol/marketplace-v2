import supportedChains from 'utils/chains'
import { NextResponse } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

let ids = supportedChains.map((chain) => chain.coingeckoId).join(',')

export default async function handler() {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=${ids}`
  )

  const prices = await response.json()

  return new NextResponse(
    JSON.stringify({
      prices,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'Cache-Control': 'maxage=0, s-maxage=86400 stale-while-revalidate',
      },
    }
  )
}

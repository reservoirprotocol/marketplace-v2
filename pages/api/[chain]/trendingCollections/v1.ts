import { NextApiRequest, NextApiResponse } from 'next'
import { kv } from '@vercel/kv'

import supportedChains, { DefaultChain } from 'utils/chains'

async function fetchAndCacheTrendingCollections(chainPrefix: string) {
  const startTime = Math.floor(new Date().getTime() / 1000) - 60 * 6 * 60
  try {
    const chain =
      supportedChains.find((chain) => chain.routePrefix === chainPrefix) ||
      DefaultChain

    const params = {
      startTime,
      includeRecentSales: true,
      limit: 9,
      fillType: 'sale',
    }
    const searchParams = new URLSearchParams(params as any)
    const response = await fetch(
      `${
        chain?.reservoirBaseUrl
      }/collections/top-selling/v1?${searchParams.toString()}`
    ).then((res) => res.json())

    const ids = response?.collections?.map((collection: any) => {
      if (collection.id?.includes(':')) {
        return collection.id.split(':')[0] as string
      }
      return collection.id as string
    })

    const collectionsData = await fetch(
      `${chain?.reservoirBaseUrl}/collections/v6?${ids
        .map((id: string) => `contract=${id}`)
        .join('&')}`
    ).then((res) => res.json())

    let collections = response.collections.map((collection: any) => {
      return {
        ...collection,
        ...collectionsData.collections.find((c: any) => c.id === collection.id),
      }
    })

    // Store the fetched data in Redis with a TTL of 300 seconds (5 minutes)
    let res = await kv.setex(
      'trending_collections_' + chainPrefix,
      300,
      JSON.stringify(collections)
    )
    return collections
  } catch (error) {
    // Handle the error appropriately, perhaps by logging it
    console.error('Error fetching and caching data:', error)
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let chain = req.query.chain as string
  try {
    let data = (await kv.get('trending_collections_' + chain)) as string
    console.log('data:', data)

    if (data) {
      fetchAndCacheTrendingCollections(chain)
      return res.status(200).json({ collections: data })
    }

    let collections = await fetchAndCacheTrendingCollections(chain)

    res.status(200).json({ collections })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'failed to load data' })
  }
}

import { NextApiRequest, NextApiResponse } from 'next'

import supportedChains, { DefaultChain } from 'utils/chains'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let chainParam = req.query.chain as string
  try {
    const startTime = Math.floor(new Date().getTime() / 1000) - 60 * 6 * 60
    const chain =
      supportedChains.find((chain) => chain.routePrefix === chainParam) ||
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
    res.setHeader('content-type', 'application/json')
    res.setHeader('Cache-Control', 'maxage=300, stale-while-revalidate=600')
    res.status(200).json({ collections })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
    console.log(err)
  }
}

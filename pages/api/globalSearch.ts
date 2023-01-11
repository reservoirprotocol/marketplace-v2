import { ethers } from 'ethers'
import fetcher from 'utils/fetcher'
import { paths } from '@reservoir0x/reservoir-sdk'
import supportedChains, { DefaultChain } from 'utils/chains'

type Collection = NonNullable<
  paths['/collections/v5']['get']['responses']['200']['schema']['collections']
>[0]

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  const chainId = Number(searchParams.get('chainId') || 1)
  let searchResults = []

  let isAddress = ethers.utils.isAddress(q as string)

  const { reservoirBaseUrl, apiKey } =
    supportedChains.find((chain) => chain.id == chainId) || DefaultChain
  const headers = {
    headers: {
      'x-api-key': apiKey || '',
    },
  }
  // start fetching search preemptively
  let collectionQuery = fetcher(
    `${reservoirBaseUrl}/collections/v5?name=${q}&limit=6`,
    {},
    headers
  )

  if (isAddress) {
    let { data } = await fetcher(
      `${reservoirBaseUrl}/collections/v5?contract=${q}&limit=6`,
      {},
      headers
    )
    if (data.collections.length) {
      searchResults = [
        {
          type: 'collection',
          data: data.collections[0],
        },
      ]
    } else {
      let ensData = await fetch(
        `https://api.ensideas.com/ens/resolve/${q}`
      ).then((res) => res.json())
      searchResults = [
        {
          type: 'wallet',
          data: {
            ...ensData,
            address: q,
          },
        },
      ]
    }
  } else if (
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi.test(
      q as string
    )
  ) {
    let ensData = await fetch(`https://api.ensideas.com/ens/resolve/${q}`).then(
      (res) => res.json()
    )

    if (ensData.address) {
      searchResults = [
        {
          type: 'wallet',
          data: {
            ...ensData,
          },
        },
      ]
    }
  } else {
    let { data } = await collectionQuery

    searchResults = data.collections.map((collection: Collection) => ({
      type: 'collection',
      data: collection,
    }))
  }

  return new Response(
    JSON.stringify({
      results: searchResults,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'Cache-Control': 'maxage=0, s-maxage=3600 stale-while-revalidate',
      },
    }
  )
}

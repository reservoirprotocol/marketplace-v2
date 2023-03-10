import { ethers } from 'ethers'
import fetcher from 'utils/fetcher'
import { paths } from '@reservoir0x/reservoir-sdk'
import supportedChains from 'utils/chains'

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL

const COLLECTION_SET_ID = process.env.NEXT_PUBLIC_COLLECTION_SET_ID
  ? process.env.NEXT_PUBLIC_COLLECTION_SET_ID
  : undefined

const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY
  ? process.env.NEXT_PUBLIC_COMMUNITY
  : undefined

export type SearchCollection = NonNullable<
  paths['/search/collections/v1']['get']['responses']['200']['schema']['collections']
>[0] & { chainName: string; chainId: number; chainIcon: string }

type Collection = NonNullable<
  paths['/collections/v5']['get']['responses']['200']['schema']['collections']
>[0]

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')
  let searchResults: any[] = []

  const promises: ReturnType<typeof fetcher>[] = []

  let queryParams: paths['/search/collections/v1']['get']['parameters']['query'] =
    {
      name: query as string,
      limit: 6,
    }

  if (COLLECTION_SET_ID) {
    queryParams.collectionsSetId = COLLECTION_SET_ID
  } else if (COMMUNITY) {
    queryParams.community = COMMUNITY
  }

  supportedChains.forEach(async (chain) => {
    const { reservoirBaseUrl, apiKey } = chain
    const headers = {
      headers: {
        'x-api-key': apiKey || '',
      },
    }
    promises.push(
      fetcher(`${reservoirBaseUrl}/search/collections/v1`, queryParams, headers)
    )
  })

  let isAddress = ethers.utils.isAddress(query as string)

  if (isAddress) {
    const promises = supportedChains.map(async (chain) => {
      const { reservoirBaseUrl, apiKey } = chain
      const headers = {
        headers: {
          'x-api-key': apiKey || '',
        },
      }
      const { data } = await fetcher(
        `${reservoirBaseUrl}/collections/v5?contract=${query}&limit=6`,
        {},
        headers
      )
      return data.collections.map((collection: Collection) => {
        const processedCollection: SearchCollection = {
          collectionId: collection.id,
          contract: collection.primaryContract,
          image: collection.image,
          name: collection.name,
          allTimeVolume: collection.volume?.allTime,
          floorAskPrice: collection.floorAsk?.price?.amount?.decimal,
          openseaVerificationStatus: collection.openseaVerificationStatus,
          chainName: chain.name.toLowerCase(),
          chainId: chain.id,
          chainIcon: chain.iconUrl,
        }
        return {
          type: 'collection',
          data: processedCollection,
        }
      })
    })

    let results = await Promise.allSettled(promises).then((results) =>
      results
        .filter(
          (result) => result.status === 'fulfilled' && result.value.length > 0
        )
        .flatMap((result) => (result as PromiseFulfilledResult<any>).value)
    )

    if (results.length > 0) {
      searchResults = results
    } else {
      let ensData = await fetch(
        `https://api.ensideas.com/ens/resolve/${query}`
      ).then((res) => res.json())
      searchResults = [
        {
          type: 'wallet',
          data: {
            ...ensData,
            address: query,
          },
        },
      ]
    }
  } else if (
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi.test(
      query as string
    )
  ) {
    let ensData = await fetch(
      `https://api.ensideas.com/ens/resolve/${query}`
    ).then((res) => res.json())

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
    // Get current usd prices for each chain
    const usdCoinPrices = await fetch(`${HOST_URL}/api/usdCoinConversion`).then(
      (res) => res.json()
    )

    const responses = await Promise.all(promises)
    responses.forEach((response, index) => {
      const chainSearchResults = response.data.collections.map(
        (collection: SearchCollection) => ({
          type: 'collection',
          data: {
            ...collection,
            chainName: supportedChains[index].name.toLowerCase(),
            chainId: supportedChains[index].id,
            chainIcon: supportedChains[index].iconUrl,
            allTimeUsdVolume:
              (collection.allTimeVolume &&
                collection.allTimeVolume *
                  usdCoinPrices?.prices?.[index]?.current_price) ||
              0,
          },
        })
      )
      searchResults = [...searchResults, ...chainSearchResults]
    })

    // Sort results by all time usd volume
    searchResults = searchResults.sort(
      (a, b) => b.data.allTimeUsdVolume - a.data.allTimeUsdVolume
    )
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

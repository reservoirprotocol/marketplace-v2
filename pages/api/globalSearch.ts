import { ethers } from 'ethers'
import fetcher from 'utils/fetcher'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  let searchResults = []

  let isAddress = ethers.utils.isAddress(q)

  if (isAddress) {
    let { data: collections } = await fetcher(`collections/v5?contract=${q}`)

    if (collections.length) {
      searchResults = [
        {
          type: 'collection',
          data: collections[0],
        },
      ]
    } else {
      let ensData = await fetch(
        `https://api.ensideas.com/ens/resolve/${q}`
      ).then((res) => res.json())
      https: searchResults = [
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
      q
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
    let { data: collections } = await fetcher(`collections/v5?name=${q}`)

    searchResults = collections.map((collection) => ({
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
      },
    }
  )
}

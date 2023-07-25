import * as tsImport from 'ts-import'

const usdFee = 1

tsImport.load('../utils/chains.ts').then(async ({ default: chains }) => {
  const ids = chains.reduce((ids, chain) => {
    ids.add(chain.coingeckoId)
    return ids
  }, new Set())
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=${Array.from(
      ids
    ).join(',')}`
  )
  const data = await response.json()

  const usdFees = data.reduce((usdFees, currency) => {
    usdFees[currency.id] = usdFee / currency.current_price
    return usdFees
  }, {})
  console.log(usdFees)
})

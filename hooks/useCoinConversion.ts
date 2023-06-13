import useSWR from 'swr'

export default function (
  vs_currency?: string,
  symbols: string = 'eth',
  ids: string = ''
): { id: string; symbol: string; price: number }[] {
  //CONFIGURABLE: Add your coingecko api key or change the url to hit a proxy to add your api key on the backend for increased protection
  const baseUrl = 'https://api.coingecko.com/api/v3/coins/markets?'

  const { data } = useSWR(
    vs_currency
      ? `${baseUrl}vs_currency=${vs_currency}&symbols=${symbols}&ids=${ids}`
      : null,
    null,
    {
      refreshInterval: 60 * 1000 * 60, //1hr Interval
    }
  )

  if (data) {
    const idsArray = ids.split(',')
    const symbolsArray = symbols.split(',')
    return data
      .sort((a: any, b: any) => {
        const aIndex =
          idsArray.length > 0
            ? idsArray.indexOf(a.id)
            : symbolsArray.indexOf(a.symbol)
        const bIndex =
          idsArray.length > 0
            ? idsArray.indexOf(b.id)
            : symbolsArray.indexOf(b.symbol)

        return aIndex - bIndex
      })
      .map((data: any) => ({
        id: data.id || '',
        symbol: data.symbol || '',
        price: data.current_price || 0,
      }))
  }
  return []
}

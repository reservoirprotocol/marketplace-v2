import { useState, createContext, FC, useEffect } from 'react'

type CachedReferrer = { referrer: string; date: string }

export const ReferralContext = createContext<{
  feesOnTop?: string[]
}>({
  feesOnTop: undefined,
})

const REFERRER_CACHE_KEY = 'reservoir.referrer'

const ReferralContextProvider: FC<any> = ({ children }) => {
  const [feesOnTop, setFeesOnTop] = useState<string[] | undefined>()

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_REFERRER) {
      setFeesOnTop(undefined)
      return
    }

    const params = new URL(window.location.href).searchParams
    let urlReferrer = params.get('referrer')
    let cachedReferrer: string | null | CachedReferrer =
      localStorage.getItem(REFERRER_CACHE_KEY)
    try {
      cachedReferrer = JSON.parse(cachedReferrer as string)
    } catch (e) {
      localStorage.removeItem(REFERRER_CACHE_KEY)
      console.warn('Removed corrupt referrer', e)
    }
    if (
      urlReferrer &&
      urlReferrer !== (cachedReferrer as CachedReferrer)?.referrer
    ) {
      localStorage.setItem(
        REFERRER_CACHE_KEY,
        JSON.stringify({
          referrer: urlReferrer,
          date: new Date().toISOString(),
        })
      )
    } else {
      urlReferrer = (cachedReferrer as CachedReferrer)?.referrer
    }

    const recipients = [process.env.NEXT_PUBLIC_REFERRER]
    if (urlReferrer) {
      recipients.push(urlReferrer)
    }
    //TODO figure out the fee
    const totalFee = 100
    setFeesOnTop(recipients.map((recipient) => `${recipient}:${totalFee / 2}`))
  }, [])

  return (
    <ReferralContext.Provider value={{ feesOnTop }}>
      {children}
    </ReferralContext.Provider>
  )
}

export default ReferralContextProvider

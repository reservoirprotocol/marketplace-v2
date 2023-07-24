import { useState, createContext, FC, useEffect } from 'react'

type CachedReferral = { code: string; date: string }

export const ReferralContext = createContext<{
  bpsFee?: string
}>({
  bpsFee: undefined,
})

const REFERRAL_CACHE_KEY = 'reservoir.referral'

const ReferralContextProvider: FC<any> = ({ children }) => {
  const [bpsFee, setBpsFee] = useState<string | undefined>(
    process.env.NEXT_PUBLIC_REFERRAL_FEE
  )

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_REFERRAL_FEE) {
      return
    }
    const explorerFeePieces = process.env.NEXT_PUBLIC_REFERRAL_FEE.split(':')

    const params = new URL(window.location.href).searchParams
    const urlReferralCode = params.get('referral')
    let cachedReferral: string | null | CachedReferral =
      localStorage.getItem(REFERRAL_CACHE_KEY)
    if (cachedReferral) {
      try {
        cachedReferral = JSON.parse(cachedReferral)
      } catch (e) {
        localStorage.removeItem(REFERRAL_CACHE_KEY)
        console.warn('Removed corrupted referral code', e)
      }
    }
    if (
      urlReferralCode &&
      urlReferralCode !== (cachedReferral as CachedReferral)?.code
    ) {
      localStorage.setItem(
        REFERRAL_CACHE_KEY,
        JSON.stringify({
          code: urlReferralCode,
          date: new Date().toISOString(),
        })
      )

      //api to fetch the fee from the server
      const referralDetails = {
        recipient: '0x03508bB71268BBA25ECaCC8F620e01866650532c',
        bps: 100,
      }
      if (referralDetails) {
      }
    }
    //check url for referral code
    //check localstorage for referral code validity
  }, [])

  return (
    <ReferralContext.Provider value={{ bpsFee }}>
      {children}
    </ReferralContext.Provider>
  )
}

export default ReferralContextProvider

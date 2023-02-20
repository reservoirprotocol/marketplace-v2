import React from 'react'
import { eligibleAddresses } from './utils'
import { basicFetcher } from 'utils/fetcher'

export default function useAirdropEligibleAddresses(address: string) {
  const [isEligible, setIsEligible] = React.useState(false)

  React.useEffect(() => {
    //call api to fetch all eligible addresses
    //
    // const ensResponse = await basicFetcher(
    //  `https://api.ensideas.com/ens/resolve/${address}`
    //  )
    // const eligibleAddresses = ensResponse?.data?.address
    //
    //
    if (eligibleAddresses.includes(address)) {
      setIsEligible(true)
    } else {
      setIsEligible(false)
    }
  }, [])

  return isEligible
}

import { FC, ReactElement, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { datadogRum } from '@datadog/browser-rum'

const env = process.env.NODE_ENV
const ddApplicationId = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID
const ddClientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN

type Props = {
  children: ReactElement
}

const AnalyticsProvider: FC<Props> = ({ children }) => {
  const accountData = useAccount()

  useEffect(() => {
    if (accountData) {
      datadogRum.setUser({
        id: accountData.address?.toLowerCase(),
      })
    }
  }, [accountData])

  useEffect(() => {
    if (typeof window !== 'undefined' && !datadogRum.getInitConfiguration()) {
      if (!ddApplicationId || !ddClientToken) return

      datadogRum.init({
        applicationId: ddApplicationId,
        clientToken: ddClientToken,
        site: 'datadoghq.com',
        service: 'reservoir-marketplace',
        env,
        sampleRate: 100,
        replaySampleRate: 100,
        trackInteractions: true,
        trackFrustrations: true,
        trackResources: true,
        defaultPrivacyLevel: 'mask-user-input',
      })

      datadogRum.startSessionReplayRecording()
    }
  }, [])

  return children
}

export default AnalyticsProvider

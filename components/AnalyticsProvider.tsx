import { FC, ReactElement, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { datadogRum } from '@datadog/browser-rum'
import posthog from 'posthog-js'

const env = process.env.NODE_ENV
const ddApplicationId = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID
const ddClientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN
const posthogClientToken = process.env.NEXT_PUBLIC_POSTHOG_CLIENT_TOKEN

type Props = {
  children: ReactElement
}

export const initializeAnalytics = () => {
  if (typeof window !== 'undefined' && !datadogRum.getInitConfiguration()) {
    if (ddApplicationId && ddClientToken) {
      datadogRum.init({
        applicationId: ddApplicationId,
        clientToken: ddClientToken,
        site: 'datadoghq.com',
        //CONFIGURABLE: Change the service name to customize how it appears in your DD dashboard
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
  }

  if (typeof window !== 'undefined' && posthogClientToken) {
    posthog.init(posthogClientToken, {
      api_host: 'https://app.posthog.com',
      disable_session_recording: true,
      mask_all_text: false,
      mask_all_element_attributes: false,
    })

    const randomNumber = Math.random()
    const samplingRate = 0.3
    if (randomNumber <= samplingRate) {
      posthog.startSessionRecording()
    }
  }
}

const AnalyticsProvider: FC<Props> = ({ children }) => {
  const accountData = useAccount()

  useEffect(() => {
    const address = accountData?.address?.toLowerCase()
    if (address) {
      datadogRum.setUser({
        id: address,
      })
      if (posthogClientToken) {
        posthog.identify(address)
      }
    }
  }, [accountData])

  return children
}

export default AnalyticsProvider

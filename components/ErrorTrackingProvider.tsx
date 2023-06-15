import * as Sentry from '@sentry/nextjs'

import { FC, ReactElement, useEffect } from 'react'
import { useAccount } from 'wagmi'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

type Props = {
  children: ReactElement
}

const ErrorTrackingProvider: FC<Props> = ({ children }) => {
  const { address } = useAccount()

  useEffect(() => {
    if (!SENTRY_DSN) {
      return
    }

    if (address) {
      Sentry.setUser({ id: address })
    } else {
      Sentry.setUser(null)
    }
  }, [address])

  return children
}

export default ErrorTrackingProvider

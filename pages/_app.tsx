import { Inter } from '@next/font/google'
import type { AppContext, AppProps } from 'next/app'
import { default as NextApp } from 'next/app'
import { ThemeProvider, useTheme } from 'next-themes'
import { darkTheme, globalReset } from 'stitches.config'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import * as Tooltip from '@radix-ui/react-tooltip'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import {
  ReservoirKitProvider,
  darkTheme as reservoirDarkTheme,
  lightTheme as reservoirLightTheme,
  ReservoirKitTheme,
  CartProvider
} from '@nftearth/reservoir-kit-ui'
import { FC, useEffect, useState } from 'react'
import { HotkeysProvider } from 'react-hotkeys-hook'
import ToastContextProvider from 'context/ToastContextProvider'
import supportedChains from 'utils/chains'
import {useMarketplaceChain, useMounted} from 'hooks'
import ChainContextProvider from 'context/ChainContextProvider'
import AnalyticsProvider from 'components/AnalyticsProvider'
import Head from "next/head";

//CONFIGURABLE: Use nextjs to load your own custom font: https://nextjs.org/docs/basic-features/font-optimization
const inter = Inter({
  subsets: ['latin'],
})

export const NORMALIZE_ROYALTIES = process.env.NEXT_PUBLIC_NORMALIZE_ROYALTIES
  ? process.env.NEXT_PUBLIC_NORMALIZE_ROYALTIES === 'true'
  : false

export const COLLECTION_SET_ID = process.env.NEXT_PUBLIC_COLLECTION_SET_ID
  ? process.env.NEXT_PUBLIC_COLLECTION_SET_ID
  : undefined

export const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY
  ? process.env.NEXT_PUBLIC_COMMUNITY
  : undefined

const FEE_BPS = process.env.NEXT_PUBLIC_FEE_BPS
const FEE_RECIPIENT = process.env.NEXT_PUBLIC_FEE_RECIPIENT

const { chains, provider } = configureChains(supportedChains, [
  alchemyProvider({
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM_ID as string,
    priority: 0
  }),
  publicProvider({
    priority: 1
  }),
], {
  stallTimeout: 10_000
})

const { connectors } = getDefaultClient({
  appName: 'NFTEarth Exchange',
  appIcon: 'https://nftearth.exchange/nftearth-icon-new.png',
  alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM_ID,
  walletConnectOptions: {
    projectId: '5dd18f61f54044c53f0e1ea9d1829b08',
    version: "2"
  },
  stallTimeout: 10_000,
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors: connectors,
  provider,
})

//CONFIGURABLE: Here you can override any of the theme tokens provided by RK: https://docs.reservoir.tools/docs/reservoir-kit-theming-and-customization
const reservoirKitThemeOverrides = {
  headlineFont: inter.style.fontFamily,
  font: inter.style.fontFamily,
  buttonTextColor: '#000',
  buttonTextHoverColor: '#000',
  primaryColor: '#47FF88',
  primaryHoverColor: '#7AFFA9',
}

function AppWrapper(props: AppProps & { baseUrl: string }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      value={{
        dark: darkTheme.className,
        light: 'light',
      }}
    >
      <WagmiConfig client={wagmiClient}>
        <ChainContextProvider>
          <AnalyticsProvider>
            <MyApp {...props} />
          </AnalyticsProvider>
        </ChainContextProvider>
      </WagmiConfig>
    </ThemeProvider>
  )
}

function MyApp({
  Component,
  pageProps,
  baseUrl,
}: AppProps & { baseUrl: string }) {
  globalReset()

  const { theme } = useTheme()
  const marketplaceChain = useMarketplaceChain()
  const isMounted = useMounted()
  const [reservoirKitTheme, setReservoirKitTheme] = useState<
    ReservoirKitTheme | undefined
  >()

  useEffect(() => {
    if (theme === 'dark') {
      setReservoirKitTheme(reservoirDarkTheme(reservoirKitThemeOverrides))
    } else {
      setReservoirKitTheme(reservoirLightTheme(reservoirKitThemeOverrides))
    }
  }, [theme])

  const FunctionalComponent = Component as FC

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>L2 NFT Marketplace</title>
      </Head>
      <HotkeysProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          value={{
            dark: darkTheme.className,
            light: 'light',
          }}
        >
          <ReservoirKitProvider
            options={{
              //CONFIGURABLE: Override any configuration available in RK: https://docs.reservoir.tools/docs/reservoirkit-ui#configuring-reservoirkit-ui
              // Note that you should at the very least configure the source with your own domain
              chains: supportedChains.map(({ proxyApi, id }) => {
                return {
                  id,
                  baseApiUrl: `${baseUrl}${proxyApi}`,
                  default: marketplaceChain.id === id,
                }
              }),
              disablePoweredByReservoir: true,
              marketplaceFee: +`${FEE_BPS || 0}`,
              marketplaceFeeRecipient: FEE_RECIPIENT,
              source: 'nftearth.exchange',
              normalizeRoyalties: NORMALIZE_ROYALTIES,
            }}
            theme={reservoirKitTheme}
          >
            <CartProvider>
              <Tooltip.Provider>
                <ConnectKitProvider
                  mode={theme == 'dark' ? 'dark' : 'light'}
                  options={{ initialChainId: 0 }}
                >
                  <ToastContextProvider>
                    <FunctionalComponent {...pageProps} />
                  </ToastContextProvider>
                  {(marketplaceChain.id === 137 && isMounted) && (
                    <div>
                      <p>Important: Full synchronization of blockchain data for collections is ongoing, and NFT Collections may not reflect real-time data.</p>
                      <style jsx>{`
                        p {
                          position: fixed;
                          top: 110px;
                          left: 10px;
                          padding: 10px;
                          background: #fff;
                          color: orange;
                          font-size: small;
                          width: 300px;
                          border-radius: 10px;
                          text-align: center;
                        }
                      `}
                      </style>
                    </div>
                  )}
                </ConnectKitProvider>
              </Tooltip.Provider>
            </CartProvider>
          </ReservoirKitProvider>
        </ThemeProvider>
      </HotkeysProvider>
    </>
  )
}

AppWrapper.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await NextApp.getInitialProps(appContext)
  let baseUrl = ''

  if (appContext.ctx.req?.headers.host) {
    const host = appContext.ctx.req?.headers.host
    baseUrl = `${host.includes('localhost') ? 'http' : 'https'}://${host}`
  } else if (process.env.NEXT_PUBLIC_HOST_URL) {
    baseUrl = process.env.NEXT_PUBLIC_HOST_URL || ''
  }
  baseUrl = baseUrl.replace(/\/$/, '')

  return { ...appProps, baseUrl }
}

export default AppWrapper

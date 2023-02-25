import { Inter } from '@next/font/google'
import type { AppContext, AppProps } from 'next/app'
import { default as NextApp } from 'next/app'
import { ThemeProvider, useTheme } from 'next-themes'
import { darkTheme, globalReset } from 'stitches.config'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import * as Tooltip from '@radix-ui/react-tooltip'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { alchemyProvider } from 'wagmi/providers/alchemy'

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
  jsonRpcProvider({ rpc: (chain) => {
    let subDomain = 'opt-mainnet'
    let apiKey = process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM_ID;
    switch (chain.id) {
      case 42161:
        subDomain = 'arb-mainnet'
        apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_ID;
        break;
      case 10:
        subDomain = 'opt-mainnet'
        apiKey = process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM_ID;
        break;
    }

    return {
      http: `https://${subDomain}.g.alchemy.com/v2/${apiKey}`,
      webSocket: `wss://${subDomain}.g.alchemy.com/v2/${apiKey}`
    }
  }, priority: 0})
])

const { connectors } = getDefaultClient({
  appName: 'NFTEarth Exchange',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

//CONFIGURABLE: Here you can override any of the theme tokens provided by RK: https://docs.reservoir.tools/docs/reservoir-kit-theming-and-customization
const reservoirKitThemeOverrides = {
  headlineFont: inter.style.fontFamily,
  font: inter.style.fontFamily,
  primaryColor: '#79ffa8',
  primaryHoverColor: '#644fc1',
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
    if (theme == 'dark') {
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
                  options={{ initialChainId: 10 }}
                >
                  <ToastContextProvider>
                    <FunctionalComponent {...pageProps} />
                  </ToastContextProvider>
                  {(marketplaceChain.id === 42161 && isMounted) && (
                    <div>
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

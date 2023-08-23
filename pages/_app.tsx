import AnalyticsProvider, {
  initializeAnalytics,
} from 'components/AnalyticsProvider'
import ErrorTrackingProvider from 'components/ErrorTrackingProvider'
initializeAnalytics()

import localFont from '@next/font/local'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import {
  CartProvider,
  ReservoirKitProvider,
  ReservoirKitTheme,
} from '@reservoir0x/reservoir-kit-ui'
import ChainContextProvider from 'context/ChainContextProvider'
import ReferralContextProvider, {
  ReferralContext,
} from 'context/ReferralContextProvider'
import ToastContextProvider from 'context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'
import { ThemeProvider, useTheme } from 'next-themes'
import type { AppContext, AppProps } from 'next/app'
import { default as NextApp } from 'next/app'
import { LoreCheckout } from 'plugins/lore/LoreCheckout'
import { FC, useContext, useEffect, useState } from 'react'
import { HotkeysProvider } from 'react-hotkeys-hook'
import { darkTheme, globalReset, loreTheme } from 'stitches.config'
import supportedChains from 'utils/chains'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

//CONFIGURABLE: Use nextjs to load your own custom font: https://nextjs.org/docs/basic-features/font-optimization
const Aeonik = localFont({
  src: [
    {
      path: '../public/fonts/NewBrandFonts/Aeonik-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/NewBrandFonts/Aeonik-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/NewBrandFonts/Aeonik-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})

export const NORMALIZE_ROYALTIES = process.env.NEXT_PUBLIC_NORMALIZE_ROYALTIES
  ? process.env.NEXT_PUBLIC_NORMALIZE_ROYALTIES === 'true'
  : false

const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const { chains, publicClient } = configureChains(supportedChains, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
  publicProvider(),
])

const { connectors } = getDefaultWallets({
  appName: 'Reservoir NFT Explorer',
  projectId: '6345629da20a38f9d80b64bb7a1fd93d',
  chains,
})

const wagmiClient = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

// Replaced with Lore colors
// As a note, these can't actually grab the stitches theme variables (sand1, red1, primary1), so they'll have to be replaced with the loreTheme.XXX variables
const loreLightTheme: ReservoirKitTheme = {
  radii: {
    borderRadius: '4px',
  },
  fonts: {
    body: Aeonik.style.fontFamily,
    button: Aeonik.style.fontFamily,
    headline: Aeonik.style.fontFamily,
  },
  assets: {
    ethIcon: 'gray',
  },
  colors: {
    // accent colors
    accentBase: '$brown1',
    accentBgSubtle: '$brown2',
    accentBg: '$brown3',
    accentBgHover: '$brown4',
    accentBgActive: '$brown5',
    accentLine: '$brown6',
    accentBorder: '$brown7',
    accentBorderHover: '$brown8',
    accentSolid: '$brown9',
    accentSolidHover: '$brown10',
    accentText: '$brown11',
    accentTextContrast: '$brown12',

    // neutral colors -> Replaced with Lore colors
    neutralBase: '$sand1',
    neutralBgSubtle: 'white',
    neutralBg: '$sand3',
    neutralBgHover: '$sand2',
    neutralBgActive: '$sand5',
    neutralLine: '$sand6',
    neutralBorder: '$sand7',
    neutralBorderHover: '$sand8',
    neutralSolid: '$sand9',
    neutralSolidHover: '$sand10',
    neutralText: '$sand11',
    neutralTextContrast: '$sand12',

    // secondary colors
    secondaryBase: '$brownA1',
    secondaryBgSubtle: '$brownA2',
    secondaryBg: '$brownA3',
    secondaryBgHover: '$brownA4',
    secondaryBgActive: '$brownA5',
    secondaryLine: '$brownA6',
    secondaryBorder: '$brownA7',
    secondaryBorderHover: '$brownA8',
    secondarySolid: '$brownA9',
    secondarySolidHover: '$brownA10',
    secondaryText: '$brownA11',
    secondaryTextContrast: '$brownA12',

    // general colors
    borderColor: '$neutralBorder',
    textColor: '$neutralTextContrast',
    focusColor: '$neutralTextContrast',
    errorText: '$red12',
    errorAccent: '$red10',
    successAccent: '$green10',

    // component colors
    reservoirLogoColor: '#11181C',
    buttonTextColor: 'white',
    buttonTextHoverColor: 'white',
    inputBackground: '$neutralBgHover',
    overlayBackground: '$blackA10',
    headerBackground: '$neutralBgHover',
    footerBackground: '$neutralBgHover',
    contentBackground: '$neutralBgSubtle',
    wellBackground: '$sand3',
    popoverBackground: '$neutralBase',
  },
}

// -> Replaced with Lore colors
const loreDarkTheme: ReservoirKitTheme = {
  radii: {
    borderRadius: '4px',
  },
  fonts: {
    body: Aeonik.style.fontFamily,
    button: Aeonik.style.fontFamily,
    headline: Aeonik.style.fontFamily,
  },
  assets: {
    ethIcon: 'purple',
  },
  colors: {
    // accent colors
    accentBase: '$brown1',
    accentBgSubtle: '$brown2',
    accentBg: '$brown3',
    accentBgHover: '$brown4',
    accentBgActive: '$brown5',
    accentLine: '$brown6',
    accentBorder: '$brown7',
    accentBorderHover: '$brown8',
    accentSolid: '$brown9',
    accentSolidHover: '$brown10',
    accentText: '$brown11',
    accentTextContrast: '$brown12',

    // neutral colors
    neutralBase: '$slate1',
    neutralBgSubtle: '$slate2',
    neutralBg: '$slate3',
    neutralBgHover: '$slate4',
    neutralBgActive: '$slate5',
    neutralLine: '$slate6',
    neutralBorder: '$slate7',
    neutralBorderHover: '$slate8',
    neutralSolid: '$slate9',
    neutralSolidHover: '$slate10',
    neutralText: '$slate11',
    neutralTextContrast: '$slate12',

    // secondary colors
    secondaryBase: '$brownA1',
    secondaryBgSubtle: '$brownA2',
    secondaryBg: '$brownA3',
    secondaryBgHover: '$brownA4',
    secondaryBgActive: '$brownA5',
    secondaryLine: '$brownA6',
    secondaryBorder: '$brownA7',
    secondaryBorderHover: '$brownA8',
    secondarySolid: '$brownA9',
    secondarySolidHover: '$brownA10',
    secondaryText: '$brownA11',
    secondaryTextContrast: '$brownA12',

    // general colors
    borderColor: '$neutralBorder',
    textColor: '$neutralTextContrast',
    focusColor: '$neutralTextContrast',
    errorText: '$red12',
    errorAccent: '$red10',
    successAccent: '$green10',

    // component colors
    reservoirLogoColor: '#ECEDEE',
    inputBackground: '$neutralBgHover',
    buttonTextColor: 'white',
    buttonTextHoverColor: 'white',
    overlayBackground: '$blackA10',
    headerBackground: '$neutralBgHover',
    footerBackground: '$neutralBg',
    contentBackground: loreTheme.Gray900,
    wellBackground: '$neutralBase',
    popoverBackground: '$neutralBgActive',
  },
}

//CONFIGURABLE: Here you can override any of the theme tokens provided by RK: https://docs.reservoir.tools/docs/reservoir-kit-theming-and-customization
const reservoirKitThemeOverrides = {
  headlineFont: Aeonik.style.fontFamily,
  font: Aeonik.style.fontFamily,
  primaryColor: '#6E56CB',
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
      <WagmiConfig config={wagmiClient}>
        <ChainContextProvider>
          <AnalyticsProvider>
            <ErrorTrackingProvider>
              <ReferralContextProvider>
                <MyApp {...props} />
              </ReferralContextProvider>
            </ErrorTrackingProvider>
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
  const [reservoirKitTheme, setReservoirKitTheme] = useState<
    ReservoirKitTheme | undefined
  >()

  const [rainbowKitTheme, setRainbowKitTheme] = useState<
    | ReturnType<typeof rainbowDarkTheme>
    | ReturnType<typeof rainbowLightTheme>
    | undefined
  >()

  useEffect(() => {
    if (theme == 'dark') {
      setReservoirKitTheme(loreDarkTheme)
      setRainbowKitTheme(
        rainbowDarkTheme({
          borderRadius: 'small',
        })
      )
    } else {
      setReservoirKitTheme(loreLightTheme)
      setRainbowKitTheme(
        rainbowLightTheme({
          borderRadius: 'small',
        })
      )
    }
  }, [theme])
  const { feesOnTop } = useContext(ReferralContext)

  const FunctionalComponent = Component as FC

  let source = process.env.NEXT_PUBLIC_MARKETPLACE_SOURCE

  if (!source && process.env.NEXT_PUBLIC_HOST_URL) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_HOST_URL)
      source = url.host
    } catch (e) {}
  }

  return (
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
                active: marketplaceChain.id === id,
              }
            }),
            logLevel: 4,
            source: source,
            normalizeRoyalties: NORMALIZE_ROYALTIES,
            //CONFIGURABLE: Set your marketplace fee and recipient, (fee is in BPS)
            // Note that this impacts orders created on your marketplace (offers/listings)
            // marketplaceFee: 250,
            // marketplaceFeeRecipient: "0xabc"
          }}
          theme={reservoirKitTheme}
        >
          <CartProvider feesOnTopUsd={feesOnTop}>
            <Tooltip.Provider>
              <RainbowKitProvider
                chains={chains}
                theme={rainbowKitTheme}
                modalSize="compact"
              >
                <ToastContextProvider>
                  <FunctionalComponent {...pageProps} />
                  <LoreCheckout />
                </ToastContextProvider>
              </RainbowKitProvider>
            </Tooltip.Provider>
          </CartProvider>
        </ReservoirKitProvider>
      </ThemeProvider>
    </HotkeysProvider>
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

import AnalyticsProvider, {
  initializeAnalytics,
} from 'components/AnalyticsProvider'
import ErrorTrackingProvider from 'components/ErrorTrackingProvider'
initializeAnalytics()

import localFont from '@next/font/local'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
  darkTheme as rainbowDarkTheme,
  getDefaultWallets,
  lightTheme as rainbowLightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import {
  CartProvider,
  ReservoirKitProvider,
  ReservoirKitTheme,
} from '@reservoir0x/reservoir-kit-ui'
import ChainContextProvider from 'context/ChainContextProvider'
import ToastContextProvider from 'context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'
import { ThemeProvider, useTheme } from 'next-themes'
import type { AppContext, AppProps } from 'next/app'
import { default as NextApp } from 'next/app'
import { LoreCheckout } from 'plugins/lore/LoreCheckout'
import { FC, useEffect, useState } from 'react'
import { HotkeysProvider } from 'react-hotkeys-hook'
import { darkTheme, globalReset, loreTheme } from 'stitches.config'
import supportedChains from 'utils/chains'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
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

const { chains, publicClient } = configureChains(supportedChains, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
  publicProvider(),
])

const { connectors } = getDefaultWallets({
  appName: 'Reservoir Marketplace',
  chains,
})

const wagmiClient = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

// @Irwin This replaces the light theme for modals
// As a note, these can't actually grab the stitches theme variables (gray1, red1, primary1), so you'll have to replace them with the loreTheme.XXX variables
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
    accentBase: '$indigo1',
    accentBgSubtle: '$indigo2',
    accentBg: '$indigo3',
    accentBgHover: '$indigo4',
    accentBgActive: '$indigo5',
    accentLine: '$indigo6',
    accentBorder: '$indigo7',
    accentBorderHover: '$indigo8',
    accentSolid: '$indigo9',
    accentSolidHover: '$indigo10',
    accentText: '$indigo11',
    accentTextContrast: '$indigo12',

    // neutral colors
    neutralBase: loreTheme.Gray100, //  @Irwin this is an example of how to replace with our lore colors
    neutralBgSubtle: 'white',
    neutralBg: '$gray3',
    neutralBgHover: '$gray2',
    neutralBgActive: '$gray5',
    neutralLine: '$gray6',
    neutralBorder: '$gray7',
    neutralBorderHover: '$gray8',
    neutralSolid: '$gray9',
    neutralSolidHover: '$gray10',
    neutralText: '$gray11',
    neutralTextContrast: '$gray12',

    // secondary colors
    secondaryBase: '$indigoA1',
    secondaryBgSubtle: '$indigoA2',
    secondaryBg: '$indigoA3',
    secondaryBgHover: '$indigoA4',
    secondaryBgActive: '$indigoA5',
    secondaryLine: '$indigoA6',
    secondaryBorder: '$indigoA7',
    secondaryBorderHover: '$indigoA8',
    secondarySolid: '$indigoA9',
    secondarySolidHover: '$indigoA10',
    secondaryText: '$indigoA11',
    secondaryTextContrast: '$indigoA12',

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
    wellBackground: '$gray3',
    popoverBackground: '$neutralBase',
  },
}

// @Irwin This replaces the dark theme for modals
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
    accentBase: '$indigo1',
    accentBgSubtle: '$indigo2',
    accentBg: '$indigo3',
    accentBgHover: '$indigo4',
    accentBgActive: '$indigo5',
    accentLine: '$indigo6',
    accentBorder: '$indigo7',
    accentBorderHover: '$indigo8',
    accentSolid: '$indigo9',
    accentSolidHover: '$indigo10',
    accentText: '$indigo11',
    accentTextContrast: '$indigo12',

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
    secondaryBase: '$indigoA1',
    secondaryBgSubtle: '$indigoA2',
    secondaryBg: '$indigoA3',
    secondaryBgHover: '$indigoA4',
    secondaryBgActive: '$indigoA5',
    secondaryLine: '$indigoA6',
    secondaryBorder: '$indigoA7',
    secondaryBorderHover: '$indigoA8',
    secondarySolid: '$indigoA9',
    secondarySolidHover: '$indigoA10',
    secondaryText: '$indigoA11',
    secondaryTextContrast: '$indigoA12',

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
              <MyApp {...props} />
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
          <CartProvider>
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

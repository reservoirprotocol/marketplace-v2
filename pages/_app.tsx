import 'fonts/inter.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, useTheme } from 'next-themes'
import { darkTheme, globalReset } from 'stitches.config'
import '@rainbow-me/rainbowkit/styles.css'
import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
} from '@rainbow-me/rainbowkit'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import * as allChains from 'wagmi/chains'
import * as Tooltip from '@radix-ui/react-tooltip'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import {
  ReservoirKitProvider,
  darkTheme as reservoirDarkTheme,
  lightTheme as reservoirLightTheme,
  ReservoirKitTheme,
} from '@reservoir0x/reservoir-kit-ui'
import { FC, useEffect, useState } from 'react'
import { HotkeysProvider } from 'react-hotkeys-hook'

const envChain = Object.values(allChains).find(
  (chain) =>
    chain.id === +(process.env.NEXT_PUBLIC_CHAIN_ID || allChains.mainnet.id)
)

const { chains, provider } = configureChains(
  envChain ? [envChain] : [allChains.mainnet],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'Reservoir Hub',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const reservoirKitThemeOverrides = {
  headlineFont: 'Inter',
  font: 'Inter',
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
      <MyApp {...props} />
    </ThemeProvider>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  globalReset()

  const { theme } = useTheme()

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
      setReservoirKitTheme(reservoirDarkTheme(reservoirKitThemeOverrides))
      setRainbowKitTheme(
        rainbowDarkTheme({
          borderRadius: 'small',
        })
      )
    } else {
      setReservoirKitTheme(reservoirLightTheme(reservoirKitThemeOverrides))
      setRainbowKitTheme(
        rainbowLightTheme({
          borderRadius: 'small',
        })
      )
    }
  }, [theme])

  const FunctionalComponent = Component as FC

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
        <WagmiConfig client={wagmiClient}>
          <ReservoirKitProvider
            options={{
              apiBase: process.env.NEXT_PUBLIC_RESERVOIR_API_BASE as string,
              apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
              source: 'reservoir.hub',
            }}
            theme={reservoirKitTheme}
          >
            <Tooltip.Provider>
              <RainbowKitProvider
                chains={chains}
                theme={rainbowKitTheme}
                modalSize="compact"
              >
                <FunctionalComponent {...pageProps} />
              </RainbowKitProvider>
            </Tooltip.Provider>
          </ReservoirKitProvider>
        </WagmiConfig>
      </ThemeProvider>
    </HotkeysProvider>
  )
}

export default AppWrapper

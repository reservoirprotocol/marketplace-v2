import 'fonts/inter.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { darkTheme, globalStyles } from 'stitches.config'
import StyledSwitch from 'components/primitives/StyledSwitch'

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles()
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      value={{
        dark: darkTheme.className,
        light: 'light',
      }}
    >
      <Component {...pageProps} />
      <StyledSwitch />
    </ThemeProvider>
  )
}

export default MyApp

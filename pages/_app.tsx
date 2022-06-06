import 'fonts/inter.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { darkTheme, globalStyles } from 'stitches.config'
import useSearchCollections from 'hooks/useSearchCollections'

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles()
  const searchCollections = useSearchCollections()

  console.log(searchCollections.data.data.schema.collections)
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      value={{
        dark: darkTheme.className,
        light: 'light',
      }}
    >
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp

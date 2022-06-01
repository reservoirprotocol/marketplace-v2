import 'fonts/inter.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { darkTheme, globalStyles } from 'stitches.config'
import Button from 'components/primitives/Button'
import { Dialog } from 'components/primitives/Dialog'

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles()
  const trigger = <Button>Open Modal</Button>
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
      <Dialog trigger={trigger}>
        <div>This is a test modal</div>
      </Dialog>
    </ThemeProvider>
  )
}

export default MyApp

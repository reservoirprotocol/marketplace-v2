import { Box, Toast } from 'components/primitives'
import Head from 'next/head'
import { FC, ReactNode, useContext } from 'react'
import Navbar from './navbar'
import { ToastContext } from '../context/ToastContextProvider'

type Props = {
  title?: string
  keywords?: string
  description?: string
  favicon?: string
  twitterImage?: string
  twitterSiteDomain?: string
  twitterUrl?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterSite?: string
  ogTitle?: string
  ogDescription?: string
  ogSiteName?: string
  ogUrl?: string
  ogImage?: string
  ogImageAlt?: string
  children: ReactNode
}

const Layout: FC<Props> = ({
  title = 'Reservoir Hub',
  keywords = 'Reservoir, API, Marketplace, NFT',
  description = 'Discover, Buy, and Sell NFTs',
  favicon = '/favicon.ico',
  twitterImage,
  twitterSiteDomain,
  twitterUrl,
  twitterTitle = 'Reservoir',
  twitterDescription = 'Reservoir',
  twitterSite,
  ogTitle = 'Reservoir',
  ogDescription = 'Reservoir',
  ogSiteName = 'Reservoir',
  ogUrl,
  ogImage,
  ogImageAlt = 'Reservoir',
  children,
}) => {
  const { toasts } = useContext(ToastContext)

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="keywords" content={keywords} />
        <meta name="description" content={description} />
        <link rel="shortcut icon" type="image/svg" href={favicon} />
        {/* Twitter */}
        {/* The optimal size is 1200 x 630 (1.91:1 ratio). */}
        <meta name="twitter:image" content={twitterImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site:domain" content={twitterSiteDomain} />
        <meta name="twitter:url" content={twitterUrl} />
        {/* should be between 30-60 characters, with a maximum of 70 */}
        <meta name="twitter:title" content={twitterTitle} />
        {/* should be between 55 and 200 characters long */}
        <meta name="twitter:description" content={twitterDescription} />
        <meta name="twitter:site" content={twitterSite} />

        {/* OG - https://ogp.me/ */}
        {/* https://www.opengraph.xyz/ */}
        {/* should be between 30-60 characters, with a maximum of 90 */}
        <meta name="og:title" content={ogTitle} />
        <meta property="og:type" content="website" />
        <meta property="og:determiner" content="the" />
        <meta property="og:locale" content="en" />
        {/* Make sure the important part of your description is within the first 110 characters, so it doesn't get cut off on mobile. */}
        <meta property="og:description" content={ogDescription} />
        <meta property="og:site_name" content={ogSiteName} />
        <meta property="og:url" content={ogUrl} />
        {/* The optimal size is 1200 x 630 (1.91:1 ratio). */}
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />
        <meta property="og:image:alt" content={`${ogImageAlt} banner`} />
      </Head>

      <Box
        css={{
          background: '$neutralBg',
          height: '100%',
          minHeight: '100vh',
          pt: 80,
        }}
      >
        <Navbar />

        <main>{children}</main>
        {toasts.map((toast, idx) => {
          return (
            <Toast
              key={idx}
              title={toast.title}
              description={toast.description}
              action={toast.action}
            />
          )
        })}
      </Box>
    </>
  )
}

export default Layout

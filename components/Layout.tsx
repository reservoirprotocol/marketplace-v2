import Head from 'next/head'
import { FC } from 'react'

type Props = {
  title?: string
}

const Layout: FC<Props> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main>{children}</main>
    </>
  )
}

export default Layout

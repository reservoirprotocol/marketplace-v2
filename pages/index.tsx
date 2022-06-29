import Layout from 'components/Layout'
import { NextPage } from 'next'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const IndexPage: NextPage = () => (
  <Layout title="Hello World!">
    <ConnectButton />
  </Layout>
)

export default IndexPage

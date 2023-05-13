import { NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'

const AuraDomains: NextPage = () => {
    return (
        <Layout>
            <Flex
                direction="column"
                align="center"
                css={{ py: '200px', px: '$3', textAlign: 'center' }}
            >
                {/*
                <Text style="h1" as="h1">
                    Aura Domain Service
                    <br />
                    <Text style="body1" css={{ mb: 48 }}>
                        Secure your Aura domain now!
                    </Text>
                </Text>
    */}
                <iframe
                    src="https://domains-aura.netlify.app/"
                    width="1920px"
                    height="800px"
                ></iframe>
            </Flex>
        </Layout>
    )
}

export default AuraDomains

import { NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'

const Mint: NextPage = () => {
    return (
        <Layout>
            <Flex
                direction="column"
                align="center"
                css={{ py: '200px', px: '$3', textAlign: 'center' }}
            >
                <Text style="h1" as="h1">
                    Aura Membership Pass
                    <br />
                    <Text style="body1" css={{ mb: 48 }}>
                        Ethereum
                    </Text>
                </Text>
                <iframe
                    src="https://ipfs.thirdwebcdn.com/ipfs/QmfK9mw9eQKE9vCbtZht9kygpkNWffdwibsJPnCo7MBN4M/erc1155.html?contract=0x7b4B550d6cbf55441f6153c71A5D173d860d83fE&chain=%7B%22name%22%3A%22Ethereum+Mainnet%22%2C%22chain%22%3A%22ETH%22%2C%22rpc%22%3A%5B%22https%3A%2F%2Fethereum.rpc.thirdweb.com%2F5a9bc94b87f7cbbbfbbc234bf1e07f0adf5f3cf3012c9f26f9fc9820d64df93a%22%5D%2C%22nativeCurrency%22%3A%7B%22name%22%3A%22Ether%22%2C%22symbol%22%3A%22ETH%22%2C%22decimals%22%3A18%7D%2C%22shortName%22%3A%22eth%22%2C%22chainId%22%3A1%2C%22testnet%22%3Afalse%2C%22slug%22%3A%22ethereum%22%7D&tokenId=3&theme=dark"
                    width="600px"
                    height="600px"
                ></iframe>
                <br />
                <Text style="body1" css={{ mb: 48 }}>
                    Polygon
                </Text>
                <iframe
                    src="https://ipfs.thirdwebcdn.com/ipfs/QmfK9mw9eQKE9vCbtZht9kygpkNWffdwibsJPnCo7MBN4M/erc1155.html?contract=0x76DCE039661036f47A8806688d4BF7bA2db34420&chain=%7B%22name%22%3A%22Polygon+Mainnet%22%2C%22chain%22%3A%22Polygon%22%2C%22rpc%22%3A%5B%22https%3A%2F%2Fpolygon.rpc.thirdweb.com%2F5a9bc94b87f7cbbbfbbc234bf1e07f0adf5f3cf3012c9f26f9fc9820d64df93a%22%5D%2C%22nativeCurrency%22%3A%7B%22name%22%3A%22MATIC%22%2C%22symbol%22%3A%22MATIC%22%2C%22decimals%22%3A18%7D%2C%22shortName%22%3A%22matic%22%2C%22chainId%22%3A137%2C%22testnet%22%3Afalse%2C%22slug%22%3A%22polygon%22%7D&tokenId=0&theme=dark"
                    width="600px"
                    height="600px"
                ></iframe>
                <br />
                <Text style="body1" css={{ mb: 48 }}>
                    Phoenix
                </Text>
                <iframe
                    src="https://ipfs.thirdwebcdn.com/ipfs/QmfK9mw9eQKE9vCbtZht9kygpkNWffdwibsJPnCo7MBN4M/erc1155.html?contract=0x7Bb78c39514d8d8720e380493ac367DD4D5b03A0&chain=%7B%22name%22%3A%22Phoenix+Mainnet%22%2C%22chain%22%3A%22Phoenix%22%2C%22rpc%22%3A%5B%22https%3A%2F%2Fphoenix.rpc.thirdweb.com%2F5a9bc94b87f7cbbbfbbc234bf1e07f0adf5f3cf3012c9f26f9fc9820d64df93a%22%5D%2C%22nativeCurrency%22%3A%7B%22name%22%3A%22Phoenix%22%2C%22symbol%22%3A%22PHX%22%2C%22decimals%22%3A18%7D%2C%22shortName%22%3A%22Phoenix%22%2C%22chainId%22%3A13381%2C%22testnet%22%3Afalse%2C%22slug%22%3A%22phoenix%22%7D&tokenId=0&theme=dark"
                    width="600px"
                    height="600px"
                ></iframe>
                <br />
                <Text style="body1" css={{ mb: 48 }}>
                    Binance Smart Chain
                </Text>
                <iframe
                    src="https://ipfs.thirdwebcdn.com/ipfs/QmfK9mw9eQKE9vCbtZht9kygpkNWffdwibsJPnCo7MBN4M/erc1155.html?contract=0x76DCE039661036f47A8806688d4BF7bA2db34420&chain=%7B%22name%22%3A%22Polygon+Mainnet%22%2C%22chain%22%3A%22Polygon%22%2C%22rpc%22%3A%5B%22https%3A%2F%2Fpolygon.rpc.thirdweb.com%2F5a9bc94b87f7cbbbfbbc234bf1e07f0adf5f3cf3012c9f26f9fc9820d64df93a%22%5D%2C%22nativeCurrency%22%3A%7B%22name%22%3A%22MATIC%22%2C%22symbol%22%3A%22MATIC%22%2C%22decimals%22%3A18%7D%2C%22shortName%22%3A%22matic%22%2C%22chainId%22%3A137%2C%22testnet%22%3Afalse%2C%22slug%22%3A%22polygon%22%7D&tokenId=0&theme=dark"
                    width="600px"
                    height="600px"
                ></iframe>
            </Flex>
        </Layout>
    )
}

export default Mint

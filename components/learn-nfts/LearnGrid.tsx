import { Text, Flex, Box, Grid } from 'components/primitives'
import { LearnTile } from './LearnTile'

export const LearnGrid = () => {
  return (
    <Flex>
      <Grid
        css={{
          gap: 32,
          width: '95%',
          margin: '0 auto',
          '@xs': {
            gridTemplateColumns: 'unset',
            width: '80%',
          },
          '@sm': {
            gridTemplateColumns: 'repeat(2, 1fr)',
            width: '95%',
          },
          '@lg': {
            gridTemplateColumns: 'repeat(3, 1fr)',
            width: '95%',
          },
        }}
      >
      <Box>
        <LearnTile
          title="Introduction To NFTs"
          numArticles={3}
          articles={[
            {
              title: 'How Do NFTs work?',
              link: '/how-do-nfts-work',
            },
            {
              title: 'The History of NFTs',
              link: '/history-of-nfts',
            },
            {
              title: 'What are NFTs',
              link: '/what-are-nfts',
            },
          ]}
          color="#34b2e5"
        />
      </Box>
      <Box>
        <LearnTile
          title="Creating"
          numArticles={3}
          articles={[
            {
              title: 'How to Create NFTs?',
              link: '/create-nfts',
            },
          ]}
          color="#d3311a"
        />
      </Box>
      <Box>
        <LearnTile
          title="Selling"
          numArticles={3}
          articles={[
            {
              title: 'The 4 Best Ways to Promote Your NFT',
              link: '/promote-your-nft',
            },
            {
              title: 'How to Value NFT Art?',
              link: '/value-nft-art',
            },
            {
              title: 'How Much Does It Cost to Sell NFTs?',
              link: '/costs-to-sell-nfts',
            },
          ]}
          color="#b7f279"
        />
      </Box>
      <Box>
        <LearnTile
          title="Buying"
          numArticles={3}
          articles={[
            {
              title: 'Where to Buy NFTs?',
              link: '/buy-nfts',
            },
            {
              title: 'How to Find NFT Projects Early',
              link: '/find-nft-projects',
            },
            {
              title: 'NFT Collectors vs. Speculators',
              link: '/collectors-vs-speculators',
            },
          ]}
          color="#068d01"
        />
      </Box>
      <Box>
        <LearnTile
          title="What Can You Do?"
          numArticles={3}
          articles={[
            {
              title: 'What is NFT Farming and How to Earn from it?',
              link: '/nft-farming',
            },
            {
              title: 'How to Earn from NFTs?',
              link: '/earn',
            },
            {
              title: 'How to Make Money From the NFT Industry',
              link: '/make-money',
            },
          ]}
          color="#f53d4c"
        />
      </Box>
      <Box>
        <LearnTile
          title="Security"
          numArticles={3}
          articles={[
            {
              title: 'What is Escrowed Peer-To-Peer Trading?',
              link: '/escrowed-trading',
            },
            {
              title: 'How to Avoid NFT Scams?',
              link: '/avoid-scams',
            },
            {
              title: 'What Copy & Paste is NOT how NFTs Work',
              link: '/copy-paste',
            },
          ]}
          color="#1fada5"
        />
        </Box>
        </Grid>
      </Flex>
  )
}

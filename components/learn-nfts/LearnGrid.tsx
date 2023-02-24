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
              link: '/',
            },
            {
              title: 'The History of NFTs',
              link: '/',
            },
            {
              title: 'What are NFTs',
              link: '/',
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
              link: '/',
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
              link: '/',
            },
            {
              title: 'How to Value NFT Art?',
              link: '/',
            },
            {
              title: 'How Much Does It Cost to Sell NFTs?',
              link: '/',
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
              link: '/',
            },
            {
              title: 'How to Find NFT Projects Early',
              link: '/',
            },
            {
              title: 'NFT Collectors vs. Speculators',
              link: '/',
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
              link: '/',
            },
            {
              title: 'How to Earn from NFTs?',
              link: '/',
            },
            {
              title: 'How to Make Money From the NFT Industry',
              link: '/',
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
              link: '/',
            },
            {
              title: 'How to Avoid NFT Scams?',
              link: '/',
            },
            {
              title: 'What Copy & Paste is NOT how NFTs Work',
              link: '/',
            },
          ]}
          color="#1fada5"
        />
        </Box>
        </Grid>
      </Flex>
  )
}

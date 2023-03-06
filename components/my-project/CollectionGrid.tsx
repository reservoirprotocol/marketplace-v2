import { Text, Flex, Box, Grid } from 'components/primitives'
import { ReactNode, FC } from 'react'
import { paths } from '@nftearth/reservoir-sdk';

type Props = {
  children: ReactNode
}

export const CollectionGrid: FC<Props> = ({ children }) => {


  return (
    <Flex css={{ marginTop: '40px' }}>
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
        {children}
      </Grid>
    </Flex>
  )
}

import React, { FC } from 'react'
import { Flex, Box, Text } from 'components/primitives'
import Token from './Token'
import Stat from '../Modal/Stat'
import InfoTooltip from 'components/primitives/InfoTooltip'
import { Token as TokenType, Collection as CollectionType } from 'types/workaround'

type Props = {
  token?: TokenType
  collection?: CollectionType
  royaltyFee?: number
}

const TokenStats: FC<Props> = ({ token, collection, royaltyFee = 0 }) => {
  let attributeFloor = token?.attributes
    ? Math.max(
        ...token.attributes.map((attr: any) =>
          Number(attr.floorAskPrice)
        ),
        0
      )
    : 0
  return (
    <Flex
      css={{
        width: '100%',
        flexDirection: 'row',
        '@bp600': {
          width: 220,
          flexDirection: 'column',
        },
        p: '$4',
      }}
    >
      <Token collection={collection} token={token} />
      <Box
        css={{
          flex: 1,
          mt: '$4',
          [`& ${Stat}:not(:last-child)`]: {
            mb: '$1',
          },
          mb: '$3',
        }}
      >
        {[
          {
            id: 0,
            label: (
              <>
                <Text
                  style="subtitle2"
                  color="subtle"
                  css={{ minWidth: '0' }}
                  ellipsify
                >
                  Creator Royalties
                </Text>
                <InfoTooltip
                  side="right"
                  width={200}
                  content={
                    'A fee on every order that goes to the collection creator.'
                  }
                />
              </>
            ),
            value: `${royaltyFee * 0.01}%`,
          },
          {
            id: 1,
            label: (
              <Text
                style="subtitle2"
                color="subtle"
                css={{ minWidth: '0' }}
                ellipsify
              >
                Last Sale
              </Text>
            ),
            value: token?.lastSale?.price?.amount?.decimal || null,
            asNative: true,
          },
          {
            id: 2,
            label: (
              <Text
                style="subtitle2"
                color="subtle"
                css={{ minWidth: '0' }}
                ellipsify
              >
                Collection Floor
              </Text>
            ),
            value: collection?.floorAsk?.price?.amount?.native || 0,
            asNative: true,
          },
          {
            id: 3,
            label: (
              <>
                <Text
                  style="subtitle2"
                  color="subtle"
                  css={{ minWidth: '0' }}
                  ellipsify
                >
                  Highest Trait Floor
                </Text>
                <InfoTooltip
                  side="right"
                  width={200}
                  content={
                    'The floor price of the most valuable trait of a token.'
                  }
                />
              </>
            ),
            value:
              attributeFloor ||
              collection?.floorAsk?.price?.amount?.native ||
              0,
            asNative: true,
          },
        ].map((stat) => (
          <Stat key={stat.id} {...stat} />
        ))}
      </Box>
    </Flex>
  )
}

export default TokenStats

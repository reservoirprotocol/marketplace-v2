import React, { FC, ComponentPropsWithoutRef, CSSProperties } from 'react'
import TokenMedia from './index'
import { Button, Flex, Text } from 'components/primitives'

type TokenFallbackProps = {
  style?: CSSProperties
  className?: string
  token: ComponentPropsWithoutRef<typeof TokenMedia>['token']
  chainId?: number
  onRefreshClicked: () => void
}

const TokenFallback: FC<TokenFallbackProps> = ({
  style,
  className,
  token,
  chainId,
  onRefreshClicked,
}) => {
  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      css={{ gap: '$2', aspectRatio: '1/1', p: '$2', ...style }}
      className={className}
    >
      {token?.collection?.image && (
        <img
          style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
          src={token?.collection?.image}
        />
      )}
      <Text style="body2" css={{ textAlign: 'center' }}>
        No Content Available
      </Text>
      <Button
        color="secondary"
        onClick={(e: any) => {
          // TO-DO
          // e.preventDefault()
          // if (!reservoirChain) {
          //   throw 'ReservoirClient missing chain configuration'
          // }
          // onRefreshClicked()
          // const url = `${reservoirChain?.baseApiUrl}/tokens/refresh/v1`
          // const body: paths['/tokens/refresh/v1']['post']['parameters']['body']['body'] =
          //   {
          //     token: `${token?.collection?.id}:${token?.tokenId}`,
          //   }
          // const headers = {
          //   ...defaultHeaders(reservoirChain?.apiKey, client?.version),
          //   'Content-Type': 'application/json',
          // }
          // fetch(url, {
          //   headers,
          //   method: 'POST',
          //   body: JSON.stringify(body),
          // })
          //   .then((res) => res.json())
          //   .catch((e) => {
          //     throw e
          //   })
        }}
      >
        Refresh
      </Button>
    </Flex>
  )
}

export default TokenFallback

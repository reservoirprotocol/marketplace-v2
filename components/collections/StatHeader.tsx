import { useCollections } from '@nftearth/reservoir-kit-ui'
import { Text, Box, FormatCryptoCurrency, Grid } from 'components/primitives'
import { useMounted } from 'hooks'
import { FC, ReactNode } from 'react'
import { useMediaQuery } from 'react-responsive'
import {formatNumber} from 'utils/numbers'

type Props = {
  label: string
  children: ReactNode
}

const StatBox: FC<Props> = ({ label, children }) => (
  <Box
    css={{
      p: '$4',
      minWidth: 120,
      background: '$panelBg',
    }}
  >
    <Text style="subtitle3" css={{ color: '$gray12' }} as="p">
      {label}
    </Text>
    {children}
  </Box>
)

type StatHeaderProps = {
  collection: NonNullable<ReturnType<typeof useCollections>['data']>['0']
}

const StatHeader: FC<StatHeaderProps> = ({ collection }) => {
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 600 }) && isMounted
  const listedPercentage =
    ((collection?.onSaleCount ? +collection.onSaleCount : 0) /
      (collection?.itemCount ? +collection.itemCount : 0)) *
    100
  const uniqueOwnersPercentage =
    ((collection?.ownerCount ? +collection.ownerCount : 0) /
      (collection?.itemCount ? +collection.itemCount : 0)) *
    100

  return (
    <Grid
      css={{
        borderRadius: '$lg',
        overflow: 'hidden',
        gap: 1,
        gridTemplateColumns: '1fr 1fr',
        '@sm': {
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
          marginRight: 'auto',
        },
      }}
    >
      <StatBox label="Total Volume">
        <FormatCryptoCurrency
          amount={collection.volume?.allTime}
          logoHeight={18}
          textStyle={'h6'}
          maximumFractionDigits={4}
        />
      </StatBox>

      <StatBox label="Floor">
        <FormatCryptoCurrency
          amount={collection?.floorAsk?.price?.amount?.decimal}
          address={collection?.floorAsk?.price?.currency?.contract}
          decimals={collection?.floorAsk?.price?.currency?.decimals}
          logoHeight={18}
          textStyle={'h6'}
          maximumFractionDigits={4}
        />
      </StatBox>

      <StatBox label="Top Offer">
        <FormatCryptoCurrency
          amount={collection?.topBid?.price?.amount?.decimal}
          address={collection?.topBid?.price?.currency?.contract}
          decimals={collection?.topBid?.price?.currency?.decimals}
          logoHeight={18}
          textStyle={'h6'}
          maximumFractionDigits={4}
        />
      </StatBox>

      <StatBox label="Unique Items">
        <Text style="h6">{formatNumber(collection?.tokenCount)}</Text>
      </StatBox>

      {!isSmallDevice && (
        <StatBox label="Listed">
          <Text style="h6">{formatNumber(listedPercentage, 4)}%</Text>
        </StatBox>
      )}

      <StatBox label="Owner Count">
        <Text style="h6">{formatNumber(collection?.ownerCount)}</Text>
      </StatBox>

      <StatBox label="Unique Owners">
        <Text style="h6">{formatNumber(uniqueOwnersPercentage)}%</Text>
      </StatBox>
    </Grid>
  )
}

export default StatHeader

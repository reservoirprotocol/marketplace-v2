import { FC } from 'react'
import { paths } from '@reservoir0x/reservoir-sdk'
import { Tooltip, Text } from 'components/primitives'

type Props = {
  openseaVerificationStatus: NonNullable<
    paths['/collections/v5']['get']['responses']['200']['schema']['collections']
  >['0']['openseaVerificationStatus']
}

export const OpenSeaVerified: FC<Props> = ({ openseaVerificationStatus }) => {
  if (openseaVerificationStatus === 'verified')
    return (
      <Tooltip
        sideOffset={4}
        content={
          <Text style="body2" css={{ display: 'block' }}>
            Verified by OpenSea
          </Text>
        }
      >
        <img src="/icons/opensea-verified.svg" />
      </Tooltip>
    )
  else return null
}

import { FC } from 'react'
import { Dropdown, DropdownMenuItem } from 'components/primitives/Dropdown'
import {
  Button,
} from 'components/primitives'
import {
  faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {useMarketplaceChain} from "hooks";

type Props = {
  id: string | undefined
  name: string | undefined
  slug: string | undefined
}

const tweetText = (name: string | undefined) => `I just launched my #NFT Project "${name}" on @NFTEarth_L2!\n\n🎉 LFG #Mint soon 🎉\n\n`

export const CollectionDropdown: FC<Props> = ({ id, name, slug }) => {
  const marketplaceChain = useMarketplaceChain()
  const trigger = (
    <Button
      css={{
        justifyContent: 'center',
      }}
      aria-label="More"
      corners="circle"
      type="button"
      color="gray3"
    >
      <FontAwesomeIcon icon={faEllipsisVertical} />
    </Button>
  )

  const children = (
    <>
      <DropdownMenuItem
        as="a"
        target="_blank"
        rel="noreferrer noopener"
        href={`https://twitter.com/intent/tweet?text=${
          encodeURIComponent(tweetText(name))
        }&url=${
          encodeURIComponent(`https://nftearth.exchange/${marketplaceChain.routePrefix}/${slug}`)
        }&hashtags=&via=&related=&original_referer=${
          encodeURIComponent('https://nftearth.exchange')
        }`}
        css={{ display: 'block' }}>Share Project</DropdownMenuItem>
      <DropdownMenuItem as="a" href={`/my-project/${marketplaceChain.routePrefix}${id}`} css={{ display: 'block' }}>View</DropdownMenuItem>
    </>
  )

  return (
    <Dropdown
      trigger={trigger}
      children={children}
      contentProps={{ style: { width: '264px', marginTop: '8px' } }}
    />
  )
}

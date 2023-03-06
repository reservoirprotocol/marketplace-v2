import { FC } from 'react'
import { Dropdown, DropdownMenuItem } from 'components/primitives/Dropdown'
import {
  Button,
} from 'components/primitives'
import {
  faEllipsisVertical,
  faBolt,
  faEye
} from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
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
        css={{ display: 'block' }}><FontAwesomeIcon icon={faTwitter} style={{ marginRight: 10 }}/>Tweet Project</DropdownMenuItem>
      <DropdownMenuItem
        as="a"
        href={`/launch/${marketplaceChain.routePrefix}${slug}`}
        css={{ display: 'block' }}><FontAwesomeIcon icon={faBolt} style={{ marginRight: 10 }}/>Launch Page</DropdownMenuItem>
      <DropdownMenuItem as="a" href={`/my-project/${marketplaceChain.routePrefix}${id}`} css={{ display: 'block' }}><FontAwesomeIcon icon={faEye} style={{ marginRight: 10 }}/>View</DropdownMenuItem>
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

import { Box, Text, Flex } from 'components/primitives'
import Link from 'next/link'
import { MintInfoBtn } from './styled'
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  price: string
  supply: string
  socialLinks: string[]
}

export const MintInfo = ({ price, supply, socialLinks }: Props) => {
  return (
    <Flex css={{
      gap: 10,
      "@xs": {
        margin: '30px auto'
      },
      "@bp800": {
        margin: '0',
      },
    }}>
      <MintInfoBtn>Price: {price}</MintInfoBtn>
      <MintInfoBtn>Supply: {supply}</MintInfoBtn>
      <Link href={socialLinks[0]}>
        <MintInfoBtn>
          <FontAwesomeIcon icon={faDiscord} width={14} height={14} />
        </MintInfoBtn>
      </Link>
      <Link href={socialLinks[1]}>
        <MintInfoBtn>
          <FontAwesomeIcon icon={faTwitter} width={14} height={14} />
        </MintInfoBtn>
      </Link>
    </Flex>
  )
}

export default MintInfo
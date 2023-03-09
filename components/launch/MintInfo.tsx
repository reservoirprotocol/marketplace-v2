import { Box, Text, Flex } from 'components/primitives'
import Link from 'next/link'
import { MintInfoBtn } from './styled'
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {useLaunchpads} from "../../hooks";
import {ethers} from "ethers";
import {formatNumber} from "../../utils/numbers";
import {BigNumber} from "@ethersproject/bignumber";

type Props = {
  launchpad: ReturnType<typeof useLaunchpads>["data"][0],
  contractData: any
}

export const MintInfo = ({ launchpad, contractData }: Props) => {
  const [
    _activePresale,
    _activePublic,
    presalePrice,
    publicPrice,
    maxSupply,
    _totalSupply,
    _reservedSupply,
    _reservedMinted,
    presaleSupply
  ] = contractData || [];

  const numPresaleSupply = (presaleSupply as BigNumber)?.toNumber() || 0
  const numMaxSupply = (maxSupply as BigNumber)?.toNumber() || 1

  return (
    <Flex css={{
      gap: 10,
      flexWrap: 'wrap',
      "@xs": {
        margin: '30px auto'
      },
      "@bp800": {
        margin: '0',
      },
    }}>
      {numPresaleSupply > 0 && (
        <MintInfoBtn>Presale: {ethers.utils.formatEther(`${presalePrice || '0'}`).toString()}Ξ</MintInfoBtn>
      )}
      <MintInfoBtn>Price: {ethers.utils.formatEther(`${publicPrice || '0'}`).toString()}Ξ</MintInfoBtn>
      <MintInfoBtn>Supply: {formatNumber(numMaxSupply)}</MintInfoBtn>
      {launchpad.discordUrl && (
        <Link href={`https://discord.gg/${launchpad.discordUrl}`} target="_blank" rel="noopener noreferer">
          <MintInfoBtn>
            <FontAwesomeIcon icon={faDiscord} width={14} height={14} />
          </MintInfoBtn>
        </Link>
      )}
      {launchpad.twitterUsername && (
        <Link href={`https://twitter.com/${launchpad.twitterUsername}`} target="_blank" rel="noopener noreferer">
          <MintInfoBtn>
            <FontAwesomeIcon icon={faTwitter} width={14} height={14} />
          </MintInfoBtn>
        </Link>
      )}
    </Flex>
  )
}

export default MintInfo
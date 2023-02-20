import { FC } from 'react'
import { Dropdown, DropdownMenuItem } from 'components/primitives/Dropdown'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { Avatar } from 'components/primitives/Avatar'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import {
  Box,
  Button,
  Flex,
  FormatCryptoCurrency,
  Text,
} from 'components/primitives'
import Link from 'next/link'
import {  faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useENSResolver } from 'hooks'
import {formatBN} from "../../utils/numbers";

export const ProfileDropdown: FC = () => {
  const { address } = useAccount()
  const { data: opBalance } = useBalance({ chainId: 10, address })
  const { data: arbBalance } = useBalance({ chainId: 42161, address })
  const { disconnect } = useDisconnect()
  const {
    name: ensName,
    avatar: ensAvatar,
    shortAddress,
    shortName: shortEnsName,
  } = useENSResolver(address)

  const trigger = (
    <Button
      css={{
        justifyContent: 'center',
      }}
      corners="circle"
      type="button"
      color="gray3"
    >
      {ensAvatar ? (
        <Avatar size="medium" src={ensAvatar} />
      ) : (
        <Jazzicon diameter={44} seed={jsNumberForAddress(address as string)} />
      )}
    </Button>
  )

  const children = (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault()
        }}
      >
        <Link href={`/profile/${address}`} style={{ flex: 1 }}>
          <Flex justify="between" align="center" css={{ width: '100%' }}>
            <Text style="body1">
              {shortEnsName ? shortEnsName : shortAddress}
            </Text>
          </Flex>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem as="a" href="/portfolio" css={{ display: 'block' }}>Portfolio</DropdownMenuItem>
      <DropdownMenuItem css={{ cursor: 'text' }}>
        <Flex justify="between">
          Balance
          <Flex direction="column">
            <Flex align="center" css={{ gap: '$2' }}>
              <img
                src={`/icons/currency/0x4200000000000000000000000000000000000042.png`}
                style={{
                  height: 17,
                  width: 17
                }}
              />
              <Text>{`${formatBN(opBalance?.value, 4, opBalance?.decimals)}Ξ`}</Text>
            </Flex>
            <Flex align="center" css={{ gap: '$2' }}>
              <img
                src={`/icons/currency/0x6c0c4816098e13cacfc7ed68da3e89d0066e8893.png`}
                style={{
                  height: 17,
                  width: 17
                }}
              />
              <Text>{`${formatBN(arbBalance?.value, 4, arbBalance?.decimals)}Ξ`}</Text>
            </Flex>
          </Flex>
        </Flex>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => disconnect()}>
        <Flex
          justify="between"
          align="center"
          css={{
            cursor: 'pointer',
          }}
        >
          <Text style="body1">Logout</Text>
          <Box css={{ color: '$gray10' }}>
            <FontAwesomeIcon icon={faRightFromBracket} width={16} height={16} />
          </Box>
        </Flex>
      </DropdownMenuItem>
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

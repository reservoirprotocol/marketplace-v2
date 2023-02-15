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
import { faCopy, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useENSResolver } from 'hooks'
import CopyText from 'components/common/CopyText'

export const ProfileDropdown: FC = () => {
  const { address } = useAccount()
  const { data: balance } = useBalance({ address })
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
      <Link href={`/portfolio`}>
        <DropdownMenuItem>Portfolio</DropdownMenuItem>
      </Link>
      <DropdownMenuItem css={{ cursor: 'text' }}>
        <Flex justify="between">
          Balance
          <FormatCryptoCurrency
            amount={balance?.value}
            decimals={balance?.decimals}
            textStyle="body1"
            logoHeight={14}
          />
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
    ></Dropdown>
  )
}

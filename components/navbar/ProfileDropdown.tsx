import { FC, useContext } from 'react'
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
import { useCopyToClipboard } from 'usehooks-ts'
import { ToastContext } from 'context/ToastContextProvider'
import { useENSResolver } from 'hooks'

export const ProfileDropdown: FC = () => {
  const { address } = useAccount()
  const { data: balance } = useBalance({ address })
  const { disconnect } = useDisconnect()
  const [value, copy] = useCopyToClipboard()
  const { addToast } = useContext(ToastContext)
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
        onClick={() => {
          ensName ? copy(ensName) : copy(address as string)
          addToast?.({ title: 'Copied' })
        }}
      >
        <Flex justify="between">
          <Text style="subtitle1" color="subtle">
            {shortEnsName ? shortEnsName : shortAddress}
          </Text>
          <Box css={{ color: '$gray10' }}>
            <FontAwesomeIcon icon={faCopy} width={16} height={16} />
          </Box>
        </Flex>
      </DropdownMenuItem>
      <Link href={`/profile/${address}`}>
        <DropdownMenuItem>Profile</DropdownMenuItem>
      </Link>
      <DropdownMenuItem css={{ cursor: 'text' }}>
        <Flex justify="between">
          Balance
          <FormatCryptoCurrency
            amount={balance?.value}
            decimals={balance?.decimals}
            textStyle="subtitle1"
            logoHeight={14}
          />
        </Flex>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Flex
          justify="between"
          align="center"
          css={{
            cursor: 'pointer',
          }}
          onClick={() => disconnect()}
        >
          <Text style="subtitle1">Logout</Text>
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

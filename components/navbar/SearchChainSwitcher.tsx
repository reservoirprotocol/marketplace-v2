import {
  Flex,
  Box,
  ToggleGroup,
  ToggleGroupItem,
  Text,
} from 'components/primitives'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ChainContext } from 'context/ChainContextProvider'
import { useMounted } from 'hooks'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { Dispatch, FC, SetStateAction, useContext } from 'react'
import supportedChains from 'utils/chains'
import { TooltipArrow } from 'components/primitives/Tooltip'

type Props = {
  searchChain: string
  setSearchChain: Dispatch<SetStateAction<string>>
}

export const SearchChainSwitcher: FC<Props> = ({
  searchChain,
  setSearchChain,
}) => {
  const isMounted = useMounted()
  const { theme } = useTheme()

  if (!isMounted || supportedChains.length === 1) {
    return null
  }

  return (
    <ToggleGroup
      type="single"
      value={searchChain}
      css={{ borderRadius: 0, gap: 0 }}
    >
      {supportedChains.map((chainOption) => (
        <TooltipPrimitive.Root delayDuration={0} key={chainOption.name}>
          <TooltipPrimitive.Trigger>
            <ToggleGroupItem
              asChild
              value={chainOption.name}
              disabled={chainOption.name === searchChain}
              onClick={() => {
                setSearchChain(chainOption.name)
              }}
              css={{
                backgroundColor: 'transparent',
                px: '$5',
                borderRadius: 0,
                borderBottom: '1px solid $gray5',
                '&[data-state=on]': {
                  backgroundColor: 'transparent',
                  borderBottom: '1px solid $primary11',
                },
              }}
            >
              <Flex
                css={{
                  display: 'flex',
                  flexShrink: 0,
                  justifyContent: 'center',
                  width: 'max-content',
                }}
              >
                <img
                  src={
                    theme === 'dark'
                      ? chainOption.darkIconUrl
                      : chainOption.lightIconUrl
                  }
                  style={{ height: 20, flexShrink: 0 }}
                />
              </Flex>
            </ToggleGroupItem>
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Content
            sideOffset={-4}
            side="top"
            align="center"
            style={{
              zIndex: 100,
              filter: 'drop-shadow(0px 3px 8px rgba(0, 0, 0, 0.3))',
            }}
          >
            <TooltipArrow />
            <Box
              css={{
                zIndex: 9999,
                $$shadowColor: '$colors$panelShadow',
                boxShadow: '0px 1px 5px rgba(0,0,0,0.2)',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <Box
                css={{
                  background: '$neutralBgSubtle',
                  p: '$2',
                }}
              >
                <Text style="body3" as="p">
                  {chainOption?.name}
                </Text>
              </Box>
            </Box>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Root>
      ))}
    </ToggleGroup>
  )
}

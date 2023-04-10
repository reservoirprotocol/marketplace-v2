import { FC } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ToggleGroup, ToggleGroupItem, Box, Text } from '../primitives'
import supportedChains from 'utils/chains'
import { useContext } from 'react'
import { ChainContext } from 'context/ChainContextProvider'
import { TooltipArrow } from 'components/primitives/Tooltip'
import { useMounted } from 'hooks'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'

const ChainToggle: FC = () => {
  const router = useRouter()
  const { chain, switchCurrentChain } = useContext(ChainContext)
  const isMounted = useMounted()
  const { theme } = useTheme()

  if (!isMounted || supportedChains.length === 1) {
    return null
  }

  return (
    <ToggleGroup type="single" value={chain.name}>
      {supportedChains.map((chainOption) => (
        <TooltipPrimitive.Root delayDuration={0} key={chainOption.name}>
          <TooltipPrimitive.Trigger>
            <ToggleGroupItem
              asChild
              value={chainOption.name}
              disabled={chainOption.name === chain.name}
              onClick={() => {
                if (router.query.chain) {
                  Object.keys(router.query).forEach(
                    (param) => delete router.query[param]
                  )
                  router.replace(
                    {
                      pathname: router.pathname,
                      query: router.query,
                    },
                    undefined,
                    { shallow: true }
                  )
                }
                switchCurrentChain(chainOption.id)
              }}
            >
              <Box
                css={{
                  width: 56,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={
                    theme === 'dark'
                      ? chainOption.darkIconUrl
                      : chainOption.lightIconUrl
                  }
                  style={{ height: 20 }}
                />
              </Box>
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
                <Text style="body2" as="p">
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

export default ChainToggle

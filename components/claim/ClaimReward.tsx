import { useState } from 'react'
import { Box, Grid, Text, Flex, Button } from 'components/primitives'
import Link from 'next/link'
import useEligibleAirdropSignature from 'hooks/useEligibleAirdropSignature'
import { RewardButton } from './styled'
import { Cross2Icon } from '@radix-ui/react-icons'
import * as Dialog from '@radix-ui/react-dialog'

import { AnimatedOverlay, AnimatedContent } from 'components/primitives/Dialog'

type Props = {
  title: string
  description: string
  image: string
}

export const ClaimReward = ({ title, description, image }: Props) => {

  // Get Eligable Address with useEligibleAirdropSignature Custom Hook
  const signature = useEligibleAirdropSignature()

  // Set the variable for the Modal
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)
  
  return (
    <div ref={setContainer}>
      <Box
        css={{
          borderRadius: '16px',
          gap: '$1',
          width: '100%',
          position: 'relative',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          '@xs': {
            padding: '64px 24px',
          },
          '@lg': {
            padding: '100px 64px',
          },
        }}
      >
        <Flex>
          <Grid
            css={{
              gap: 32,
              '@xs': {
                flex: 1,
              },
              '@lg': {
                flex: 0.5,
              },
            }}
          >
            <Text
              style={{
                '@initial': 'h3',
                '@lg': 'h2',
              }}
              css={{
                fontWeight: 700,
              }}
            >
              {title}
            </Text>

            <Text
              style={{
                '@initial': 'h4',
                '@lg': 'h4',
              }}
            >
              {description}
            </Text>
            <RewardButton
              // disabled={!signature}
              css={{
                background: '#6BE481',
                borderRadius: '10px',
                padding: '$1',
                width: '30%',
              }}
              onClick={() => { setOpen(true) }}
            >
              <Text
                css={{
                  color: 'black',
                  textAlign: 'center',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  fontWeight: 700,
                }}
              >
                Claim $NFTE
              </Text>
            </RewardButton>
          </Grid>
        </Flex>
        </Box>
        
      {!signature && (
        <Dialog.Root open={open}>
          <Dialog.Portal container={container}>
            <AnimatedOverlay onClick={() => { setOpen(false) }} />
            <AnimatedContent >
              <Flex
                justify="between"
                css={{
                  borderTop: '1px solid $gray7',
                  borderStyle: 'solid',
                  pt: '$5',
                  background: '$gray7',
                  padding: '$5',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '20px',
                  '@bp600': {
                    flexDirection: 'column',
                    gap: '20px',
                  },
                }}
              >
                <Flex css={{ width: '100%' }}>
                  <Dialog.Close asChild>
                    <button
                      style={{ marginLeft: 'auto', marginRight: 0 }}
                      onClick={() => setOpen(!open)}
                      className="IconButton"
                      aria-label="Close"
                    >
                      <Cross2Icon />
                    </button>
                  </Dialog.Close>
                </Flex>
                <Text
                  style="subtitle1"
                  css={{
                    lineHeight: 1.5,
                    color: '$whiteA12',
                    width: '100%',
                    '@lg': { width: '50%' },
                  }}
                >
                  Processing your claim...
                </Text>
                <Link href="/">
                  <Button>Back to Home</Button>
                </Link>
              </Flex>
            </AnimatedContent>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  )
}

import { NextPage } from 'next'
import { Flex, Box, Button, Text } from 'components/primitives'
import Layout from 'components/Layout'
import Link from 'next/link'
import { ClaimRewardHeroBanner } from 'components/claim/ClaimRewardHeroBanner'
import * as Dialog from '@radix-ui/react-dialog'
import { faWarning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ClaimReward } from 'components/claim/ClaimReward'

import useEligibleAirdropSignature from "hooks/useEligibleAirdropSignature";
import { useMounted } from "hooks";
import { AnimatedOverlay, AnimatedContent } from "../../components/primitives/Dialog";


const ClaimPage: NextPage = () => {
  const { data: signature, isLoading } = useEligibleAirdropSignature()
  const isMounted = useMounted()

  return (
    <Layout>
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            p: '$6',
          },
        }}
      >
        <ClaimRewardHeroBanner
          image="/ClaimBG.png"
          title="Claim your $NFTE tokens after completing a listing on the NFTEarth marketplace"
          description=" Claim your Rewards after listing your NFT on the marketplace. See
          which rewards your are eligible to claim for."
        />
        <Flex css={{ my: '$6', gap: 65 }} direction="column">
          <ClaimReward
            image="/ClaimRewards.png"
            title=""
            description="If you were one of the 1,786 eligible addresses for airdrop 1 and have listed an NFT on NFTEarth, you can claim your $NFTE tokens below."
          />
        </Flex>
      </Box>
      {isMounted && (
        <Dialog.Root modal={true} open={!signature && !isLoading}>
          <Dialog.Portal>
            <AnimatedOverlay
              style={{
                position: 'fixed',
                zIndex: 1000,
                inset: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: '20px',
              }}
            />
            <AnimatedContent style={{
              outline: 'unset',
              position: 'fixed',
              zIndex: 1000,
              transform: 'translate(-50%, 120%)',
              width: '400px',
            }}>
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
                  <FontAwesomeIcon
                    icon={faWarning}
                    style={{ marginLeft: '150px', marginRight: 'auto' }}
                  />
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
                  Have you "listed" an NFT on the NFTEarth marketplace ?
                </Text>
                <Link href="/portfolio">
                  <Button>List your NFT</Button>
                </Link>
              </Flex>
            </AnimatedContent>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </Layout>
  )
}

export default ClaimPage

import {useEffect, useRef, useState} from "react";
import { NextPage } from 'next'
import { Flex, Box, Button, Text } from 'components/primitives'
import Layout from 'components/Layout'
import Link from 'next/link'
import { ClaimRewardHeroBanner } from 'components/claim/ClaimRewardHeroBanner'
import * as Dialog from '@radix-ui/react-dialog'
import { faWarning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Cross2Icon } from '@radix-ui/react-icons'

import { ClaimReward } from 'components/claim/ClaimReward'

import useEligibleAirdropSignature from "hooks/useEligibleAirdropSignature";
import {useMounted} from "hooks";


const ClaimPage: NextPage = () => {
  const container = useRef()
  const { data: signature, isLoading } = useEligibleAirdropSignature()
  const [open, setOpen] = useState(false)
  const isMounted = useMounted()

  useEffect(() => {
    if (isMounted && !isLoading && !signature) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isMounted, signature])

  return (
    <Layout>
      <Box
        css={{
          position: 'fixed',
          top: '60%',
          zIndex: 1000,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
        }}
        //@ts-ignore
        ref={container}
      />
      <Box
        css={{
          p: 24,
          height: '100%',
          opacity: open ? '0.3' : 1,
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
        <Dialog.Root defaultOpen open={open}>
          <Dialog.Portal container={container.current}>
            <Dialog.Overlay />
            <Dialog.Content>
              <Flex
                justify="between"
                css={{
                  borderTop: '1px solid $gray7',
                  borderStyle: 'solid',
                  pt: '$5',
                  background: '$gray7',
                  padding: '$5',
                  borderRadius: '20px',
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
                  Have you "listed" an NFT on the NFTEarth marketplace?
                </Text>
                <Link href="/">
                  <Button>Back to Home</Button>
                </Link>
              </Flex>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </Layout>
  )
}

export default ClaimPage

import {memo, useEffect, useMemo, useRef, useState} from 'react'
import { NextPage } from 'next'
import { Flex, Box, Button, Text } from 'components/primitives'
import Layout from 'components/Layout'
import Link from 'next/link'
import { ClaimRewardHeroBanner } from 'components/claim/ClaimRewardHeroBanner'
import * as Dialog from '@radix-ui/react-dialog'
import { faWarning, faClose } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ClaimReward } from 'components/claim/ClaimReward'
import useEligibleAirdropSignature from 'hooks/useEligibleAirdropSignature'
import useCountdown from 'hooks/useCountdown'
import { useMounted } from 'hooks'
import {
  AnimatedOverlay,
  AnimatedContent,
} from 'components/primitives/Dialog'
import {useTheme} from "next-themes";
import {useMediaQuery} from "react-responsive";

interface InjectScriptProps {
  script: string;
}

const InjectScript = memo(({ script }: InjectScriptProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current === null) {
      return
    }

    const doc = document.createRange().createContextualFragment(script)

    divRef.current.innerHTML = ''
    divRef.current.appendChild(doc)
  })

  return <div ref={divRef} />
})

const endClaimTime = 1677609000000;

const ClaimPage: NextPage = () => {
  const { theme } = useTheme();
  const { data: signature, isLoading } = useEligibleAirdropSignature()
  const [open, setOpen] = useState(false);
  const isMounted = useMounted()
  const [days, hours, minutes, seconds] = useCountdown(endClaimTime);
  const isMobile = useMediaQuery({ maxWidth: 600 }) && isMounted

  // Count Down State if the user didn't claim
  const showCountDown = useMemo(() => {
    return isMounted && signature
  }, [isMounted, signature])

  useEffect(() => {
    if (isMounted && !isLoading && !signature) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [isMounted, signature])

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
        {showCountDown && (
          <Flex align="center" direction="column" css={{ mb: 50, backgroundColor: '$gray6', p: 24, borderRadius: 20, textAlign: 'center' }}>
            <Text style="h2" css={{
              color: theme === 'dark' ? '$primary9' : '$primary8',
              fontSize: 30,
            }}>$NFTE Airdrop 1 Claiming Closes</Text>
            <Flex justify="between" direction="row" css={{ flexWrap: 'wrap'}}>
              <Flex direction="column" align="center" css={{ width: 130 }}>
                <Text style="h1">{days}</Text>
                <Text style="h5">DAYS</Text>
              </Flex>
              <Flex direction="column" align="center">
                <Text style="h1">:</Text>
              </Flex>
              <Flex direction="column" align="center" css={{ width: 130 }}>
                <Text style="h1">{hours}</Text>
                <Text style="h5">HOURS</Text>
              </Flex>
              {!isMobile && (
                <Flex direction="column" align="center">
                  <Text style="h1">:</Text>
                </Flex>
              )}
              <Flex direction="column" align="center" css={{ width: 100 }}>
                <Text style="h1">{minutes}</Text>
                <Text style="h5">MINUTES</Text>
              </Flex>
              <Flex direction="column" align="center">
                <Text style="h1">:</Text>
              </Flex>
              <Flex direction="column" align="center" css={{ width: 130 }}>
                <Text style="h1" css={{ color: '$red9'}}>{seconds}</Text>
                <Text style="h5">SECONDS</Text>
              </Flex>
            </Flex>
          </Flex>
        )}
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
            <AnimatedContent
              style={{
                outline: 'unset',
                position: 'fixed',
                zIndex: 1000,
                transform: 'translate(-50%, 120%)',
                width: '400px',
              }}
            >
              <Flex
                justify="between"
                css={{
                  position: 'relative',
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
                <Dialog.Close asChild>
                  <button
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 15,
                    }}
                    onClick={() => setOpen(!open)}
                    className="IconButton"
                    aria-label="Close"
                  >
                    <FontAwesomeIcon icon={faClose} size="xl" />
                  </button>
                </Dialog.Close>
                <Flex align="center" justify="center">
                  <FontAwesomeIcon icon={faWarning} color="orange" size="2xl" />
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

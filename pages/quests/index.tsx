import { NextPage } from 'next'
import { Text, Flex, Box, Button } from 'components/primitives'
import Layout from 'components/Layout'
import { useMounted } from 'hooks'
import { QuestsGrid } from 'components/quests/QuestsGrid'
import QuestSecion from 'components/quests/QuestsSection'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnimatedOverlay, AnimatedContent } from 'components/primitives/Dialog'
import { useState, useEffect } from 'react'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { QuestRetweetModalContent } from 'components/quests/templates'

const QuestsPage: NextPage = () => {
  const isMounted = useMounted()
  const [open, setOpen] = useState(false)
  const [quest, setQuest] = useState<number>(1)

  const displayContent = (value: number) => {
    switch (value) {
      case 1:
        return <QuestRetweetModalContent />
      default:
        return null
    }
  }

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
        <QuestSecion />
        <Flex css={{ my: '$6', gap: 65 }} direction="column">
          {isMounted && (
            <Dialog.Root defaultOpen open={open} modal>
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
                    transform: 'translate(-50%, 30%)',
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
                        onClick={() => setOpen(false)}
                        className="IconButton"
                        aria-label="Close"
                      >
                        <FontAwesomeIcon icon={faClose} size="xl" />
                      </button>
                    </Dialog.Close>
                    <Box>{displayContent(quest)}</Box>
                  </Flex>
                </AnimatedContent>
              </Dialog.Portal>
            </Dialog.Root>
          )}
          {/* <Flex
            justify="between"
            align="start"
            css={{
              flexDirection: 'column',
              gap: 24,
              '@bp800': {
                alignItems: 'center',
                flexDirection: 'row',
              },
            }}
          >
            <Box css={{ width: '100%' }}>
              <Text
                style="h4"
                as="h4"
                css={{ marginBottom: '15px', marginLeft: '5px' }}
              >
                My Points
              </Text>
              <Flex
                css={{
                  flexDirection: 'row',
                  background: '$gray4',
                  width: '100%',
                  borderRadius: '20px',
                  padding: '10px',
                }}
              >
                <Box css={{ marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text
                    css={{ marginBottom: '15px', marginLeft: '5px' }}
                    style="h4"
                    as="h4"
                  >
                    Connect your Wallet
                  </Text>
                  <Box css={{ marginLeft: '100px', marginRight: 'auto' }}>
                    <ConnectWalletButton />
                  </Box>
                </Box>
              </Flex>
            </Box>
          </Flex> */}
          <Box>
            <Text
              css={{ marginBottom: '15px', marginLeft: '5px' }}
              style="h4"
              as="h4"
            >
              Now ! Earn points for every quest
            </Text>
            {isMounted && <QuestsGrid setOpen={setOpen} setQuest={setQuest} />}
          </Box>
        </Flex>
      </Box>
    </Layout>
  )
}

export default QuestsPage

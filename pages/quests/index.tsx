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
import {
  QuestRetweetModalContent,
  QuestJoinDiscordModalContent,
  QuestPostProofModalContent,
  QuestListNFTOnANYChain,
  QuestListNFTInNFTEOnAnyChain
} from 'components/quests/templates'

const QuestsPage: NextPage = () => {
  const isMounted = useMounted()
  const [open, setOpen] = useState(false)
  const [quest, setQuest] = useState<number>(0)

  const displayContent = (value: number) => {
    switch (value) {
      case 1:
        return <QuestRetweetModalContent />
      case 2:
        return <QuestPostProofModalContent />
      case 3:
        return <QuestJoinDiscordModalContent />
      case 4:
        return <QuestListNFTOnANYChain />
      case 5:
        return <QuestListNFTInNFTEOnAnyChain />
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
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    backdropFilter: '20px',
                    opacity: '0.5',
                  }}
                  onClick={() => setOpen(false)}
                />
                <AnimatedContent
                  style={{
                    outline: 'unset',
                    position: 'fixed',
                    zIndex: 1000,
                    transform: 'translate(-50%, 20%)',
                    height: '60vh',
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

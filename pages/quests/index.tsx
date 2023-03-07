import { NextPage } from 'next'
import { Text, Flex, Box, Button } from 'components/primitives'
import Layout from 'components/Layout'
import {useMounted, useProfile, useQuestEntries} from 'hooks'
import QuestsOneTime from 'components/quests/QuestsOneTime'
import QuestSecion from 'components/quests/QuestsSection'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnimatedOverlay, AnimatedContent } from 'components/primitives/Dialog'
import { useState } from 'react'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import {
  QuestRegisterUserName,
  QuestFollowTwitter,
  QuestRetweet,
  QuestJoinDiscord,
  QuestListNFT,
  QuestBuyNFTInNFTEOnAnyChain,
  QuestListNFTInNFTEOnAnyChain,
  QuestMakeOfferForNFT,
  QuestLeaderboard,
} from 'components/quests/templates'

const QuestsPage: NextPage = () => {
  const isMounted = useMounted()
  const [open, setOpen] = useState(false)
  const [quest, setQuest] = useState<number>(0)
  const { data: entries } = useQuestEntries()
  const { data: profile } = useProfile("");

  const displayContent = (value: number) => {
    switch (value) {
      case 1:
        return <QuestRegisterUserName disabled={(entries || []).find((q: any) => q.quest_id === 1)} />
      case 2:
        return <QuestFollowTwitter profile={profile} disabled={(entries || []).find((q: any) => q.quest_id === 2)} />
      case 3:
        return <QuestRetweet profile={profile} disabled={(entries || []).find((q: any) => q.quest_id === 3)}/>
      case 4:
        return <QuestJoinDiscord profile={profile} disabled={(entries || []).find((q: any) => q.quest_id === 4)}/>
      case 5:
        return <QuestListNFT disabled={(entries || []).find((q: any) => q.quest_id === 5)}/>
      case 6:
        return <QuestMakeOfferForNFT disabled={(entries || []).find((q: any) => q.quest_id === 6)}/>
      case 7:
        return <QuestListNFTInNFTEOnAnyChain disabled={(entries || []).find((q: any) => q.quest_id === 7)}/>
      case 8:
        return <QuestBuyNFTInNFTEOnAnyChain disabled={entries.find((q: any) => q.quest_id === 8)}/>
      case 9:
        return <QuestLeaderboard disabled={entries.find((q: any) => q.quest_id === 9)}/>
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
        <Flex css={{ my: '$5', gap: 65 }} direction="column">
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
                    opacity: '0.9',
                  }}
                  onClick={() => setOpen( false)}
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
                      borderTop: '1px solid $blackA11',
                      borderStyle: 'solid',
                      pt: '$5',
                      background: '$gray1',
                      padding: '$5',
                      flexDirection: 'column',
                      alignItems: 'center',
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
        </Flex>
        <Box>
          <Text
            css={{ marginBottom: '15px', marginLeft: '5px' }}
            style="h4"
            as="h4"
          >
          One-time Quests
          </Text>
          {isMounted && <QuestsOneTime setOpen={setOpen} setQuest={setQuest} />}
        </Box>
      </Box>
    </Layout>
  )
}

export default QuestsPage

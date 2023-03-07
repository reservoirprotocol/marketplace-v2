import { Box, Text, Flex } from 'components/primitives'
import { Dispatch } from 'react'
import { QuestContent, QuestXPButton, QuestJoinButton } from './styled'
import {QuestTask} from "pages/api/quest/entry";

type Props = {
  title: string
  description: string
  points: number
  locked: (idx: number) => boolean
  tasks: QuestTask[]
  setOpen: Dispatch<React.SetStateAction<boolean>>
  setQuest: Dispatch<React.SetStateAction<number>>
  number: number
}

export const Quest = ({
  title,
  description,
  points,
  locked,
  setOpen,
  setQuest,
  tasks,
  number,
}: Props) => {
  const displayQuest = () => {
    setQuest(number)
    setOpen(true)
  }
  return (
    <Flex
      justify="center"
      css={{
        borderRadius: '16px',
        gap: '$1',
        height: '100%',
        padding: '20px 30px',
        border: '2px solid #6BE481',
        background: '$gray6',
        opacity: 0.4,
      }}
    >
      {locked(number) ? (
        <Box css={{ position: 'relative' }}>
          <Box
            css={{
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <img src="/images/Lock.png" style={{ margin: 'auto' }} />
            <Text css={{ fontWeight: '700', fontSize: '$5' }}>
              Earn {points} XP to unlock{' '}
            </Text>
          </Box>
          <Box
            css={{
              position: 'relative',
              filter: 'blur(9px)',
            }}
          >
            <Text
              css={{
                fontWeight: '900',
                fontSize: '$11',
              }}
              style="subtitle1"
            >
              {title}
            </Text>
            <QuestContent>
              <Text style="subtitle1">{description}</Text>
            </QuestContent>
            <Flex
              justify="between"
              css={{
                position: 'absolute',
                width: '100%',
                bottom: 0,
              }}
            >
              <QuestXPButton>{points} XP</QuestXPButton>
              <QuestJoinButton disabled>
                <Text
                  css={{
                    color: 'black',
                    fontWeight: '700',
                  }}
                >
                  Join
                </Text>
              </QuestJoinButton>
            </Flex>
          </Box>
        </Box>
      ) : (
        <Box
          css={{
            position: 'relative',
          }}
        >
          <Text
            css={{
              fontWeight: '900',
              fontSize: '$11',
            }}
            style="subtitle1"
          >
            {title}
          </Text>
          <QuestContent>
            <Text style="subtitle1">{description}</Text>
          </QuestContent>
          <Flex
            justify="between"
            css={{
              position: 'absolute',
              width: '100%',
              bottom: 0,
            }}
          >
            <QuestXPButton>{points} XP</QuestXPButton>
            <QuestJoinButton onClick={displayQuest} disabled={locked(number)}>
              <Text
                css={{
                  color: 'black',
                  fontWeight: '700',
                }}
              >
                View
              </Text>
            </QuestJoinButton>
          </Flex>
        </Box>
      )}
    </Flex>
  )
}

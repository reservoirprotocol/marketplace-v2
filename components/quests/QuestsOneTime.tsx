import { Box, Flex } from 'components/primitives'
import { Dispatch } from 'react'
import { Quest } from './Quest'
import quests from 'data/quests.json'
import { useQuestEntries } from "hooks";
import {QuestTask} from "pages/api/quest/entry";

type Props = {
  setOpen: Dispatch<React.SetStateAction<boolean>>
  setQuest: Dispatch<React.SetStateAction<number>>
}

export const QuestsOneTime = ({ setOpen, setQuest }: Props) => {
  const { data: entries } = useQuestEntries()

  return (
    <Flex
      css={{
        display: 'grid',
        gap: 48,
        '@xs': {
          gridTemplateColumns: 'unset',
        },
        '@md': {
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
        '@xl': {
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
      }}
    >
      {quests.map(quest => (
        <Box key={`quest-${quest.id}`}>
          <Quest
            key={`quest-${quest.id}`}
            title={quest.title}
            description={quest.description}
            points={quest.exp}
            //locked={(idx) => idx - 1 > (entries || []).length}
            locked={(idx) => idx - 1 > 10}
            completed={(idx) => idx - 1 < (entries || []).length}
            tasks={quest.tasks as QuestTask[]}
            setOpen={setOpen}
            setQuest={setQuest}
            number={quest.id}
          />
        </Box>
      ))}
    </Flex>
  )
}

export default QuestsOneTime
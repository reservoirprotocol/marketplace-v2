import { Box, Flex } from 'components/primitives'
import { Dispatch } from 'react'
import { Quest } from './Quest'

type Props = {
  setOpen: Dispatch<React.SetStateAction<boolean>>
  setQuest: Dispatch<React.SetStateAction<number>>
}

export const QuestsOneTime = ({ setOpen, setQuest }: Props) => {
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
      <Box>
        <Quest
          title="Create account on NFTEarth"
          description="Connect your Wallet and create your account on NFTEarth"
          points={25}
          locked={false}
          link=""
          setOpen={setOpen}
          setQuest={setQuest}
          number={1}
        />
      </Box>
      <Box>
        <Quest
          title="Follow @NFTEarth on Twitter"
          description="Connect Twitter to your NFTEarth account and follow us on Twitter."
          points={25}
          locked={false}
          link=""
          setOpen={setOpen}
          setQuest={setQuest}
          number={2}
        />
      </Box>
      <Box>
        <Quest
          title="Retweet @NFTEarth's tweet"
          description="Retweet a specific tweet posted by NFTEarth and get XP now."
          points={25}
          locked={false}
          link=""
          setOpen={setOpen}
          setQuest={setQuest}
          number={3}
        />
      </Box>
      <Box>
        <Quest
          title="Join us on Discord"
          description="Connect NFTEarth Discord and join us on Discord to get XP."
          points={25}
          locked={false}
          link=""
          setOpen={setOpen}
          setQuest={setQuest}
          number={4}
        />
      </Box>
      <Box>
        <Quest
          title="List NFT for sale on NFTEarth"
          description="List Any NFT of any supported blockchain for sale on NFTEarth."
          points={25}
          locked={false}
          link=""
          setOpen={setOpen}
          setQuest={setQuest}
          number={5}
        />
      </Box>
      <Box>
        <Quest
          title="NFT Trader"
          description="Buy an NFT for a total volume of 0.1 ETH on NFTEarth on any supported blockchain to claim a reward."
          points={25}
          locked={false}
          link=""
          setOpen={setOpen}
          setQuest={setQuest}
          number={6}
        />
      </Box>
    </Flex>
  )
}

export default QuestsOneTime
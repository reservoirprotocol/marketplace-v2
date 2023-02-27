import { Box, Flex } from 'components/primitives'
import { Quest } from './Quest'

export const QuestsGrid = () => {
  return (
    <Flex css={{
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
    }}>
      <Box>
        <Quest
          title="Join our Discord"
          description="Join our community! Get started Be a pro NFT collector & learn more..."
          points={25}
          locked={false}
          link=""
        />
      </Box>
      <Box>
        <Quest
          title="Follow us on Twitter"
          description="Assign a username to your wallet from the Profile Settings page."
          points={25}
          locked={false}
          link=""
        />
      </Box>
      <Box>
        <Quest
          title="Complete your first transaction"
          description="Assign a username to your wallet from the Profile Settings page."
          points={25}
          locked={false}
          link=""
        />
      </Box>
      <Box>
        <Quest
          title="Register a username"
          description="Assign a username to your wallet from the Profile Settings page."
          points={25}
          locked={true}
          link=""
        />
      </Box>
      <Box>
        <Quest
          title="Register a username"
          description="Assign a username to your wallet from the Profile Settings page."
          points={25}
          locked={true}
          link=""
        />
      </Box>
      <Box>
        <Quest
          title="Register a username"
          description="Assign a username to your wallet from the Profile Settings page."
          points={25}
          locked={true}
          link=""
        />
      </Box>
    </Flex>
  )
}

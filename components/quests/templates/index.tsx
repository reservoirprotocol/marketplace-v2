import { Flex, Box, Button, Text } from 'components/primitives'
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const QuestRetweetModalContent = () => {
  return (
    <Flex direction="column" css={{ gap: '$4' }}>
      <Box>
        <Text style="h3" css={{ color: '$primary9' }}>
          Retweet Quest 🎁
        </Text>
      </Box>
      <Box>
        <Text style="h4" css={{ color: '$primary9' }}>
          Instructions:
        </Text>
      </Box>
      <Box>
        <Text style="h6" css={{ color: '$primary9' }}>
          Retweet this Tweet with Hashtag #NFTE and post it into the NFTEarth
          community channel Quest Proof
        </Text>
      </Box>
      <Box>
        <Flex justify="center" css={{ padding: '$3' }}>
          <Text style="h4" css={{ marginLeft: '40px', color: '$primary9' }}>
            Step 1: Retweet the following tweet using your verified twitter
            account:
          </Text>
          <Box>
            <img src="/images/verified.png" width={40} />
          </Box>
        </Flex>

        <Box css={{ marginTop: '20px' }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/NFTEarth_L2/status/1630717556288831488?s=20"
            aria-label="Twitter"
          >
            <Button
              size="xs"
              color="gray3"
              css={{
                background: '#1DA1F2',

                '&:hover': {
                  background: '$gray8',
                },
              }}
              aria-label="Twitter"
            >
              <FontAwesomeIcon icon={faTwitter} width={25} height={25} />
            </Button>
          </a>
        </Box>
      </Box>

      <Box css={{ padding: '$3', margin: '0 auto' }}>
        <Text style="h4" css={{ color: '$primary9' }}>
          Step 2: Post the screenshot of the retweet into NFTEarth Discord's
          community channel ⚡ #quest-proof
        </Text>
        <Box>
          <Box css={{ marginTop: '20px' }}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://discord.com/channels/1062256160264171520/1080351212022538281"
              aria-label="Discord"
            >
              <Button
                size="xs"
                color="gray3"
                css={{
                  background: '#5865f2',

                  '&:hover': {
                    background: '$gray8',
                  },
                }}
                aria-label="Discord"
              >
                <FontAwesomeIcon icon={faDiscord} width={25} height={25} />
              </Button>
            </a>
          </Box>
        </Box>
      </Box>
      <Box css={{ marginTop: '20px' }}>
        <Text style="subtitle2" css={{ color: '$primary9' }}>
          Conditions:
        </Text>
        <ul>
          <li>
            <Text style="subtitle2" css={{ color: '$primary9' }}>
              *First 10 users to complete Quest are eligible
            </Text>
          </li>

          <li>
            <Text style="subtitle2" css={{ color: '$primary9' }}>
              *Reward is 50 $NFTE tokens
            </Text>
          </li>

          <li>
            <Text style="subtitle2" css={{ color: '$primary9' }}>
              *Must be real Twitter account
            </Text>
          </li>
        </ul>
      </Box>
    </Flex>
  )
}

export const QuestPostProofModalContent = () => {
  return (
    <Flex direction="column" css={{ gap: '$4' }}>
      <Box>
        <Text style="h3" css={{ color: '$primary9' }}>
          List NFT in $NFTE on NFTEarth 🎁
        </Text>
      </Box>
      <Box>
        <Text style="h4" css={{ color: '$primary9' }}>
          Instructions:
        </Text>
      </Box>
      <Box>
        <Text style="h6" css={{ color: '$primary9' }}>
          List any NFT on NFTEarth in $NFTE with any listing duration time.
          Quest is fulfilled just by listing any NFT on Optimism or Arbitrum for
          any price of $NFTE and valid even if listing is not sold. You don't
          need to post any proof, we will check that automatically.
        </Text>
      </Box>
      <Box>
        <Flex justify="center" css={{ padding: '$3' }}>
          <Text style="h4" css={{ color: '$primary9' }}>
            Step 1: List your items. Below you can see the listed item shows.
          </Text>
          <Box>
            <img src="/images/verified.png" width={40} />
          </Box>
        </Flex>

        <Box
          css={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
        >
          <img src="/images/Quest_ListItem.png" width={500} />
        </Box>
      </Box>

      <Box css={{ padding: '$3' }}>
        <Text style="h4" css={{ color: '$primary9' }}>
          Step 2: Post the screenshot of your listed item on our Discord
          Channel. We will get back to you asap.
        </Text>
        <Box>
          <Box css={{ marginTop: '20px' }}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://discord.com/channels/1062256160264171520/1080351212022538281"
              aria-label="Discord"
            >
              <Button
                size="xs"
                color="gray3"
                css={{
                  background: '#5865f2',

                  '&:hover': {
                    background: '$gray8',
                  },
                }}
                aria-label="Discord"
              >
                <FontAwesomeIcon icon={faDiscord} width={25} height={25} />
              </Button>
            </a>
          </Box>
        </Box>
      </Box>
      <Box css={{ marginTop: '20px' }}>
        <Text style="subtitle2" css={{ color: '$primary9' }}>
          Conditions:
        </Text>
        <ul>
          <li>
            <Text style="subtitle2" css={{ color: '$primary9' }}>
              *First 20 users to complete Quest are eligible
            </Text>
          </li>

          <li>
            <Text style="subtitle2" css={{ color: '$primary9' }}>
              *Reward is 100 $NFTE tokens
            </Text>
          </li>
        </ul>
      </Box>
    </Flex>
  )
}

export const QuestJoinDiscordModalContent = () => {
  return (
    <Flex direction="column" css={{ gap: '$4' }}>
      <Box>
        <Text style="h3" css={{ color: '$primary9' }}>
          Join NFTEarth's Discord Community Channel🎁
        </Text>
      </Box>
      <Box>
        <Text style="h4" css={{ color: '$primary9' }}>
          Instructions:
        </Text>
      </Box>
      <Box>
        <Text style="h6" css={{ color: '$primary9' }}>
          Join NFTEarth's Discord Community Server and earn XP!
        </Text>
      </Box>
      <Box>
        <Text style="h4" css={{ color: '$primary9' }}>
          Step 1: Join NFTEarth's Discord community server at the link below:
        </Text>
        <Box>
          <Box css={{ marginTop: '20px' }}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://discord.gg/nftearth"
              aria-label="Discord"
            >
              <Button
                size="xs"
                color="gray3"
                css={{
                  background: '#5865f2',

                  '&:hover': {
                    background: '$gray8',
                  },
                }}
                aria-label="Discord"
              >
                <FontAwesomeIcon icon={faDiscord} width={25} height={25} />
              </Button>
            </a>
          </Box>
        </Box>
      </Box>

      <Box css={{ padding: '$3' }}>
        <Text style="h4" css={{ color: '$primary9' }}>
          Step 2: Say hello! in the 👋 # welcome channel in NFTEarth's discord
          community server
        </Text>
        <Box>
          <Box css={{ marginTop: '20px' }}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://discord.com/channels/1062256160264171520/1062256161107230745"
              aria-label="Discord"
            >
              <Button
                size="xs"
                color="gray3"
                css={{
                  background: '#5865f2',

                  '&:hover': {
                    background: '$gray8',
                  },
                }}
                aria-label="Discord"
              >
                <FontAwesomeIcon icon={faDiscord} width={25} height={25} />
              </Button>
            </a>
          </Box>
        </Box>
      </Box>
      <Box css={{ marginTop: '20px' }}>
        <Text style="subtitle2" css={{ color: '$primary9' }}>
          Conditions:
        </Text>
        <ul>
          <li>
            <Text style="subtitle2" css={{ color: '$primary9' }}>
              *First 20 users to complete Quest are eligible
            </Text>
          </li>

          <li>
            <Text style="subtitle2" css={{ color: '$primary9' }}>
              *Reward is 100 $NFTE tokens
            </Text>
          </li>
        </ul>
      </Box>
    </Flex>
  )
}

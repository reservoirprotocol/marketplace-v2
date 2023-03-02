import { Flex, Box, Button, Text } from 'components/primitives'
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ModalProps {
  header: string;
  instruction: string;
  children: React.ReactNode;
}

const BasicModal = ({header, instruction, children}: ModalProps) => {
  return (
    <Flex direction="column" css={{ gap: '$4', minHeight: '53.1vh', justifyContent: 'center', padding: '$3' }}>
      <Box><Text style={{ '@initial': 'h4', '@lg': 'h3' }} css={{ color: '$primary9' }}> {header} </Text></Box>
      <Box><Text style={{ '@initial': 'h6', '@lg': 'h4' }} css={{ color: '$primary9' }}> Instructions: </Text></Box>
      <Box><Text style={{ '@initial': 'h6', '@lg': 'h5' }} css={{ color: '$primary9' }}> {instruction}</Text></Box>
      {children}
    </Flex>
  )
}

export const QuestRetweetModalContent = () => {
  return (
    <BasicModal
      header="Retweet Quest 🎁"
      instruction="Retweet this Tweet with Hashtag #NFTE and post it into the NFTEarth community channel Quest Proof"
    >
      <Box>
        <Flex justify="center" css={{ padding: '$3' }}>
          <Text style={{ '@initial': 'h6', '@lg': 'h4' }} css={{ marginLeft: '40px', color: '$primary9' }}>
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
        <Text style={{ '@initial': 'h6', '@lg': 'h4' }} css={{ color: '$primary9' }}>
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
        <Text style="subtitle2" css={{ color: '$primary9' }}>Conditions:</Text>
        <ul>
          <li><Text style="subtitle2" css={{ color: '$primary9' }}>*First 10 users to complete Quest are eligible</Text></li>
          <li><Text style="subtitle2" css={{ color: '$primary9' }}>*Reward is 50 $NFTE tokens</Text></li>
          <li><Text style="subtitle2" css={{ color: '$primary9' }}>*Must be real Twitter account</Text></li>
        </ul>
      </Box>
    </BasicModal>
  )
}

export const QuestPostProofModalContent = () => {
  return (
    <BasicModal
      header='List NFT in $NFTE on NFTEarth 🎁'
      instruction="List any NFT on NFTEarth in $NFTE with any listing duration time.
      Quest is fulfilled just by listing any NFT on Optimism or Arbitrum for
      any price of $NFTE and valid even if listing is not sold. You don't
      need to post any proof, we will check that automatically."
    >
      <Box>
        <Flex justify="center" css={{ padding: '$3' }}>
          <Text style={{ '@initial': 'h6', '@lg': 'h4' }} css={{ color: '$primary9' }}>Step 1: List your items. Below you can see the listed item shows.</Text>
          <Box><img src="/images/verified.png" width={40} /></Box>
        </Flex>
        <Box css={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <img src="/images/Quest_ListItem.png" width={500} />
        </Box>
      </Box>
      <Box css={{ padding: '$3' }}>
        <Text style={{ '@initial': 'h6', '@lg': 'h4' }} css={{ color: '$primary9' }}>
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
        <Text style="subtitle2" css={{ color: '$primary9' }}>Conditions:</Text>
        <ul>
          <li><Text style="subtitle2" css={{ color: '$primary9' }}>*First 20 users to complete Quest are eligible</Text></li>
          <li><Text style="subtitle2" css={{ color: '$primary9' }}>*Reward is 100 $NFTE tokens</Text></li>
        </ul>
      </Box>
    </BasicModal>
  )
}

export const QuestJoinDiscordModalContent = () => {
  return (
    <BasicModal
      header="Join NFTEarth's Discord Community Channel🎁"
      instruction="Join NFTEarth's Discord Community Server and earn XP!"
    >
      <Box>
        <Text style={{ '@initial': 'h6', '@lg': 'h4' }} css={{ color: '$primary9' }}>
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
        <Text style={{ '@initial': 'h6', '@lg': 'h4' }} css={{ color: '$primary9' }}>
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
    </BasicModal>
  )
}

export const QuestListNFTOnANYChain = () => {
  return (
      <BasicModal
        header="List at least ANY 1 NFT 🎁"
        instruction="List at least ANY 1 NFT in ANY currency at ANY price on ANY chain"
      >
        <Box>
          <Flex justify="center" css={{ padding: '$3' }}>
            <Text style={{
              '@initial': 'h6',
              '@lg': 'h4',
            }} css={{ color: '$primary9' }}>
              This is easy part. Have you listed NFT?
              If not, Please list a NFT in ANY currency at ANY price on ANY chain.
              Once you list your NFT, you will get XP for this.
            </Text>
          </Flex>
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
      </BasicModal>
  )
}
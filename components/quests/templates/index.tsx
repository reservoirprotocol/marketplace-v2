import { Flex, Box, Button, Text } from 'components/primitives'
import Image from 'next/image'
import Link from 'next/link'
import { ConnectWalletButton } from 'components/ConnectWalletButton'

interface ModalProps {
  header: string
  instruction: string
  children: React.ReactNode
}

const BasicModal = ({ header, instruction, children }: ModalProps) => {
  return (
    <Flex
      direction="column"
      css={{
        gap: '$4',
        minHeight: '53.1vh',
        padding: '$3',
      }}
    >
      <Flex css={{gap: '$5', alignItems: 'center'}}>
        <Image
          src="/nftearth-icon-new.png"
          width={50}
          height={50}
          alt="NFTEarth Logo"
        />
        <Flex direction="column">
          <Text
            style={{ '@initial': 'h5', '@lg': 'h4' }}
          >
            {header}
          </Text>
          <Text
            style={{ '@initial': 'subtitle2', '@lg': 'subtitle1' }}
            css={{ color: '$gray11' }}
          >
            {instruction}
          </Text>
        </Flex>
      </Flex>
      {children}
      <Flex direction="column" css={{ padding: '0 12px'}}>
        <Flex
          direction="column"  
          css={{
            background: '$gray4',
            borderRadius: '$xl',
            padding: '20px 30px'
          }}
        >
          <ConnectWalletButton />
        </Flex>
      </Flex>
    </Flex>
  )
}

export const QuestRegisterUserName = () => {
  return (
    <BasicModal
      header="Register a Username 🎁"
      instruction="Retweet this Tweet with Hashtag #NFTE and post it into the NFTEarth community channel Quest Proof"
    >
      <Box>
        <Flex direction="column" css={{ padding: '$3', gap: '$4' }}>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px'
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{color: '$primary10'}}>25 XP</Text>
          </Flex>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px',
              gap: '$2',
            }}
          >
            <Text css={{ color: '$gray11' }}>Instructions</Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
            >
              Step 1: Create your NFTEarth account
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Connect your Wallet on NFTEarth</Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{marginTop: '20px'}}
            >
              Step 2: Get Your XP !
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Verify and Get Your XP from the box below.</Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}

export const QuestFollowTwitter = () => {
  return (
    <BasicModal
      header="Follow @NFTEarth on Twitter 🎁"
      instruction="Connect Twitter account to your NFTEarth account and follow @NFTEarth on Twitter to Get Your XP."
    >
      <Box>
        <Flex direction="column" css={{ padding: '$3', gap: '$4' }}>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px'
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{color: '$primary10'}}>25 XP</Text>
          </Flex>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',  
              padding: '20px 30px',
              gap: '$2',
            }}
          >
            <Text css={{ color: '$gray11' }}>Instructions</Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
            >
              Step 1: Link a Twitter account to your Zonic account
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Browse to the Profile Settings page and link a Twitter account to your Zonic account.</Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{marginTop: '20px'}}
            >
              Step 2: Follow @NFTEarth on Twitter
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Follow @ZonicApp.</Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{marginTop: '20px'}}
            >
              Step 3: Get Your XP !
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Verify and Get Your XP from the box below.</Text>
            <Text style="subtitle2" css={{ color: '$gray11', marginTop: '10px' }}>Twitter account must be at least 30 days old.</Text>
            <Text style="subtitle2" css={{ color: '$gray11' }}>Each Twitter account can only be used to claim for this type of reward once in the system.</Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}

export const QuestRetweet = () => {
  return (
    <BasicModal
      header="Retweet a NFTEarth tweet 🎁"
      instruction="Retweet this tweet with #NFTE to earn XP now!"
    >
      <Box>
        <Flex direction="column" css={{ padding: '$3', gap: '$4' }}>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px'
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{color: '$primary10'}}>125 XP</Text>
          </Flex>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',  
              padding: '20px 30px',
              gap: '$2',
            }}
          >
            <Text css={{ color: '$gray11' }}>Instructions</Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
            >
              Step 1: Retweet a @NFTEarth's tweet
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Retweet this
              <Link href="https://twitter.com/NFTEarth_L2/status/1631555869778276354">
                <Text css={{color: '$primary10'}}> tweet</Text>
              </Link>.
            </Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{marginTop: '20px'}}
            >
              Step 2: Get Your XP !
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Verify and Get Your XP from the box below.</Text>
            <Text style="subtitle2" css={{ color: '$gray11', marginTop: '10px' }}>Twitter account must be at least 30 days old.</Text>
            <Text style="subtitle2" css={{ color: '$gray11' }}>Each Twitter account can only be used to claim for this type of reward once in the system.</Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}

export const QuestListNFT = () => {
  return (
    <BasicModal
      header="List NFT for sale on NFTEarth 🎁"
      instruction="List Any NFT of any supported blockchain (Optimism, Arbitrum) for sale on NFTEarth."
    >
      <Box>
        <Flex direction="column" css={{ padding: '$3', gap: '$4' }}>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px'
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{color: '$primary10'}}>125 XP</Text>
          </Flex>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',  
              padding: '20px 30px',
              gap: '$2',
            }}
          >
            <Text css={{ color: '$gray11' }}>Instructions</Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
            >
              Step 1: Check the NFTs you own
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Go to the
              <Link href="https://twitter.com/NFTEarth_L2/status/1631555869778276354">
                <Text css={{color: '$primary10'}}> My NFTs </Text>
              </Link>page, and then connect your wallet to view the NFTs you own.
            </Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{marginTop: '20px'}}
            >
              Step 2: List any NFT for sale
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Click on the NFTs you want to list for sale and then click at "Sell NFT" button to list them on the marketplace. You need to list at least 3 NFTs to be eligible to claim the reward.</Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{marginTop: '20px'}}
            >
              Step 3: Get Your XP !
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Verify and get your XP from the box below.</Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}

export const QuestJoinDiscord = () => {
  return (
    <BasicModal
      header="Join NFTEarth's Discord Community Channel 🎁"
      instruction="Join NFTEarth's Discord Community Server and earn XP!"
    >
      <Box>
        <Flex direction="column" css={{ padding: '$3', gap: '$4' }}>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px'
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{color: '$primary10'}}>125 XP</Text>
          </Flex>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',  
              padding: '20px 30px',
              gap: '$2',
            }}
          >
            <Text css={{ color: '$gray11' }}>Instructions</Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
            >
              Step 1: Join us on Discord
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Join.
              <Link href="https://discord.gg/nftearth">
                <Text css={{color: '$primary10'}}> NFTEarth Discord</Text>
              </Link>.
            </Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{marginTop: '20px'}}
            >
              Step 2: Verify your account
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Verify your account on ✅╎join-our-guild channel on our Discord server</Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{marginTop: '20px'}}
            >
              Step 3: Get Your XP !
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Verify and Get Your XP from the box below.</Text>
            <Text style="subtitle2" css={{ color: '$gray11', marginTop: '10px' }}>Each Discord account can only be used to claim for a reward once in the system.</Text>
            <Text style="subtitle2" css={{ color: '$gray11' }}>It might takes up to 5 minutes for our system to refresh the member list. If you just join the Discord server, please wait for 5-10 minutes and try to claim the reward again.</Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}

export const QuestBuyNFTInNFTEOnAnyChain = () => {
  return (
    <BasicModal
      header="NFT Trader 🎁"
      instruction="Buy an NFT for a total volume of 0.1 ETH on NFTEarth on any supported blockchain to claim a reward."
    >
      <Box>
        <Flex direction="column" css={{ padding: '$3', gap: '$4' }}>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px'
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{color: '$primary10'}}>200 XP</Text>
          </Flex>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',  
              padding: '20px 30px',
              gap: '$2',
            }}
          >
            <Text css={{ color: '$gray11' }}>Instructions</Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
            >
              Step 1: Purchasing NFT on Zonic
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              <Link href="https://nftearth.exchange/explore">
                <Text css={{color: '$primary10'}}>Explore </Text>
              </Link>NFTs on Optimism, Arbitrum using NFTEarth and make a purchase of any NFT you like until the total buying volume reaches 0.1 ETH.
            </Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{marginTop: '20px'}}
            >
              Step 2: Follow @NFTEarth on Twitter
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Follow @ZonicApp.</Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{marginTop: '20px'}}
            >
              Step 3: Get Your XP !
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>Verify and Get Your XP from the box below.</Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}
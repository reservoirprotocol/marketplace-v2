import { Flex, Box, Button, Text } from 'components/primitives'
import Image from 'next/image'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { useContext, useState } from 'react'
import { ToastContext } from '../../../context/ToastContextProvider'
import LoadingSpinner from '../../common/LoadingSpinner'

interface ModalProps {
  disabled: boolean
  id: number
  header: string
  instruction: string
  children: React.ReactNode
}

const BasicModal = ({
  disabled,
  id,
  header,
  instruction,
  children,
}: ModalProps) => {
  const { isConnected, address } = useAccount()
  const { addToast } = useContext(ToastContext)
  const [loading, setLoading] = useState(false)
  const handleEntry = async () => {
    setLoading(true)
    const response: any = await fetch(`/api/quest/entry`, {
      method: 'POST',
      body: JSON.stringify({
        questId: id,
        wallet: address,
      }),
    }).then((res) => res.json())

    if (response?.code !== 200) {
      addToast?.({
        title: 'ERROR',
        description: response.message,
      })
    }

    if (response?.code === 200) {
      addToast?.({
        title: 'SUCCESS',
        description: 'Exp Claimed',
      })
    }
    setLoading(false)
  }

  return (
    <Flex
      direction="column"
      css={{
        gap: '$4',
        minHeight: '53.1vh',
        padding: '$3',
      }}
    >
      <Flex css={{ gap: '$5', alignItems: 'center' }}>
        <Image
          src="/images/NFTQuest.png"
          width={130}
          height={100}
          alt="NFTEarth Logo"
        />
        <Flex direction="column">
          <Text style={{ '@initial': 'h5', '@lg': 'h4' }}>{header}</Text>
          <Text
            style={{ '@initial': 'subtitle2', '@lg': 'subtitle1' }}
            css={{ color: '$gray11' }}
          >
            {instruction}
          </Text>
        </Flex>
      </Flex>
      {children}
      <Flex direction="column" css={{ padding: '0 12px' }}>
        {isConnected ? (
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px',
            }}
          >
            <Button
              disabled={disabled || loading}
              onClick={handleEntry}
              css={{ display: 'flex', justifyContent: 'center' }}
            >
              {loading ? <LoadingSpinner /> : 'Verify and Claim'}
            </Button>
          </Flex>
        ) : (
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px',
            }}
          >
            <Text
              style="h5"
              css={{
                textAlign: 'center',
                marginBottom: '$3',
              }}
            >
              Connect your Wallet First
            </Text>
            <ConnectWalletButton />
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export const QuestRegisterUserName = ({ disabled }: { disabled: boolean }) => {
  return (
    <BasicModal
      disabled={disabled}
      id={1}
      header="Register a Username 🎁"
      instruction="Create an account with NFTEarth and register a username then post a screenshot into the NFTEarth community channel in Discord: Quest Proof"
    >
      <Box>
        <Flex direction="column" css={{ padding: '$3', gap: '$4' }}>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px',
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{ color: '$primary10' }}>
              25 XP
            </Text>
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
            <Text style={{ '@initial': 'h6', '@lg': 'h4' }}>
              Step 1: Create your NFTEarth account
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Connect your wallet on NFTEarth
            </Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{ marginTop: '20px' }}
            >
              Step 2: Verify XP, rewards, and $NFTE!
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Verify and claim your XP by clicking the button below.
            </Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}

export const QuestFollowTwitter = ({
  disabled,
  profile,
}: {
  disabled: boolean
  profile: any
}) => {
  return (
    <BasicModal
      id={2}
      disabled={disabled}
      header="Follow NFTEarth on Twitter 🎁"
      instruction="Connect your Twitter account with your NFTEarth user profile and follow NFTEarth on Twitter and earn XP."
    >
      <Box>
        <Flex direction="column" css={{ padding: '$3', gap: '$4' }}>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px',
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{ color: '$primary10' }}>
              25 XP
            </Text>
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
            <Text style={{ '@initial': 'h6', '@lg': 'h4' }}>
              Step 1: Link a Twitter account to your NFTEarth user profile
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Head to the profile page on NFTEarth and link your Twitter account
              to your NFTEarth user profile.
            </Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{ marginTop: '20px' }}
            >
              Step 2: Follow NFTEarth on Twitter
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Follow NFTEarth at
              <Link href="https://twitter.com/NFTEarth_L2">
                &nbsp;<Text css={{ color: '$primary10' }}>@NFTEarth_L2</Text>.
              </Link>
            </Text>
            <Text
              style="subtitle2"
              css={{ color: '$gray11', marginTop: '10px' }}
            >
              Verify and claim your XP by clicking the button below.
            </Text>
            <Text
              style="subtitle2"
              css={{ color: '$gray11', marginTop: '10px' }}
            >
              Twitter account must be at least 30 days old.
            </Text>
            <Text style="subtitle2" css={{ color: '$gray11' }}>
              Each Twitter account can only be used to claim for this type of
              reward one-time.
            </Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}

export const QuestRetweet = ({
  disabled,
  profile,
}: {
  disabled: boolean
  profile: any
}) => {
  return (
    <BasicModal
      disabled={disabled}
      id={3}
      header="Retweet a NFTEarth tweet 🎁"
      instruction="Retweet this tweet with the hashtag #NFTE to earn XP now!"
    >
      <Box>
        <Flex direction="column" css={{ padding: '$3', gap: '$4' }}>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px',
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{ color: '$primary10' }}>
              125 XP
            </Text>
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
            <Text style={{ '@initial': 'h6', '@lg': 'h4' }}>
              Step 1: Retweet a NFTEarth's tweet
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Retweet this
              <Link href="https://twitter.com/NFTEarth_L2/status/1631555869778276354">
                <Text css={{ color: '$primary10' }}> tweet</Text>
              </Link>
              .
            </Text>
            <Text
              style="subtitle2"
              css={{ color: '$gray11', marginTop: '10px' }}
            >
              Verify and claim your XP by clicking the button below.
            </Text>
            <Text
              style="subtitle2"
              css={{ color: '$gray11', marginTop: '10px' }}
            >
              Twitter account must be at least 30 days old.
            </Text>
            <Text style="subtitle2" css={{ color: '$gray11' }}>
              Each Twitter account can only be used to claim for this type of
              reward once in the system.
            </Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}

export const QuestListNFT = ({ disabled }: { disabled: boolean }) => {
  return (
    <BasicModal
      disabled={disabled}
      id={5}
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
              padding: '20px 30px',
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{ color: '$primary10' }}>
              125 XP
            </Text>
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
            <Text style={{ '@initial': 'h6', '@lg': 'h4' }}>
              Step 1: See your portfolio of NFTs
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Go to the
              <Link href="/portfolio">
                <Text css={{ color: '$primary10' }}> My NFTs </Text>
              </Link>
              page, and then connect your wallet to view the NFTs you own.
            </Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{ marginTop: '20px' }}
            >
              Step 2: List any NFT for sale
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Click on the NFT you would like to trade and list it for sale on
              NFTEarth marketplace. You need to list Any NFT in any currency to
              be eligible to claim the reward.
            </Text>

            <Text
              style="subtitle2"
              css={{ color: '$gray11', marginTop: '10px' }}
            >
              Verify and claim your XP by clicking the button below.
            </Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}

export const QuestJoinDiscord = ({
  disabled,
  profile,
}: {
  disabled: boolean
  profile: any
}) => {
  return (
    <BasicModal
      disabled={disabled}
      id={4}
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
              padding: '20px 30px',
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{ color: '$primary10' }}>
              125 XP
            </Text>
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
            <Text style={{ '@initial': 'h6', '@lg': 'h4' }}>
              Step 1: Link a Discord account to your NFTEarth user profile
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Head to the profile page on NFTEarth and link your Discord account
              to your NFTEarth user profile.
            </Text>
            <Text css={{ color: '$gray11' }}>Instructions</Text>
            <Text style={{ '@initial': 'h6', '@lg': 'h4' }}>
              Step 2: Join us on Discord
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Join.
              <Link href="https://discord.gg/nftearth">
                <Text css={{ color: '$primary10' }}> NFTEarth Discord</Text>
              </Link>
              .
            </Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{ marginTop: '20px' }}
            >
              Step 3: Verify your account
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Verify your account on ✅╎join-our-guild channel on our Discord
              server
            </Text>
            <Text
              style="subtitle2"
              css={{ color: '$gray11', marginTop: '10px' }}
            >
              Verify and claim your XP by clicking the button below.
            </Text>

            <Text
              style="subtitle2"
              css={{ color: '$gray11', marginTop: '10px' }}
            >
              Each Discord account can only be used to claim for a reward one
              time.
            </Text>
            <Text style="subtitle2" css={{ color: '$gray11' }}>
              It may take up to 5 minutes for the system to refresh your user
              profile. If you just joined the Discord server, please wait for
              5-10 minutes and try to claim the reward again if it is not
              working immediately.
            </Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}

export const QuestBuyNFTInNFTEOnAnyChain = ({
  disabled,
}: {
  disabled: boolean
}) => {
  return (
    <BasicModal
      disabled={disabled}
      id={8}
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
              padding: '20px 30px',
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{ color: '$primary10' }}>
              200 XP
            </Text>
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
            <Text style={{ '@initial': 'h6', '@lg': 'h4' }}>
              Step 1: Buying NFTs on NFTEarth
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              <Link href="/explore">
                <Text css={{ color: '$primary10' }}>Explore </Text>
              </Link>
              NFTs on Optimism, Arbitrum using NFTEarth and buy for total amount equal or over 0,1 $ETH
              in total volume.
            </Text>

            <Text style="subtitle1" css={{ color: '$gray11' }}>
              NB! Volume criteria should be fulfilled while Quest is active! Our
              intention is to leave it open/active for at least 24h from
              opening/activation, however, we leave the right to close it also
              later (or earlier)!
            </Text>

            <Text style="subtitle2" css={{ color: '$gray11' }}>
              Verify and claim your XP by clicking the button below.
            </Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}

export const QuestListNFTInNFTEOnAnyChain = ({
  disabled,
}: {
  disabled: boolean
}) => {
  return (
    <BasicModal
      id={7}
      disabled={disabled}
      header="List NFT for sale on NFTEarth on NFTE currency🎁"
      instruction="List Any NFT of any supported blockchain (Optimism, Arbitrum) in $NFTE for sale on NFTEarth."
    >
      <Box>
        <Flex direction="column" css={{ padding: '$3', gap: '$4' }}>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px',
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{ color: '$primary10' }}>
              150 XP
            </Text>
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
            <Text style={{ '@initial': 'h6', '@lg': 'h4' }}>
              Step 1: See your portfolio of NFTs
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Go to the
              <Link href="/portfolio">
                <Text css={{ color: '$primary10' }}> My NFTs </Text>
              </Link>
              page, and then connect your wallet to view the NFTs you own.
            </Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{ marginTop: '20px' }}
            >
              Step 2: List any NFT for sale in $NFTE currency
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Click on the NFTs you want to trade and click List to sell it on
              the NFT on the marketplace. You need to list at least 3 NFTs to be
              eligible to claim the reward. Make sure it is listed in $NFTE
              currency. Double XP is listed more than 5.
            </Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{ marginTop: '20px' }}
            >
              Step 3: Earn your XP!
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Verify and claim your XP by clicking the button below.
            </Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}

export const QuestMakeOfferForNFT = ({ disabled }: { disabled: boolean }) => {
  return (
    <BasicModal
      disabled={disabled}
      id={6}
      header="Make Offer for ANY NFT on NFTEarth🎁"
      instruction="Make offer on ANY NFT for ANY amount and currency on ANY chain on NFTEarth."
    >
      <Box>
        <Flex direction="column" css={{ padding: '$3', gap: '$4' }}>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px',
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{ color: '$primary10' }}>
              125 XP
            </Text>
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
            <Text style={{ '@initial': 'h6', '@lg': 'h4' }}>
              Step 1: Go to explore page and check out all NFT collections
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Go to the
              <Link href="/explore">
                <Text css={{ color: '$primary10' }}> Collections </Text>
              </Link>
              page, and view the different collections of NFTs on the
              marketplace.
            </Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{ marginTop: '20px' }}
            >
              Step 2: Make an offer for any NFT on sale
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Click on the NFTs you want to make an offer for and click "Make
              Offer" to make an offer for the the NFT on the marketplace
            </Text>

            <Text
              style="subtitle2"
              css={{ color: '$gray11', marginTop: '10px' }}
            >
              Verify and claim your XP by clicking the button below.
            </Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}

export const QuestLeaderboard = ({ disabled }: { disabled: boolean }) => {
  return (
    <BasicModal
      disabled={disabled}
      id={6}
      header="Earn a place on the leaderboard🎁"
      instruction="Make listings and offers to earn XP and appear on the leaderboard each day!"
    >
      <Box>
        <Flex direction="column" css={{ padding: '$3', gap: '$4' }}>
          <Flex
            direction="column"
            css={{
              background: '$gray4',
              borderRadius: '$xl',
              padding: '20px 30px',
            }}
          >
            <Text>Rewards</Text>
            <Text style="h4" css={{ color: '$primary10' }}>
              50 XP
            </Text>
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
            <Text style={{ '@initial': 'h6', '@lg': 'h4' }}>
              Step 1: Go to explore page and check out all NFT collections
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Go to the
              <Link href="/explore">
                <Text css={{ color: '$primary10' }}> Collections </Text>
              </Link>
              page, and view the different collections of NFTs on the
              marketplace.
            </Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{ marginTop: '20px' }}
            >
              Step 2: Make a listing or offer for any NFT on sale
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Click on the NFTs you want to make an offer for and click "Make
              Offer" to make an offer for the the NFT on the marketplace
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Go to the
              <Link href="/portfolio">
                <Text css={{ color: '$primary10' }}> My NFTs </Text>
              </Link>
              page, and then connect your wallet to view the NFTs you own.
            </Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{ marginTop: '20px' }}
            >
              Step 3: List any NFT for sale
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Click on the NFTs you want to trade and click List to sell it on
              the NFT on the marketplace. You need to list Any NFT in any
              currency to be eligible to claim the reward.
            </Text>
            <Text
              style={{ '@initial': 'h6', '@lg': 'h4' }}
              css={{ marginTop: '20px' }}
            >
              Step 4: Earn your XP!
            </Text>
            <Text style="subtitle1" css={{ color: '$gray11' }}>
              Verify and claim your XP by clicking the button below, and check
              if you appear on the leaderboard!
            </Text>
          </Flex>
        </Flex>
      </Box>
    </BasicModal>
  )
}

import {Box, Grid, Text, Flex, Button} from 'components/primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import useEligibleAirdropSignature from 'hooks/useEligibleAirdropSignature'
import {
  useAccount,
  useNetwork,
  usePrepareContractWrite,
  useSendTransaction,
  useSwitchNetwork,
  useWaitForTransaction
} from "wagmi";
import * as Dialog from '@radix-ui/react-dialog'
import Link from "next/link";
import {useMounted} from "hooks";
import {RewardButton} from "./styled";
import {AnimatedOverlay} from "../primitives/Dialog";

const NFTEAirdropClaimABI = require('abi/NFTEAirdropClaimABI.json');

type Props = {
  title: string
  description: string
  image: string
}

export const ClaimReward = ({ title, description, image }: Props) => {
  const isMounted = useMounted()
  // Get Eligable Address with useEligibleAirdropSignature Custom Hook
  const { data: signature, isLoading: isLoadingSignature } = useEligibleAirdropSignature()
  const { chain: activeChain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address } = useAccount();
  const { config, error: preparedError } = usePrepareContractWrite({
    address: signature ? '0xfA1c8Cd6B3A5eaD9499B8d09F9747c4068f88f37' : '',
    abi: NFTEAirdropClaimABI,
    functionName: 'claim',
    args: [signature],
    overrides: {
      from: address,
    },
  })
  const { data, sendTransaction, isLoading: isLoadingWallet, error } = useSendTransaction(config)
  const { isLoading: isLoadingTransaction, isSuccess = true, data: txData } = useWaitForTransaction({
    hash: data?.hash,
  })

  const tweetText = `I just claimed my $NFTE #Airdrop on @NFTEarth_L2!\n\n🎉 LFG #NFTE is #BetterThanBlue 🎉\n\n`

  return (
    <div>
      <Box
        css={{
          borderRadius: '16px',
          gap: '$1',
          width: '100%',
          position: 'relative',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          '@xs': {
            padding: '64px 24px',
          },
          '@lg': {
            padding: '100px 64px',
          },
        }}
      >
        <Flex>
          <Grid
            css={{
              gap: 32,
              '@xs': {
                flex: 1,
              },
              '@lg': {
                flex: 0.5,
              },
            }}
          >
            <Text
              style={{
                '@initial': 'h3',
                '@lg': 'h2',
              }}
              css={{
                fontWeight: 700,
              }}
            >
              {title}
            </Text>

            <Text
              style={{
                '@initial': 'h4',
                '@lg': 'h4',
              }}
            >
              {description}
            </Text>
            <RewardButton
              disabled={!signature || isLoadingTransaction || !isLoadingWallet || !!preparedError || isSuccess}
              onClick={async () => {
                if (activeChain?.id !== 10) {
                  await switchNetworkAsync?.(10);
                }
                sendTransaction?.();
              }}
              css={{
                background: '#6BE481',
                borderRadius: '10px',
                padding: '$1',
                width: '30%',
                justifyContent: 'center'
              }}
            >
              <Text style="h6" css={{ color: 'black' }}>
                Claim $NFTE
              </Text>
            </RewardButton>
            {!!preparedError && (
              <Text style="h6" css={{ color: 'red' }}>{(preparedError as any)?.reason || preparedError?.message}</Text>
            )}
          </Grid>
        </Flex>
      </Box>
      {isMounted && (
        <Dialog.Root modal={true} open={!!error || isLoadingWallet || isLoadingTransaction || isSuccess}>
          <Dialog.Portal>
            <AnimatedOverlay
              style={{
                position: 'fixed',
                zIndex: 1000,
                inset: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: '20px',
              }}
            />
            <Dialog.Content style={{
              outline: 'unset',
              position: 'fixed',
              top: '60%',
              zIndex: 1000,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
            }}>
              <Flex
                justify="between"
                css={{
                  pt: '$5',
                  background: '$gray7',
                  padding: '$5',
                  borderRadius: '20px',
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
                {isLoadingWallet && (
                  <Text style="h6">Please confirm in your wallet</Text>
                )}
                {isLoadingTransaction && (
                  <Text style="h6">Processing your claim...</Text>
                )}
                {isSuccess && (
                  <Text style="h6" css={{ color: 'green' }}>Claim Airdrop Success !</Text>
                )}
                {!!error && (
                  <Text style="h6" css={{ color: 'red' }}>{(error as any)?.reason || error?.message}</Text>
                )}
                {isSuccess && (
                  <Link
                    rel="noreferrer noopener"
                    target="_blank"
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(`https://nftearth.exchange/claim`)}&hashtags=&via=&related=&original_referer=${encodeURIComponent('https://nftearth.exchange')}`}>
                    <Button css={{ mt: '$3' }}>
                      {`Tweet your airdrop win!`}
                      <FontAwesomeIcon style={{ marginLeft: 5 }} icon={faTwitter}/>
                    </Button>
                  </Link>
                )}
              </Flex>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  )
}

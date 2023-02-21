import { Box, Grid, Text, Flex } from 'components/primitives'
import { RewardContent, RewardButton } from './styled'
import useEligibleAirdropSignature from "hooks/useEligibleAirdropSignature";
import {
  useAccount,
  useNetwork,
  usePrepareContractWrite,
  useSendTransaction,
  useSwitchNetwork,
  useWaitForTransaction
} from "wagmi";

const NFTEAirdropClaimABI = require('abi/NFTEAirdropClaimABI.json');

type Props = {
  title: string
  description: string
  image: string
}

export const ClaimReward = ({ title, description, image }: Props) => {
  const signature = useEligibleAirdropSignature()
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
  const { data, sendTransaction, isLoading, error } = useSendTransaction(config)
  const { isLoading: isLoadingTransaction, isSuccess = true, data: txData } = useWaitForTransaction({
    hash: data?.hash,
  })

  return (
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
            disabled={!signature || isLoadingTransaction || !!preparedError || isSuccess}
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
            }}
          >
            <Text
              css={{
                color: 'black',
                textAlign: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontWeight: 700,
              }}
            >
              Claim $NFTE
            </Text>
          </RewardButton>
          {isSuccess && (
            <Text css={{ color: 'green' }}>Claim Airdrop Success</Text>
          )}
          {(!!preparedError || !!error) && (
            <Text css={{ color: 'red' }}>{((error || preparedError) as any)?.reason || (error || preparedError)?.message}</Text>
          )}
        </Grid>
      </Flex>
    </Box>
  )
}

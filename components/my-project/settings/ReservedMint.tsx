import {useState, FC, SyntheticEvent, useContext} from 'react'
import { useTheme } from 'next-themes'
import { Text, Flex, Box, Input, Button, Grid } from 'components/primitives'
import { StyledInput } from "components/primitives/Input";
import {ToastContext} from "context/ToastContextProvider";
import {useLaunchpads, useMarketplaceChain} from "hooks";
import {useContractWrite} from "wagmi";
import LaunchpadArtifact from "../../../artifact/NFTELaunchpad.json";

type Props = {
  launchpad: ReturnType<typeof useLaunchpads>["data"][0]
}

const ReservedMint:FC<Props> = ({ launchpad }) => {
  console.log(launchpad.allowlists);
  const { theme } = useTheme();
  const { addToast } = useContext(ToastContext)
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('1');
  const [ loading, setLoading ] = useState(false)
  const marketplaceChain = useMarketplaceChain()

  const { writeAsync: mintReservedNFT } = useContractWrite({
    mode: 'recklesslyUnprepared',
    abi: LaunchpadArtifact.abi,
    address: launchpad.id as `0x${string}`,
    functionName: 'reservedMint',
    args: [address, amount],
    chainId: marketplaceChain.id
  })

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setLoading(true);
    console.log('Submit')

    try {
      mintReservedNFT?.();

      addToast?.({
        title: 'success',
        description: 'Mint Success'
      })
    } catch (err: any) {
      addToast?.({
        title: 'error',
        description: err.message
      })
    }

    setLoading(false)
  }

  return (
    <Box
      css={{
        width: '100%',
        '@md': {
          marginLeft: 4,
          width: '60%'
        },
        '@lg': {
          marginLeft: 4,
          width: '50%'
        }
      }}>
      <Box 
        css={{ 
          marginBottom: 18
        }}>
        <Text style='h4'>
          Reserved Mint
        </Text>
      </Box>
      <Box css={{ marginBottom: 8 }}>
        <Flex direction='column'>
          <Text style="h6" css={{ color: '$gray11' }}>Mint your reserved NFTs</Text>
        </Flex>
      </Box>
      <Box css={{ marginBottom: 8 }}>
        <Grid
          css={{
            gap: '$4',
            gridTemplateColumns: '8fr 1fr',
          }}>
          <Box css={{ position: 'relative', width: '100%' }}>
            <StyledInput
              value={address}
              disabled={loading}
              onChange={(e) => setAddress(e.target.value)}
              placeholder='0x7D3E5dD617EAF4A3d....'
              css={{
                backgroundColor: theme === 'light' ? '$gray1' : 'initial',
                marginTop: 6,
                width: '100%',
                border: '1px solid $gray8',
                borderRadius: 6,
                boxSizing: 'border-box'
              }}
            />
          </Box>
          <Box css={{ position: 'relative', width: '100%' }}>
            <StyledInput
              type="number"
              disabled={loading}
              value={amount}
              placeholder="0"
              min={1}
              onKeyDown={(e) => ['e', '+', '-'].includes(e.key) && e.preventDefault()}
              onChange={(e) => setAmount(e.target.value)}
              css={{
                backgroundColor: theme === 'light' ? '$gray1' : 'initial',
                marginTop: 6,
                width: '100%',
                border: '1px solid $gray8',
                borderRadius: 6,
                pr: 32,
                boxSizing: 'border-box',
              }}
            />
          </Box>
        </Grid>
      </Box>
      <Button 
        onClick={handleSubmit}
        disabled={loading}
        css={{ 
          margin: '12px 0',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          justifyItems: 'center',
        }}>
        Mint
      </Button>
    </Box>
  )
}

export default ReservedMint
import {useState, useEffect, FC, SyntheticEvent, KeyboardEvent, ChangeEvent, useContext} from 'react'
import { useTheme } from 'next-themes'
import { Text, Flex, Box, Switch, Button } from 'components/primitives'
import { StyledInput } from "components/primitives/Input"
import {ToastContext} from "context/ToastContextProvider";
import LaunchpadArtifact from 'artifact/NFTELaunchpad.json'
import {ethers} from "ethers";
import {useMarketplaceChain} from "../../../hooks";
import { useContractWrite } from "wagmi";

type Props = {
  address: `0x${string}`
  activePresale: boolean
  presalePrice: string
  activePublic: boolean
  publicPrice: string
}

const MintStateSettings:FC<Props> = ({ address, activePresale = false, presalePrice = '0', activePublic = false, publicPrice = '0' }) => {
  const { theme } = useTheme();
  const { addToast } = useContext(ToastContext)
  const [ loading, setLoading ] = useState(false)
  const [isAllowlistMint, setIsAllowlistMint] = useState(activePresale);
  const [allowlistMintPrice, setAllowlistMintPrice] = useState(ethers.utils.formatEther(`${presalePrice || '0'}`).toString());
  const [isPublicMint, setIsPublicMint] = useState(activePublic);
  const [publicMintPrice, setPublicMintPrice] = useState(ethers.utils.formatEther(`${publicPrice || '0'}`).toString());
  const marketplaceChain = useMarketplaceChain()

  const { writeAsync: updateActiveSale } = useContractWrite({
    mode: 'recklesslyUnprepared',
    abi: LaunchpadArtifact.abi,
    address,
    functionName: 'setActiveSale',
    args: [isAllowlistMint, isPublicMint],
    chainId: marketplaceChain.id
  })

  const { writeAsync: updateSalePrice } = useContractWrite({
    mode: 'recklesslyUnprepared',
    abi: LaunchpadArtifact.abi,
    address,
    functionName: 'setPrice',
    args: [
      ethers.utils.parseEther(allowlistMintPrice).toString(),
      ethers.utils.parseEther(publicMintPrice).toString()
    ],
    chainId: marketplaceChain.id
  })

  const config = {
    abi: LaunchpadArtifact.abi,
    address
  }

  useEffect(() => {
    setIsAllowlistMint(activePresale);
    setAllowlistMintPrice(ethers.utils.formatEther(`${presalePrice || '0'}`).toString());
    setIsPublicMint(activePublic);
    setPublicMintPrice(ethers.utils.formatEther(`${publicPrice || '0'}`).toString());
  }, [activePresale, activePublic, presalePrice, publicPrice])

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      await updateActiveSale?.();
      await updateSalePrice?.();

      addToast?.({
        title: 'success',
        description: 'Mint state updated'
      })
    } catch (e: any) {
      console.log(e);
      addToast?.({
        title: 'error',
        description: e.reason || e.message
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
          Mint Settings
        </Text>
      </Box>
      <Box css={{ marginBottom: 32 }}>
        <Flex justify="between">
          <Flex direction="column">
            <Text style="h6" css={{ color: '$gray11' }}>Public Mint</Text>
          </Flex>
          <Box>
            <Switch
              disabled={loading}
              checked={isPublicMint}
              onCheckedChange={checked => setIsPublicMint(checked)}
            />
          </Box>
        </Flex>
          {isPublicMint && (
            <Box css={{ width: '100%', marginTop: 12 }}>
              <Text style='subtitle2' css={{ color: '$gray11', fontWeight: 'bold' }}>Public Mint Price</Text>
              <Box 
                css={{ 
                  position: 'relative', 
                  width: '100%',
                  '@md': {
                    width: '50%',
                  }
                }}>
                <StyledInput
                  type="number"
                  disabled={loading}
                  value={publicMintPrice}
                  placeholder="0"
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => ['e', '+', '-'].includes(e.key) && e.preventDefault()}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPublicMintPrice(e.target.value)}
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
                <Flex
                  align='center' 
                  css={{ 
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    padding: '12px 12px',
                    boxSizing: 'border-box',
                    borderTopRightRadius: 6,
                    borderBottomRightRadius: 6,
                    borderLeft: '1px solid $gray10'
                  }}>
                  <Text
                    style='subtitle2' 
                    css={{ 
                      fontWeight: 'bold'
                    }}>
                    ETH
                  </Text>
                </Flex>
              </Box>
            </Box>
          )
        }
      </Box>
      <Box css={{ marginBottom: 32 }}>
        <Flex justify="between">
          <Flex direction="column">
            <Text style="h6" css={{ color: '$gray11' }}>Allowlist Mint</Text>
          </Flex>
          <Box>
            <Switch
              checked={isAllowlistMint}
              disabled={loading}
              onCheckedChange={checked => setIsAllowlistMint(checked)}
            />
          </Box>
        </Flex>
          {isAllowlistMint && (
            <Box css={{ width: '100%', marginTop: 12 }}>
              <Text style='subtitle2' css={{ color: '$gray11', fontWeight: 'bold' }}>Allowlist Mint Price</Text>
              <Box 
                css={{ 
                  position: 'relative', 
                  width: '100%',
                  '@md': {
                    width: '50%',
                  }
                }}>
                <StyledInput
                  type="number"
                  disabled={loading}
                  value={allowlistMintPrice}
                  placeholder="0"
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => ['e', '+', '-'].includes(e.key) && e.preventDefault()}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setAllowlistMintPrice(e.target.value)}
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
                <Flex
                  align='center' 
                  css={{ 
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    padding: '12px 12px',
                    boxSizing: 'border-box',
                    borderTopRightRadius: 6,
                    borderBottomRightRadius: 6,
                    borderLeft: '1px solid $gray10'
                  }}>
                  <Text
                    style='subtitle2' 
                    css={{ 
                      fontWeight: 'bold'
                    }}>
                    ETH
                  </Text>
                </Flex>
              </Box>
            </Box>
          )
        }
      </Box>
      <Button
        disabled={loading}
        onClick={handleSubmit}
        css={{ 
          margin: '12px 0',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          justifyItems: 'center',
        }}>
        Save
      </Button>
    </Box>
  )
}

export default MintStateSettings
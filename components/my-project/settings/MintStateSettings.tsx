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
  contractData: any
}

const MintStateSettings:FC<Props> = ({ address, contractData }) => {
  const [
    activePresale,
    activePublic,
    presalePrice,
    publicPrice,
    URI,
    reservedSupply,
    presaleSupply
  ] = contractData || [];
  const { theme } = useTheme();
  const { addToast } = useContext(ToastContext)
  const [ loading, setLoading ] = useState(false)
  const [totalReservedSupply, setTotalReservedSupply] = useState(reservedSupply);
  const [totalPresaleSupply, setTotalPresaleSupply] = useState(presaleSupply);
  const [isActivePresale, setIsActivePresale] = useState(activePresale);
  const [presaleMintPrice, setPresaleMintPrice] = useState(ethers.utils.formatEther(`${presalePrice || '0'}`).toString());
  const [isActivePublic, setIsActivePublic] = useState(activePublic);
  const [publicMintPrice, setPublicMintPrice] = useState(ethers.utils.formatEther(`${publicPrice || '0'}`).toString());
  const marketplaceChain = useMarketplaceChain()

  const { writeAsync: updateActiveSale } = useContractWrite({
    mode: 'recklesslyUnprepared',
    abi: LaunchpadArtifact.abi,
    address,
    functionName: 'setActiveSale',
    args: [isActivePresale, isActivePublic],
    chainId: marketplaceChain.id
  })

  const { writeAsync: updateSalePrice } = useContractWrite({
    mode: 'recklesslyUnprepared',
    abi: LaunchpadArtifact.abi,
    address,
    functionName: 'setPrice',
    args: [
      ethers.utils.parseEther(presaleMintPrice).toString(),
      ethers.utils.parseEther(publicMintPrice).toString()
    ],
    chainId: marketplaceChain.id
  })

  const { writeAsync: adjustPresaleSupply } = useContractWrite({
    mode: 'recklesslyUnprepared',
    abi: LaunchpadArtifact.abi,
    address,
    functionName: 'adjustSupply',
    args: [
      1,
      totalPresaleSupply
    ],
    chainId: marketplaceChain.id
  })

  const { writeAsync: adjustReservedSupply } = useContractWrite({
    mode: 'recklesslyUnprepared',
    abi: LaunchpadArtifact.abi,
    address,
    functionName: 'adjustSupply',
    args: [
      0,
      totalReservedSupply
    ],
    chainId: marketplaceChain.id
  })

  useEffect(() => {
    setIsActivePresale(activePresale);
    setPresaleMintPrice(ethers.utils.formatEther(`${presalePrice || '0'}`).toString());
    setIsActivePublic(activePublic);
    setPublicMintPrice(ethers.utils.formatEther(`${publicPrice || '0'}`).toString());
    setTotalReservedSupply(reservedSupply)
    setTotalPresaleSupply(presaleSupply)
  }, [activePresale, activePublic, presalePrice, publicPrice, reservedSupply, presaleSupply])

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const newPresalePrice = ethers.utils.parseEther(presaleMintPrice)
      const newPublicPrice = ethers.utils.parseEther(publicMintPrice)

      if (+presaleSupply !== +totalPresaleSupply) {
        await adjustPresaleSupply?.()
      }

      if (+reservedSupply !== +totalReservedSupply) {
        await adjustReservedSupply?.()
      }

      if (isActivePresale !== activePresale || isActivePublic !== activePublic) {
        await updateActiveSale?.();
      }

      if (!presalePrice.eq(newPresalePrice) || !publicPrice.eq(newPublicPrice)) {
        await updateSalePrice?.();
      }

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
      <Flex direction="column" css={{ marginBottom: 32, gap: 24 }}>
        <Flex justify="between">
          <Flex direction="column">
            <Text style="h6" css={{ color: '$gray11' }}>Public Mint</Text>
          </Flex>
          <Box>
            <Switch
              disabled={loading}
              checked={isActivePublic}
              onCheckedChange={checked => setIsActivePublic(checked)}
            />
          </Box>
        </Flex>
        <Flex justify="between" direction="row">
          <Flex direction="column" justify="center">
            <Text style="h6" css={{ color: '$gray11' }}>Public Mint Price</Text>
          </Flex>
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
              min={0}
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
        </Flex>
      </Flex>
      <Flex direction="column" css={{ marginBottom: 32, gap: 24 }}>
        <Flex justify="between">
          <Flex direction="column">
            <Text style="h6" css={{ color: '$gray11' }}>Allowlist Mint</Text>
          </Flex>
          <Flex>
            <Switch
              checked={isActivePresale}
              disabled={loading}
              onCheckedChange={checked => setIsActivePresale(checked)}
            />
          </Flex>
        </Flex>
        <Flex justify="between" direction="row">
          <Flex direction="column" justify="center">
            <Text style="h6" css={{ color: '$gray11' }}>Allowlist Mint Price</Text>
          </Flex>
          <Flex
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
              value={presaleMintPrice}
              min={0}
              placeholder="0"
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => ['e', '+', '-'].includes(e.key) && e.preventDefault()}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPresaleMintPrice(e.target.value)}
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
          </Flex>
        </Flex>
        <Flex justify="between" direction="row">
          <Flex direction="column" justify="center">
            <Text style="h6" css={{ color: '$gray11' }}>Allowlist Supply</Text>
          </Flex>
          <Flex
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
              value={totalPresaleSupply}
              placeholder="0"
              min={0}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => ['e', '+', '-'].includes(e.key) && e.preventDefault()}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTotalPresaleSupply(e.target.value)}
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
          </Flex>
        </Flex>
        <Flex justify="between" direction="row">
          <Flex direction="column" justify="center">
            <Text style="h6" css={{ color: '$gray11' }}>Reserved Supply</Text>
          </Flex>
          <Flex
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
              value={totalReservedSupply}
              placeholder="0"
              min={0}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => ['e', '+', '-'].includes(e.key) && e.preventDefault()}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTotalReservedSupply(e.target.value)}
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
          </Flex>
        </Flex>
      </Flex>
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
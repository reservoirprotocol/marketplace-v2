import {useState, useEffect, FC, SyntheticEvent, useContext} from 'react'
import { useTheme } from 'next-themes'
import { useContractWrite } from 'wagmi'
import { Text, Box, Input, Button, Tooltip, Flex } from 'components/primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import {ToastContext} from "context/ToastContextProvider";
import LaunchpadArtifact from 'artifact/NFTELaunchpad.json'
import {useMarketplaceChain} from "../../../hooks";


type Props = {
  uri: string | undefined
  address: `0x${string}`
}

const MintStateSettings:FC<Props> = ({ address, uri }) => {
  const { theme } = useTheme();
  const { addToast } = useContext(ToastContext)
  const [ loading, setLoading ] = useState(false)
  const marketplaceChain = useMarketplaceChain()

  const [metadataUrl, setMetadataUrl] = useState(uri)
  const { writeAsync } = useContractWrite({
    mode: 'recklesslyUnprepared',
    abi: LaunchpadArtifact.abi,
    address,
    functionName: 'setBaseURI',
    args: [metadataUrl],
    chainId: marketplaceChain.id
  })

  useEffect(() => {
    setMetadataUrl(uri)
  }, [uri])

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      await writeAsync?.()
      addToast?.({
        title: 'success',
        description: 'Metadata URI Updated'
      })
    } catch (e: any) {
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
          Metadata Settings
        </Text>
      </Box>
      <Box css={{ marginBottom: 32 }}>
        <Text style="h6" css={{ color: '$gray11' }}>Metadata URL</Text>
        <Input
          value={metadataUrl}
          disabled={loading}
          onChange={(e) => setMetadataUrl(e.target.value)}
          placeholder='ipfs://bafybeih56xkvkgf...L'
          css={{ backgroundColor: theme === 'light' ? '$gray1' : 'initial' }}
          containerCss={{
            marginTop: 6,
            width: '100%',
            border: '1px solid $gray8',
            borderRadius: 6,
          }}
        />
      </Box>
      <Button
        disabled={loading}
        onClick={handleSubmit}
        css={{ 
          marginBottom: 12,
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
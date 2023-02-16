import { useState, useEffect, FC, SyntheticEvent } from 'react'
import { useTheme } from 'next-themes'
import { Text, Box, Input, Button, Tooltip, Flex } from 'components/primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

type Props = {
  activeTab: string | null
}

const MintStateSettings:FC<Props> = ({ activeTab }) => {
  const { theme } = useTheme();

  const [metadataUrl, setMetadataUrl] = useState('')
  
  const resetState = () => {
   setMetadataUrl('')
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // TODO: Fetch to API
  }

  useEffect(() => {
    if (activeTab !== 'royalities') resetState();
  }, [activeTab])

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
        <Flex css={{ gap: '$1' }}>
          <Text style="h6" css={{ color: '$gray11' }}>Metadata URL</Text>
          <Tooltip
            content={
              <Flex>
                <Text style="body2" css={{ mx: '$2', maxWidth: '200px' }}>
                  The floor price with royalties and fees removed. This is the eth
                  you would receive if you listed at the floor.
                </Text>
              </Flex>
            }>
            <Text css={{ color: '$gray9' }}>
              <FontAwesomeIcon icon={faCircleInfo} width={12} height={12} />
            </Text>
          </Tooltip>
        </Flex>
        <Input
          value={metadataUrl}
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
import { useState, useEffect, FC, SyntheticEvent } from 'react'
import { Text, Flex, Box, Switch } from 'components/primitives'

type Props = {
  activeTab: string | null
}

const MintStateSettings:FC<Props> = ({ activeTab }) => {
  const [isPublicMint, setIsPublicMint] = useState(false);
  const [isAllowlistMint, setIsAllowlistMint] = useState(false);
  
  const resetState = () => {
   setIsPublicMint(false);
   setIsAllowlistMint(false);
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
          Mint State Settings
        </Text>
      </Box>
      <Flex css={{ marginBottom: 32 }} justify="between">
        <Flex direction="column">
          <Text style="h6" css={{ color: '$gray11' }}>Public mint</Text>
        </Flex>
        <Box>
          <Switch
            checked={isPublicMint}
            onCheckedChange={checked => setIsPublicMint(checked)}
          />
        </Box>
      </Flex>
      <Flex css={{ marginBottom: 32 }} justify="between">
        <Flex direction="column">
          <Text style="h6" css={{ color: '$gray11' }}>Allowlist mint</Text>
        </Flex>
        <Box>
          <Switch
            checked={isAllowlistMint}
            onCheckedChange={checked => setIsAllowlistMint(checked)}
          />
        </Box>
      </Flex>
    </Box>
  )
}

export default MintStateSettings
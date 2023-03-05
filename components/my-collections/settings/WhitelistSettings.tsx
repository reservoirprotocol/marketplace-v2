import { useState, useEffect, FC, SyntheticEvent } from 'react'
import { useTheme } from 'next-themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { Text, Flex, Box, Input, Button, Grid } from 'components/primitives'
import { StyledInput } from "components/primitives/Input";

type Props = {
  allowlist: string[]
}

const WhitelistSettings:FC<Props> = ({ allowlist }) => {
  const { theme } = useTheme();
  const [whitelist, setWhitelist] = useState<string[]>(allowlist || [])

  useEffect(() => {
    setWhitelist(allowlist || []);
  }, [allowlist])
  
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // TODO: Fetch to API
  }

  const handleAddWhitelist = () => {
    const whitelistStateCopy = whitelist.slice()

    whitelistStateCopy.push('')

    setWhitelist(whitelistStateCopy)
  }

  const handleRemoveAddress = (addressIdx: number) => {
    const whitelistStateCopy = whitelist.slice()

    whitelistStateCopy.splice(addressIdx, 1)

    setWhitelist(whitelistStateCopy)
  }

  const handleAddressInputChange = (
    addressIdx: number, 
    inputValue: string
  ) => {
    const whitelistStateCopy = whitelist.slice()

    whitelistStateCopy[addressIdx] = inputValue;

    setWhitelist(whitelistStateCopy)
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
          Allowlist Settings
        </Text>
      </Box>
      <Box css={{ marginBottom: 8 }}>
        <Flex direction='column'>
          <Text style="h6" css={{ color: '$gray11' }}>Allowlist</Text>
        </Flex>
      </Box>
      <Box css={{ marginBottom: 8 }}>
        {whitelist.length > 0 && whitelist.map((address, index) => (
          <Grid
            key={index}
            css={{
              gap: '$4',
              gridTemplateColumns: '8fr 1fr',
            }}>
            <Box css={{ position: 'relative', width: '100%' }}>
              <StyledInput
                value={address}
                onChange={(e) => handleAddressInputChange(index, e.target.value)}
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
            <Flex 
              align='center' 
              justify='end'
              onClick={() => handleRemoveAddress(index)}
              css={{ color: '$red10', cursor: 'pointer' }}>
              <FontAwesomeIcon
                icon={faTrash}
                width={16}
                height={16}
              />
            </Flex>
          </Grid>
        ))}
      </Box>
      <Flex justify='between' align='center' css={{ width: '100%' }}>
        <Button 
          color='ghost' 
          onClick={handleAddWhitelist}>
          + Add Whitelisted Address
        </Button>
      </Flex>
      <Button 
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

export default WhitelistSettings
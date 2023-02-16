import { useState, useEffect, FC, SyntheticEvent, KeyboardEvent, ChangeEvent } from 'react'
import { useTheme } from 'next-themes'

import { Text, Flex, Box, Switch } from 'components/primitives'
import { StyledInput } from "components/primitives/Input"

type Props = {
  activeTab: string | null
}

const MintStateSettings:FC<Props> = ({ activeTab }) => {
  const { theme } = useTheme();

  const [isPublicMint, setIsPublicMint] = useState(false);
  const [isAllowlistMint, setIsAllowlistMint] = useState(false);
  const [publicMintPrice, setPublicMintPrice] = useState('');
  const [allowlistMintPrice, setAllowlistMintPrice] = useState('');
  
  const resetState = () => {
   setIsPublicMint(false);
   setIsAllowlistMint(false);
   setPublicMintPrice('');
   setAllowlistMintPrice('');
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
          Mint Settings
        </Text>
      </Box>
      <Box css={{ marginBottom: 32 }}>
        <Flex justify="between">
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
          {isPublicMint && (
            <Box css={{ width: '100%', marginTop: 12 }}>
              <Text style='subtitle2' css={{ color: '$gray11', fontWeight: 'bold' }}>Public Mint price</Text>
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
            <Text style="h6" css={{ color: '$gray11' }}>Allowlist mint</Text>
          </Flex>
          <Box>
            <Switch
              checked={isAllowlistMint}
              onCheckedChange={checked => setIsAllowlistMint(checked)}
            />
          </Box>
        </Flex>
          {isAllowlistMint && (
            <Box css={{ width: '100%', marginTop: 12 }}>
              <Text style='subtitle2' css={{ color: '$gray11', fontWeight: 'bold' }}>Allowlist Mint price</Text>
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
    </Box>
  )
}

export default MintStateSettings
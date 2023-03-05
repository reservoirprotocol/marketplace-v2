import { useState, useEffect, FC, SyntheticEvent, KeyboardEvent, ChangeEvent } from 'react'
import { useTheme } from 'next-themes'

import { Text, Flex, Box, Switch, Button } from 'components/primitives'
import { StyledInput } from "components/primitives/Input"

type Props = {
  activePresale: boolean
  presalePrice: string
  activePublic: boolean
  publicPrice: string
}

const MintStateSettings:FC<Props> = ({ activePresale = false, presalePrice = '0', activePublic = false, publicPrice = '0' }) => {
  const { theme } = useTheme();
  const [isAllowlistMint, setIsAllowlistMint] = useState(activePresale);
  const [allowlistMintPrice, setAllowlistMintPrice] = useState(presalePrice);
  const [isPublicMint, setIsPublicMint] = useState(activePublic);
  const [publicMintPrice, setPublicMintPrice] = useState(publicPrice);

  useEffect(() => {
    setIsAllowlistMint(activePresale);
    setAllowlistMintPrice(presalePrice);
    setIsPublicMint(false);
    setPublicMintPrice('');
  }, [activePresale, activePublic, presalePrice, publicPrice])

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // TODO: Fetch to API
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
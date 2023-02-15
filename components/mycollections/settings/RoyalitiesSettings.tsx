import { useState, useEffect, FC, SyntheticEvent } from 'react'
import { useTheme } from 'next-themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { Text, Flex, Box, Input, Button, Grid } from 'components/primitives'
import { StyledInput } from "components/primitives/Input";

type Props = {
  activeTab: string | null
}

type AddressType = {
  value: string
  percentage: string
}

const RoyalitiesSettings:FC<Props> = ({ activeTab }) => {
  const { theme } = useTheme();

  const [addresses, setAddresses] = useState<AddressType[]>([])
  const [errorPercentage, setErrorPercentage] = useState(false)
  const [sumPercentage, setSumPercentage] = useState(0)
  
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // TODO: Fetch to API
  }

  const handleAddAddresses = () => {
    const addressesStateCopy = addresses.slice()

    addressesStateCopy.push({ value: '', percentage: '' })

    setAddresses(addressesStateCopy)
  }

  const handleRemoveAddress = (addressIdx: number) => {
    const addressesStateCopy = addresses.slice()

    addressesStateCopy.splice(addressIdx, 1)

    setAddresses(addressesStateCopy)
  }

  const handleAddressInputChange = (
    addressIdx: number, 
    inputType: 'value' | 'percentage', 
    inputValue: string
  ) => {
    const validValueRegexp = /^([0-9]|10)$/
    const isValidPercentageValue = validValueRegexp.test(inputValue)

    if (
      inputType === 'percentage' && 
      !isValidPercentageValue && 
      inputValue !== ''
    ) return;

    const addressesStateCopy = addresses.slice()

    addressesStateCopy.splice(addressIdx, 1, {
      ...addressesStateCopy[addressIdx],
      [inputType]: inputValue
    })

    setAddresses(addressesStateCopy)
  }

  useEffect(() => {
    if (activeTab !== 'royalities') setAddresses([]);
  }, [activeTab])

  useEffect(() => {
    const sumAllPercentageValue = addresses.reduce((a, b) => a + +b.percentage, 0)

    if (sumAllPercentageValue > 10) {
      setErrorPercentage(true)
    } else {
      setErrorPercentage(false)
    }

    setSumPercentage(sumAllPercentageValue)
  },[addresses])

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
          Royalities Settings
        </Text>
      </Box>
      <Box css={{ marginBottom: 8 }}>
        <Flex direction='column'>
          <Text style="h6" css={{ color: '$gray11' }}>Creator Earnings</Text>
          <Text style='subtitle3' css={{ color: '$gray11', marginBottom: 6 }}>
            Collection owners can collect creator earnings when a user re-sells an item they created. Contact the collection owner to change the collection earnings percentage or the payout address.
          </Text>
        </Flex>
      </Box>
      <Box css={{ marginBottom: 8 }}>
        {addresses.length > 0 && addresses.map((address, index) => (
          <Grid
            key={index}
            css={{
              gap: '$4',
              gridTemplateColumns: '8fr 3fr 1fr',
              '@md': {
                gridTemplateColumns: 'fr 2fr 1fr',
              },
            }}>
            <Box css={{ position: 'relative', width: '100%' }}>
              <StyledInput
                value={address.value}
                onChange={(e) => handleAddressInputChange(index, 'value', e.target.value)}
                placeholder='Please enter an address'
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
                value={address.percentage}
                placeholder="0"
                onKeyDown={(e) => ['e', '+', '-'].includes(e.key) && e.preventDefault()}
                onChange={(e) => handleAddressInputChange(index, 'percentage', e.target.value)}
                css={{
                  backgroundColor: errorPercentage ? '$red3' : (theme === 'light' ? '$gray1' : 'initial'),
                  marginTop: 6,
                  width: '100%',
                  border: errorPercentage ? '1px solid $red10' : '1px solid $gray8',
                  borderRadius: 6,
                  pr: 32,
                  boxSizing: 'border-box',
                  ...(errorPercentage && {
                    '&:focus': { boxShadow: 'none' },
                  })
                }}
              />
              <Text 
                css={{ 
                  position: 'absolute',
                  top: 18,
                  right: 16,
                  opacity: .8
                }}>
                %
              </Text>
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
        {errorPercentage && (
          <Box css={{ marginTop: 16 }}>
            <Text style='subtitle2' css={{ color: '$red10' }}>
              Total creator earnings must not exceed 10%.
            </Text>
          </Box>
        )}
      </Box>
      <Flex justify='between' align='center' css={{ width: '100%' }}>
        <Button 
          color='ghost' 
          onClick={handleAddAddresses}>
          + Add Address
        </Button>
        {addresses.length > 0 && (
          <Text style='subtitle2' css={{ fontWeight: 'bold' }}>{`Total ${sumPercentage}%`}</Text>
        )}
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

export default RoyalitiesSettings
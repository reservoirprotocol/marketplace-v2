import {useState, useEffect, FC, SyntheticEvent, useContext} from 'react'
import { useTheme } from 'next-themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { Text, Flex, Box, Input, Button, Grid } from 'components/primitives'
import { StyledInput } from "components/primitives/Input";
import {useLaunchpads, useMarketplaceChain} from "hooks";
import {ToastContext} from "context/ToastContextProvider";

type Props = {
  launchpad: ReturnType<typeof useLaunchpads>["data"][0]
}

type AddressType = {
  value: string
  percentage: string
}

const RoyaltiesSettings:FC<Props> = ({ launchpad }) => {
  const { theme } = useTheme();
  const { addToast } = useContext(ToastContext)
  const [ royalties, setRoyalties ] = useState<AddressType[]>([])
  const [ errorPercentage, setErrorPercentage ] = useState(false)
  const [ sumPercentage, setSumPercentage ] = useState(0)
  const [ loading, setLoading ] = useState(false)
  const marketplaceChain = useMarketplaceChain()

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Submit')

    try {
      await fetch(`${marketplaceChain.proxyApi}/launchpad/update/v1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: launchpad.id,
          name: launchpad.name,
          slug: launchpad.slug,
          allowlists: launchpad.allowlists || [],
          verified: true,
          metadata: {
            imageUrl: launchpad.image,
            bannerImageUrl: launchpad.banner,
            discordUrl: launchpad.discordUrl,
            description: launchpad.description,
            externalUrl: launchpad.externalUrl,
            twitterUsername: launchpad.twitterUsername,
          },
          royalties: royalties.map(r => ({ recipient: r.value, bps: +r.percentage * 100 }))
        })
      })
      addToast?.({
        title: 'success',
        description: 'Royalties Updated'
      })
    } catch (err: any) {
      addToast?.({
        title: 'error',
        description: err.message
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    setRoyalties((launchpad?.royalties?.breakdown || []).map(royalty => ({
      value: royalty.recipient as string,
      percentage: `${(royalty?.bps || 0) * 0.01}`
    })))
  }, [launchpad])

  const handleAddAddresses = () => {
    const addressesStateCopy =  royalties.slice()

    addressesStateCopy.push({ value: '', percentage: '' })

    setRoyalties(addressesStateCopy)
  }

  const handleRemoveAddress = (addressIdx: number) => {
    const addressesStateCopy =  royalties.slice()

    addressesStateCopy.splice(addressIdx, 1)

    setRoyalties(addressesStateCopy)
  }

  const handleAddressInputChange = (
    addressIdx: number, 
    inputType: 'value' | 'percentage', 
    inputValue: string
  ) => {
    const validValueRegexp = /^([0-9.]{1,3})$/
    const isValidPercentageValue = validValueRegexp.test(inputValue)

    if (
      inputType === 'percentage' && 
      !isValidPercentageValue && 
      inputValue !== ''
    ) return;

    const addressesStateCopy =  royalties.slice()

    addressesStateCopy.splice(addressIdx, 1, {
      ...addressesStateCopy[addressIdx],
      [inputType]: inputValue
    })

    setRoyalties(addressesStateCopy)
  }

  useEffect(() => {
    const sumAllPercentageValue =  royalties.reduce((a, b) => a + +b.percentage, 0)

    if (sumAllPercentageValue > 10) {
      setErrorPercentage(true)
    } else {
      setErrorPercentage(false)
    }

    setSumPercentage(sumAllPercentageValue)
  },[ royalties])

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
            Collection owners can collect creator earnings when a user re-sells an item they created.
          </Text>
        </Flex>
      </Box>
      <Box css={{ marginBottom: 8 }}>
        { royalties.length > 0 &&  royalties.map((address, index) => (
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
                disabled={loading}
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
                disabled={loading}
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
            <Button
              color="ghost"
              disabled={loading}
              onClick={() => handleRemoveAddress(index)}
              css={{ color: '$red10', cursor: 'pointer' }}>
              <FontAwesomeIcon
                icon={faTrash}
                width={16}
                height={16}
              />
            </Button>
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
          disabled={loading}
          onClick={handleAddAddresses}>
          + Add Address
        </Button>
        { royalties.length > 0 && (
          <Text style='subtitle2' css={{ fontWeight: 'bold' }}>{`Total ${sumPercentage}%`}</Text>
        )}
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

export default RoyaltiesSettings
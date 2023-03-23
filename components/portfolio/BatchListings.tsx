import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Flex, Text, Button, Select } from 'components/primitives'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Listings } from '@reservoir0x/reservoir-kit-ui'
import useMarketplaces from 'hooks/useMarketplaces'
import expirationOptions from 'utils/defaultExpirationOptions'
import { ExpirationOption } from 'types/ExpirationOption'

type Listing = Listings[0]

type Props = {
  selectedItems: string[]
  setSelectedItems: Dispatch<SetStateAction<string[]>>
  setShowListingPage: Dispatch<SetStateAction<boolean>>
}

const BatchListings: FC<Props> = ({
  selectedItems,
  setSelectedItems,
  setShowListingPage,
}) => {
  const [listings, setListings] = useState<Listing[]>([])
  // const [marketplaces, setMarketplaces] = useState([])

  const [globalPrice, setGlobalPrice] = useState(0)
  const [globalExpirationOption, setGlobalExpirationOption] =
    useState<ExpirationOption>(expirationOptions[3])

  const [marketplaces] = useMarketplaces()

  useEffect(() => {}, [globalPrice])

  useEffect(() => {}, [selectedItems])
  return (
    <Flex direction="column" css={{ gap: '$5' }}>
      <Flex align="center" css={{ gap: 24 }}>
        <Button
          color="gray3"
          size="small"
          css={{ justifyContent: 'center', width: '44px', height: '44px' }}
          onClick={() => setShowListingPage(false)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <Text style="h4">List for Sale</Text>
      </Flex>
      <Flex
        justify="between"
        css={{ border: '1px solid $gray6', borderRadius: 8, p: 24 }}
      >
        <Flex direction="column" css={{ gap: '$3' }}>
          <Text style="h6">Select Marketplaces</Text>
        </Flex>
        <Flex direction="column" css={{ gap: '$3' }}>
          <Text style="h6">Apply to All</Text>
          <Flex align="center" css={{ gap: '$3' }}>
            <Button
              color="gray3"
              corners="pill"
              size="large"
              css={{ minWidth: 'max-content' }}
            >
              Floor
            </Button>
            <Button
              color="gray3"
              corners="pill"
              size="large"
              css={{ minWidth: 'max-content' }}
            >
              Top Trait
            </Button>
            <Select
              css={{
                flex: 1,
                width: 200,
              }}
              value={globalExpirationOption?.text || ''}
              onValueChange={(value: string) => {
                const option = expirationOptions.find(
                  (option) => option.value == value
                )
                if (option) {
                  setGlobalExpirationOption(option)
                }
              }}
            >
              {expirationOptions.map((option) => (
                <Select.Item key={option.text} value={option.value}>
                  <Select.ItemText>{option.text}</Select.ItemText>
                </Select.Item>
              ))}
            </Select>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default BatchListings

import {
  Box,
  Text,
  Flex,
  Input,
  Button,
  FormatCurrency,
  FormatCrypto,
} from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'

import {
  useEffect,
  useState,
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
  FC,
  useMemo,
} from 'react'

import { useDebounce } from 'usehooks-ts'
import { useMediaQuery } from 'react-responsive'

import Link from 'next/link'
import LoadingSpinner from 'components/common/LoadingSpinner'
import { OpenSeaVerified } from 'components/common/OpenSeaVerified'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { SearchCollection } from 'pages/api/globalSearch'
import { formatNumber } from 'utils/numbers'
import { useTheme } from 'next-themes'
import Img from 'components/primitives/Img'

type Props = {
  collection: SearchCollection
  handleSelectResult: (result: SearchCollection) => void
}

const CollectionItem: FC<Props> = ({ collection, handleSelectResult }) => {
  const { theme } = useTheme()

  const tokenCount = useMemo(
    () => formatNumber(collection.tokenCount),
    [collection.tokenCount]
  )

  return (
    <Link
      href={`/collection/${collection.chainName}/${collection.collectionId}`}
      style={{ overflow: 'hidden', width: '100%', minWidth: 0 }}
      onClick={() => handleSelectResult(collection)}
    >
      <Flex
        css={{
          p: '$2',
          gap: '$3',
          cursor: 'pointer',
          '&:hover': {
            background: '$gray4',
          },
          minWidth: 0,
          width: '100%',
        }}
        align="center"
      >
        <Img
          src={collection.image!}
          style={{ width: 36, height: 36, borderRadius: 4 }}
          width={36}
          height={36}
          alt="Searchbar Collection Image"
        />
        <Flex direction="column" css={{ minWidth: 0 }}>
          <Flex align="center" css={{ gap: '$1' }}>
            <Text style="subtitle1" ellipsify>
              {collection.name}
            </Text>
            <OpenSeaVerified
              openseaVerificationStatus={collection?.openseaVerificationStatus}
            />
          </Flex>
          <Flex align="center" css={{ gap: '$1' }}>
            <Box css={{ height: 12, minWidth: 'max-content' }}>
              <img
                src={
                  theme === 'dark'
                    ? collection.darkChainIcon
                    : collection.lightChainIcon
                }
                style={{ height: 12 }}
              />
            </Box>
            {tokenCount && (
              <Text style="subtitle3" color="subtle">
                {tokenCount} items
              </Text>
            )}
          </Flex>
        </Flex>
        {collection.volumeCurrencySymbol && (
          <Flex css={{ ml: 'auto', flexShrink: 0, gap: '$1' }}>
            <FormatCrypto
              textStyle="subtitle2"
              amount={collection.allTimeVolume}
              decimals={collection.volumeCurrencyDecimals}
              maximumFractionDigits={2}
            />
            {collection.volumeCurrencySymbol}
          </Flex>
        )}
      </Flex>
    </Link>
  )
}

type WalletItemProps = {
  wallet: {
    address: string | null
    name: string | null
    displayName: string
    avatar: string | null
    error?: string
  }
}

const WalletItem: FC<WalletItemProps> = ({ wallet }) => {
  return (
    <Link href={`/profile/${wallet.address}`}>
      <Flex
        css={{
          p: '$2',
          gap: '$4',
          '&:hover': {
            background: '$gray4',
          },
        }}
        align="center"
      >
        {wallet.avatar ? (
          <img
            src={wallet.avatar as string}
            style={{ width: 32, height: 32, borderRadius: 4 }}
          />
        ) : (
          <Jazzicon
            diameter={32}
            seed={jsNumberForAddress(wallet.address as string)}
          />
        )}
        <Text style="subtitle1">{wallet.displayName}</Text>
      </Flex>
    </Link>
  )
}

type SearchResultProps = {
  result: {
    type: 'collection' | 'wallet'
    data: any
  }
  handleSelectResult: (result: SearchCollection) => void
}

const SearchResult: FC<SearchResultProps> = ({
  result,
  handleSelectResult,
}) => {
  if (result.type == 'collection') {
    return (
      <CollectionItem
        collection={result.data}
        handleSelectResult={handleSelectResult}
      />
    )
  } else {
    return <WalletItem wallet={result.data} />
  }
}

const GlobalSearch = forwardRef<
  ElementRef<typeof Input>,
  ComponentPropsWithoutRef<typeof Input>
>(({ children, ...props }, forwardedRef) => {
  const [searching, setSearching] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [recentResults, setRecentResults] = useState<SearchCollection[]>([])
  const [showSearchBox, setShowSearchBox] = useState(false)

  const hasResults = results.length > 0
  const hasRecentResults = recentResults.length > 0

  const debouncedSearch = useDebounce(search, 500)

  const isMobile = useMediaQuery({ query: '(max-width: 960px)' })

  useEffect(() => {
    const getSearchResults = async () => {
      setSearching(true)
      let res = await fetch(`/api/globalSearch?query=${debouncedSearch}`).then(
        (res) => res.json()
      )

      setResults(res.results)
      setSearching(false)
    }
    if (debouncedSearch.length >= 2) {
      getSearchResults()
    } else {
      setResults([])
    }
  }, [debouncedSearch])

  useEffect(() => {
    const hideBox = () => setShowSearchBox(false)

    window.addEventListener('click', hideBox)
  }, [])

  // Get recent search results from local storage
  useEffect(() => {
    const storedRecentResults = localStorage.getItem('recentResults')
    if (storedRecentResults) {
      let results = JSON.parse(storedRecentResults)

      //migration code for results that are missing data
      results = results.filter(
        (result: SearchCollection) =>
          result.allTimeVolume !== undefined &&
          result.volumeCurrencySymbol !== undefined &&
          result.tokenCount !== undefined
      )

      setRecentResults(results)
    }
  }, [])

  // Add selected collection to recent results
  const handleSelectResult = (selectedResult: SearchCollection) => {
    if (
      !recentResults.find(
        (result) => result.collectionId === selectedResult.collectionId
      )
    ) {
      setRecentResults([selectedResult, ...recentResults.slice(0, 4)])
    }
  }

  // Store recently selected results in local storage
  useEffect(() => {
    localStorage.setItem('recentResults', JSON.stringify(recentResults))
  }, [recentResults])

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation()
      }}
      css={{ position: 'relative', width: '100%' }}
      onFocus={() => setShowSearchBox(true)}
    >
      {!isMobile && (
        <Box
          css={{
            position: 'absolute',
            top: '50%',
            left: '$4',
            zIndex: 2,
            transform: 'translate(0, -50%)',
            color: '$gray11',
          }}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </Box>
      )}

      {isMobile && search.length > 0 && (
        <Button
          css={{
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            position: 'absolute',
            right: '$4',
            zIndex: 2,
            color: '$gray10',
          }}
          type="button"
          size="small"
          color="ghost"
          onClick={() => setSearch('')}
        >
          <FontAwesomeIcon icon={faXmark} width={16} height={16} />
        </Button>
      )}

      {!showSearchBox && !isMobile && (
        <Box
          css={{
            position: 'absolute',
            top: '50%',
            right: '$4',
            zIndex: 2,

            transform: 'translate(0, -50%)',
          }}
        >
          <Text
            css={{
              color: '$gray9',
              display: 'none',
              '@bp1100': { display: 'block' },
            }}
          >
            ⌘K
          </Text>
        </Box>
      )}
      <Input
        {...props}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        css={{
          pl: isMobile ? 80 : 48,
          backgroundColor: isMobile ? 'transparent' : '',
          borderRadius: isMobile ? '$0' : '',
          borderBottom: isMobile ? '1px solid $gray4' : '',
          pb: isMobile ? '24px' : '',
          $$focusColor: isMobile && 'none',
          '&[placeholder]': {
            textOverflow: 'ellipsis',
          },
        }}
        ref={forwardedRef}
      />

      {(showSearchBox || isMobile) &&
        (hasResults || hasRecentResults || searching) && (
          <Box
            css={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: isMobile ? 'transparent' : '$dropdownBg',
              borderRadius: isMobile ? 0 : 8,
              zIndex: 4,
              mt: '$2',
              border: isMobile ? '' : '1px solid $gray7',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            {hasRecentResults && !hasResults && search.length <= 3 && (
              <Flex direction="column" css={{ pt: '$2' }}>
                <Text css={{ ml: '$2' }} style="subtitle2" color="subtle">
                  Recent
                </Text>
                {recentResults &&
                  recentResults.map((result) => (
                    <SearchResult
                      key={result?.collectionId}
                      result={{ type: 'collection', data: result }}
                      handleSelectResult={handleSelectResult}
                    />
                  ))}
              </Flex>
            )}
            {results &&
              results
                .slice(0, 8)
                .map((result) => (
                  <SearchResult
                    result={result}
                    handleSelectResult={handleSelectResult}
                  />
                ))}

            {searching && (
              <Flex align="center" justify="center" css={{ py: '$4' }}>
                <LoadingSpinner
                  css={{ width: 24, height: 24, borderWidth: '3px' }}
                />
              </Flex>
            )}
            {!searching && results.length === 0 && search.length > 3 && (
              <Box css={{ p: '$4' }}>No Results</Box>
            )}
          </Box>
        )}
    </Box>
  )
})

export default GlobalSearch

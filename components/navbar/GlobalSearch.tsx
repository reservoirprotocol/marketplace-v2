import { Box, Text, Flex, Input, Button } from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'

import {
  useEffect,
  useState,
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
  FC,
} from 'react'

import { useDebounce } from 'usehooks-ts'
import { useMediaQuery } from 'react-responsive'

import Link from 'next/link'
import LoadingSpinner from 'components/common/LoadingSpinner'
import { OpenSeaVerified } from 'components/common/OpenSeaVerified'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { SearchCollection } from 'pages/api/globalSearch'

type Props = {
  collection: SearchCollection
}

const CollectionItem: FC<Props> = ({ collection }) => {
  return (
    <Link
      href={`/collection/${collection.chainName}/${collection.collectionId}`}
      style={{ overflow: 'hidden', width: '100%', minWidth: 0 }}
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
        justify="between"
      >
        <Flex align="center" css={{ gap: '$2', minWidth: 0 }}>
          <img
            src={collection.image}
            style={{ width: 32, height: 32, borderRadius: 4 }}
          />
          <Text style="subtitle1" ellipsify>
            {collection.name}
          </Text>
          <OpenSeaVerified
            openseaVerificationStatus={collection?.openseaVerificationStatus}
          />
        </Flex>
        <Box css={{ height: 12, minWidth: 'max-content' }}>
          <img src={collection.searchIcon} />
        </Box>
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
}

const SearchResult: FC<SearchResultProps> = ({ result }) => {
  if (result.type == 'collection') {
    return <CollectionItem collection={result.data} />
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
  const [showSearchBox, setShowSearchBox] = useState(false)

  const debouncedSearch = useDebounce(search, 500)

  const isMobile = useMediaQuery({ query: '(max-width: 960px)' })

  useEffect(() => {
    const getSearchResults = async () => {
      setSearching(true)
      let res = await fetch(`/api/globalSearch?q=${debouncedSearch}`).then(
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
        search.length > 3 &&
        (results || searching) && (
          <Box
            css={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: isMobile ? 'transparent' : '$gray3',
              borderRadius: isMobile ? 0 : 8,
              zIndex: 4,
              mt: '$2',
              border: isMobile ? '' : '1px solid $gray7',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            {results &&
              results
                .slice(0, 8)
                .map((result) => <SearchResult result={result} />)}

            {searching && (
              <Flex align="center" justify="center" css={{ py: '$4' }}>
                <LoadingSpinner
                  css={{ width: 24, height: 24, borderWidth: '3px' }}
                />
              </Flex>
            )}
            {!searching && results.length === 0 && (
              <Box css={{ p: '$4' }}>No Results</Box>
            )}
          </Box>
        )}
    </Box>
  )
})

export default GlobalSearch

import { Box, Text, Flex, Input, Button } from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass,
  faCopy,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
  FC,
} from 'react'
import { formatNumber } from 'utils/numbers'

import { useDebounce } from 'usehooks-ts'
import { useMediaQuery } from 'react-responsive'

import { useCopyToClipboard } from 'usehooks-ts'
import Link from 'next/link'
import { paths } from '@reservoir0x/reservoir-kit-client'

type Props = {
  collection: NonNullable<
    paths['/collections/v5']['get']['responses']['200']['schema']['collections']
  >[0]
}

const CollectionItem: FC<Props> = ({ collection }) => {
  const [value, copy] = useCopyToClipboard()
  const [selected, setSelected] = useState(false)

  let flashing = useRef(null as any)

  const flash = () => {
    clearTimeout(flashing.current)
    setSelected(true)

    flashing.current = setTimeout(() => {
      setSelected(false)
    }, 1000)
  }

  return (
    <Link href={`/collections/${collection.id}`}>
      <Flex
        css={{
          p: '$2',
          gap: '$4',
          cursor: 'pointer',
          '&:hover': {
            background: '$gray4',
          },
        }}
        align="center"
      >
        <img
          src={collection.image}
          style={{ width: 32, height: 32, borderRadius: 4 }}
        />
        <Text style="subtitle1" css={{ flex: 1 }}>
          {collection.name}
        </Text>
        <Text
          style="subtitle1"
          css={{
            color: selected ? '$primary9' : '$gray9',
            transition: 'color 100ms ease-out',
          }}
        >
          {selected ? 'Copied Address' : formatNumber(collection.tokenCount)}
        </Text>
        <Box
          css={{
            cursor: 'pointer',
            color: selected ? '$primary9' : '$gray10',
            '&:hover': {
              color: '$gray11',
            },
            transition: 'color 100ms ease-out',
          }}
          onClick={() => {
            flash()
            copy(collection?.id as string)
          }}
        >
          <FontAwesomeIcon icon={faCopy} />
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

const WalletItem: FC<WalletItemProps> = ({ wallet }) => (
  <Flex css={{ p: '$2', gap: '$4' }} align="center">
    <img
      src={wallet.avatar as string}
      style={{ width: 32, height: 32, borderRadius: 4 }}
    />
    <Text style="subtitle1">{wallet.displayName}</Text>
  </Flex>
)

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
            width: '16px',
            height: '16px',
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
          <Text css={{ color: '$gray9' }}>⌘K</Text>
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
        }}
        ref={forwardedRef}
      />

      {(showSearchBox || (isMobile && !searching)) &&
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

              '& div:not(:last-of-type)': {
                borderBottom: isMobile ? '' : '1px solid $gray7',
              },
            }}
          >
            {results &&
              results
                .slice(0, 8)
                .map((result) => <SearchResult result={result} />)}

            {searching && <Box css={{ p: '$4' }}>loading</Box>}
          </Box>
        )}
    </Box>
  )
})

export default GlobalSearch

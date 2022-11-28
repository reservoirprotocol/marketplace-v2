import Box from './primitives/Box'
import Text from './primitives/Text'
import Flex from './primitives/Flex'
import Input from './primitives/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCopy } from '@fortawesome/free-solid-svg-icons'

import {
  useEffect,
  useState,
  useRef,
  RefObject,
  MutableRefObject,
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
} from 'react'
import { formatNumber } from 'lib/numbers'

import { useDebounce } from 'usehooks-ts'

import { useCopyToClipboard } from 'usehooks-ts'
import Link from 'next/link'

const CollectionItem = ({ collection }) => {
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
    <Link href={`/collection/${collection.slug}`}>
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
            copy(collection.id)
          }}
        >
          <FontAwesomeIcon icon={faCopy} />
        </Box>
      </Flex>
    </Link>
  )
}

const WalletItem = ({ wallet }) => (
  <Flex css={{ p: '$2', gap: '$4' }} align="center">
    <img
      src={wallet.avatar}
      style={{ width: 32, height: 32, borderRadius: 4 }}
    />
    <Text style="subtitle1">{wallet.displayName}</Text>
  </Flex>
)

const SearchResult = ({ result }) => {
  console.log(result)
  return {
    collection: () => <CollectionItem collection={result.data} />,
    wallet: () => <WalletItem wallet={result.data} />,
  }[result.type]()
}

const GlobalSearch = forwardRef<
  ElementRef<typeof Input>,
  ComponentPropsWithoutRef<typeof Input>
>(({ children, ...props }, forwardedRef) => {
  const [searching, setSearching] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState(null)
  const [showSearchBox, setShowSearchBox] = useState(false)

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    const getSearchResults = async () => {
      setSearching(true)
      let res = await fetch(`/api/globalSearch?q=${debouncedSearch}`).then(
        (res) => res.json()
      )

      setResults(res.results)
      setSearching(false)
    }
    if (debouncedSearch.length >= 3) {
      getSearchResults()
    } else {
      setResults(null)
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

      {!showSearchBox && (
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
        css={{ pl: 48 }}
        ref={forwardedRef}
      />

      {showSearchBox && search.length > 3 && (results || searching) && (
        <Box
          css={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '$gray3',
            borderRadius: 8,
            zIndex: 4,
            mt: '$2',
            border: '1px solid $gray7',

            '& div:not(:last-of-type)': {
              borderBottom: '1px solid $gray7',
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

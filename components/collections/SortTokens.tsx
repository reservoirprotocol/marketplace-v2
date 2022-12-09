import { Box, Button } from 'components/primitives'
import {
  DropdownMenuItem,
  DropdownMenuContent,
} from 'components/primitives/Dropdown'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Options =
  | 'Price low to high'
  | 'Price high to low'
  | 'Rare to Common'
  | 'Common to Rare'

const options: { [x: string]: { sortBy: string; sortDirection: string } } = {
  'Price low to high': { sortBy: 'floorAskPrice', sortDirection: 'asc' },
  'Price high to low': { sortBy: 'floorAskPrice', sortDirection: 'desc' },
  'Rare to Common': { sortBy: 'rarity', sortDirection: 'desc' },
  'Common to Rare': { sortBy: 'rarity', sortDirection: 'asc' },
}

export const SortTokens: FC = () => {
  const router = useRouter()
  const [sortSelection, setSortSelection] =
    useState<Options>('Price low to high')

  useEffect(() => {
    const sortBy = router?.query['sortBy']?.toString()
    const sortDirection = router?.query['sortDirection']?.toString()

    if (sortBy === 'rarity' && sortDirection === 'asc') {
      setSortSelection('Common to Rare')
      return
    }
    if (sortBy === 'rarity' && sortDirection === 'desc') {
      setSortSelection('Rare to Common')
      return
    }
    if (sortBy === 'floorAskPrice' && sortDirection === 'desc') {
      setSortSelection('Price high to low')
      return
    }
    setSortSelection('Price low to high')
  }, [router.query])

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          color="gray4"
          css={{
            width: '100%',
            justifyContent: 'center',
            mb: '$3',
            '@bp2': { width: '220px', minWidth: 'max-content', mb: '0' },
          }}
        >
          <span>{sortSelection}</span>
          <Box
            css={{
              transition: 'transform',
              '[data-state=open] &': { transform: 'rotate(180deg)' },
            }}
          >
            <FontAwesomeIcon icon={faChevronDown} width={16} />
          </Box>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenuContent css={{ width: '220px', mt: '$2' }}>
        {Object.keys(options).map((key) => (
          <DropdownMenuItem
            key={key}
            css={{ py: '$3' }}
            onClick={() => {
              router.push(
                {
                  query: {
                    ...router.query,
                    ['sortBy']: options[key].sortBy,
                    ['sortDirection']: options[key].sortDirection,
                  },
                },
                undefined,
                {
                  shallow: true,
                }
              )
            }}
            aria-label={`Sort by ${key}`}
          >
            {key}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu.Root>
  )
}

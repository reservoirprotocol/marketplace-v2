import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import {
  ToggleGroup,
  ToggleGroupItem,
  Text,
  Button,
  Box,
  Flex,
} from 'components/primitives'
import { Dropdown, DropdownMenuItem } from 'components/primitives/Dropdown'
import { useMounted } from 'hooks'
import { useMediaQuery } from 'react-responsive'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

type Props = {
  fillType: 'mint' | 'sale' | 'any'
  setFillType: Dispatch<SetStateAction<'any' | 'mint' | 'sale'>>
}

const fillTypesFilters = [
  {
    value: 'sale',
    display: 'Trades',
  },
  {
    value: 'mint',
    display: 'Mints',
  },
  {
    value: 'any',
    display: 'All Sales',
  },
]

export const FillTypeToggle: FC<Props> = ({ fillType, setFillType }) => {
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 905 }) && isMounted

  const displayFillType = useMemo(() => {
    const currentFillType = fillTypesFilters.find(
      (fillTypeFilter) => fillTypeFilter.value === fillType
    )

    return currentFillType?.display
  }, [fillTypesFilters, fillType])

  if (isSmallDevice) {
    return (
      <Dropdown
        contentProps={{ sideOffset: 8, style: { minWidth: 120 } }}
        trigger={
          <Button
            color="gray3"
            css={{
              px: '14px',
              justifyContent: 'space-between',
              minWidth: 120,
              '@md': {
                width: '220px',
                minWidth: 'max-content',
                px: '$4',
              },
            }}
          >
            <Text style="body1">{displayFillType}</Text>
            <Box
              css={{
                color: '$gray10',
                transition: 'transform',
                '[data-state=open] &': { transform: 'rotate(180deg)' },
              }}
            >
              <FontAwesomeIcon icon={faChevronDown} width={16} />
            </Box>
          </Button>
        }
      >
        <Flex direction="column" css={{ width: '100%' }}>
          {fillTypesFilters.map((fillType) => (
            <DropdownMenuItem
              key={fillType.value}
              onClick={() => {
                setFillType(fillType.value as Props['fillType'])
              }}
              css={{ py: '$2' }}
            >
              {fillType.display}
            </DropdownMenuItem>
          ))}
        </Flex>
      </Dropdown>
    )
  }
  return (
    <ToggleGroup
      type="single"
      value={fillType}
      onValueChange={(value) => {
        if (!value) return
        setFillType(value as typeof fillType)
      }}
      css={{ flexShrink: 0 }}
    >
      {fillTypesFilters.map((fillType) => (
        <ToggleGroupItem
          key={fillType.value}
          value={fillType.value}
          css={{ minWidth: 160, p: '$4' }}
        >
          <Text style="subtitle1">{fillType.display}</Text>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

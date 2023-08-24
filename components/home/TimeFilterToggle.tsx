import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import {
  ToggleGroup,
  ToggleGroupItem,
  Text,
  Button,
  Flex,
  Box,
} from 'components/primitives'
import { useMounted } from 'hooks'
import { useMediaQuery } from 'react-responsive'
import { Dropdown, DropdownMenuItem } from 'components/primitives/Dropdown'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  minutesFilter: number
  setMinutesFilter: Dispatch<SetStateAction<number>>
}

const filterTimes = [
  {
    value: '5',
    display: '5m',
  },
  {
    value: '30',
    display: '30m',
  },
  {
    value: '60',
    display: '1h',
  },
  {
    value: '360',
    display: '6h',
  },
  {
    value: '1440',
    display: '24h',
  },
]
export const TimeFilterToggle: FC<Props> = ({
  minutesFilter,
  setMinutesFilter,
}) => {
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 905 }) && isMounted

  const displayTime = useMemo(() => {
    const timeFilter = filterTimes.find(
      (time) => Number(time.value) === minutesFilter
    )

    return timeFilter?.display
  }, [filterTimes, minutesFilter])

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
            <Text style="body1">{displayTime}</Text>
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
          {filterTimes.map((time) => (
            <DropdownMenuItem
              key={time.value}
              onClick={() => {
                setMinutesFilter(+time.value)
              }}
              css={{ py: '$2' }}
            >
              {time.display}
            </DropdownMenuItem>
          ))}
        </Flex>
      </Dropdown>
    )
  }

  return (
    <ToggleGroup
      type="single"
      value={`${minutesFilter}`}
      onValueChange={(value) => {
        if (!value) return
        setMinutesFilter(+value)
      }}
      css={{ flexShrink: 0 }}
    >
      {filterTimes.map((time) => (
        <ToggleGroupItem
          key={time.value}
          value={time.value}
          css={{ minWidth: 80, p: '$4' }}
        >
          <Text style="subtitle1">{time.display}</Text>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

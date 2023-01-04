import { faChevronLeft, faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'components/primitives'
import { FC } from 'react'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export const FilterButton: FC<Props> = ({ open, setOpen }) => {
  return (
    <Button
      css={{ justifyContent: 'center', width: '44px', height: '44px' }}
      type="button"
      onClick={() => setOpen(!open)}
      size="small"
      color="gray3"
    >
      <FontAwesomeIcon
        icon={open ? faChevronLeft : faFilter}
        width={16}
        height={16}
      />
    </Button>
  )
}

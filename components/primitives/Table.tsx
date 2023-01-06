import { styled } from 'stitches.config'

export const Row = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  'div:first-child': {
    paddingLeft: '0',
  },
  'div:last-child': {
    paddingRight: '0',
  },
})

export const HeaderRow = styled(Row, {})

export const TableRow = styled(Row, {
  alignItems: 'center',
  borderBottom: '1px solid $gray3',
})

export const TableCell = styled('div', {
  p: '$3',
})

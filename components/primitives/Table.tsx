import { styled } from 'stitches.config'

export const HeaderRow = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
  ':first-child': {
    paddingLeft: '0',
  },
  ':last-child': {
    paddingRight: '0',
  },
})

export const TableRow = styled('div', {
  display: 'grid',
  alignItems: 'center',
  borderBottom: '1px solid $gray3',
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
  ':first-child': {
    paddingLeft: '0',
  },
  ':last-child': {
    paddingRight: '0',
  },
})

export const TableCell = styled('div', {
  p: '$3',
})

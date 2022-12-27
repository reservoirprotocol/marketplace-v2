import { styled } from 'stitches.config'

const Row = styled('div', {
  display: 'flex',
  alignContent: 'center',
})

const Cell = styled('div', {
  flex: 1,
})

const Table = styled('div', {
  '& > div:not(:last-child)': {
    borderBottom: '1px solid $gray8',
  },
})

export default Table

import { styled } from '@stitches/react'
import { Flex } from 'components/primitives/Flex'
import { FC, InputHTMLAttributes } from 'react'

const StyledInput = styled('input', {
  all: 'unset',
  width: '100%',
  padding: '12px 16px',
  borderRadius: 8,
  fontFamily: '$bodyFont',
  fontSize: 16,
  color: '$gray12',
  backgroundColor: '$gray3',
  $$focusColor: '$colors$primary8',
  '&:placeholder': { color: '$gray11' },
  '&:focus': { boxShadow: '0 0 0 2px $$focusColor' },
})

type Props = {
  icon?: JSX.Element
  attributes?: InputHTMLAttributes<HTMLInputElement>
  width?: string
}

const Input: FC<Props> = ({ icon, attributes, width = '200px' }) => {
  return (
    <Flex css={{ width: width, position: 'relative' }}>
      {icon && (
        <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
          {icon}
        </div>
      )}
      <StyledInput css={{ paddingLeft: '48px' }} {...attributes} />
    </Flex>
  )
}

export default Input

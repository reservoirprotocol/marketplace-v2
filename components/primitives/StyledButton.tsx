import { styled } from 'stitches.config'

const StyledButton = styled('button', {
  py: '12px',
  px: '32px',
  fontWeight: 700,
  fontSize: '16px',
  fontFamily: 'Inter',
  transition: 'background-color 250ms linear',
  variants: {
    color: {
      primary: {
        backgroundColor: '$primary9',
        color: '$primary12',
        '&:hover': {
          backgroundColor: '$primary10',
        },
        '&:focus': {
          boxShadow: '0 0 0 1px $primary12',
        },
      },
      secondary: {
        backgroundColor: '$secondary4',
        color: '$primary12',
        '&:hover': {
          backgroundColor: '$secondary5',
        },
        '&:focus': {
          boxShadow: '0 0 0 1px $primary12',
        },
      },
    },
    rounded: {
      small: {
        borderRadius: '8px',
      },
      large: {
        borderRadius: '99999px',
      },
    },
  },
})

export default StyledButton

import { styled } from 'stitches.config'

const Button = styled('button', {
  py: '12px',
  px: '32px',
  outline: 'none',
  fontWeight: 700,
  fontSize: '16px',
  fontFamily: '$body',
  transition: 'background-color 250ms linear',
  gap: '8px',
  display: 'inline-flex',
  alignItems: 'center',
  $$focusColor: '$colors$gray12',
  variants: {
    color: {
      primary: {
        backgroundColor: '$primary9',
        color: 'white',
        '&:hover': {
          backgroundColor: '$primary10',
        },
        '&:focus': {
          boxShadow: '0 0 0 2px $$focusColor',
        },
      },
      secondary: {
        backgroundColor: '$secondary4',
        color: '$primary12',
        '&:hover': {
          backgroundColor: '$secondary5',
        },
        '&:focus': {
          boxShadow: '0 0 0 2px $$focusColor',
        },
      },
      gradient: {
        background: 'linear-gradient(270deg, #BD00FF 0%, #0091FF 109.23%)',
      },
    },
    corners: {
      rounded: {
        borderRadius: '8px',
      },
      pill: {
        borderRadius: '99999px',
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    corners: 'rounded',
  },
})

export default Button

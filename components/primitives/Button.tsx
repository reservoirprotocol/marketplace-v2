import { styled } from 'stitches.config'

const Button = styled('button', {
  py: '$space$3',
  px: '$space$5',
  outline: 'none',
  fontWeight: 700,
  fontSize: 16,
  fontFamily: '$body',
  transition: 'background-color 250ms linear',
  gap: 8,
  display: 'inline-flex',
  alignItems: 'center',
  lineHeight: '20px',
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
        borderRadius: 8,
      },
      pill: {
        borderRadius: 99999,
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    corners: 'rounded',
  },
})

export default Button

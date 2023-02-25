import {
  crimson,
  slate,
  crimsonDark,
  slateDark,
  greenDark,
  green,
  lime,
  limeA,
  limeDark,
  limeDarkA,
  whiteA,
  redDark,
  red,
  blackA,
} from '@radix-ui/colors'
import { createStitches } from '@stitches/react'
import type * as Stitches from '@stitches/react'
import { reset } from 'utils/css/reset'
import { Inter } from '@next/font/google'

const inter = Inter({
  subsets: ['latin'],
})

// CONFIGURABLE: Here you can update all your theming (outside of ReservoirKit which can be configured in the app.tsx)
// The theme colors are all already hooked up to stitches scales, so you just need to swap them.
// Don't forget to check the dark mode themes below.
// More on Stitches theme tokens: https://stitches.dev/docs/tokens
// More on Radix color scales: https://www.radix-ui.com/docs/colors/palette-composition/the-scales

export const { createTheme, keyframes, styled, globalCss, getCssText } =
  createStitches({
    theme: {
      colors: {
        ...crimson,
        ...slate,
        ...red,
        ...whiteA,
        ...blackA,
        ...green,
        ...lime,
        ...limeA,
        //Aliases

        //Primary
        primary1: '$lime1',
        primary2: '$lime2',
        primary3: '$lime3',
        primary4: '$lime4',
        primary5: '$lime5',
        primary6: '$lime6',
        primary7: '$lime7',
        primary8: '$lime8',
        primary9: 'hsl(141,100%,64%)',
        primary10: 'hsl(141, 100%, 52%)',
        primary11: 'hsl(141,100%,74%)',
        primary12: 'hsl(141,100%,88%)',
        primary13: 'hsl(141, 72%, 67%)',
        primary14: 'hsl(142,34%,51%)',

        //Secondary
        secondary1: '$limeA1',
        secondary2: '$limeA2',
        secondary3: '$limeA3',
        secondary4: '$limeA4',
        secondary5: '$limeA5',
        secondary6: '$limeA6',
        secondary7: '$limeA7',
        secondary8: '$limeA8',
        secondary9: '$limeA9',
        secondary10: '$limeA10',
        secondary11: '$limeA11',
        secondary12: '$limeA12',

        //Gray
        gray1: '$slate1',
        gray2: '$slate2',
        gray3: '$slate3',
        gray4: '$slate4',
        gray5: '$slate5',
        gray6: '$slate6',
        gray7: '$slate7',
        gray8: '$slate8',
        gray9: '$slate9',
        gray10: '$slate10',
        gray11: '$slate11',
        gray12: '$slate12',

        //Red
        red1: '$crimson1',
        red2: '$crimson2',
        red3: '$crimson3',
        red4: '$crimson4',
        red5: '$crimson5',
        red6: '$crimson6',
        red7: '$crimson7',
        red8: '$crimson8',
        red9: '$crimson9',
        red10: '$crimson10',
        red11: '$crimson11',
        red12: '$crimson12',

        neutralBg: 'white',
        neutralBgSubtle: 'white',
        panelShadow: 'rgba(0,0,0,0.1)',
        panelBg: '$gray2',
        panelBorder: 'transparent',
      },
      space: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '32px',
        6: '64px',
      },
      fontSizes: {
        1: '10px',
        2: '12px',
        3: '14px',
        4: '16px',
        5: '18px',
        6: '20px',
        7: '22px',
        8: '24px',
        9: '24px',
        10: '28px',
        11: '30px',
        12: '32px',
        13: '34px',
      },
      zIndexes: {
        xs: -1,
        base: 0,
        sm: 1,
        md: 5,
        lg: 10,
        xl: 1000, 
        xxl: 9999,
      },
      fontWeights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      fonts: {
        body: inter.style.fontFamily,
        button: '$body',
      },
      lineHeights: {
        1: '12px',
        2: '16px',
        3: '20px',
        4: '24px',
        5: '28px',
        6: '32px',
        7: '36px',
        8: '40px',
        9: '44px',
        10: '48px',
        11: '52px',
        12: '56px',
        13: '60px',
      },
      letterSpacings: {},
      sizes: {},
      radii: {
        none: '0',
        base: '0',
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '49px',
        full: '9999px',
      },
     // will modify shadows  
      shadows: {
        xs: '0px 2px 7px rgba(0, 0, 0, 0.04)',
        sm: '0px 2px 5px rgba(60, 66, 87, 0.12), 0px 1px 1px rgba(0, 0, 0, 0.08)',
        md: '0px 7px 15px rgba(24, 24, 27, 0.06), 0px 2px 4px rgba(24, 24, 27, 0.02), inset 0px 35px 50px #FFFFFF',
        '2md': '0px 12px 16px -4px rgba(16, 24, 40, 0.1), 0px 4px 6px -2px rgba(16, 24, 40, 0.05)',
        lg: '0px 20px 13px rgba(24, 24, 27, 0.04), 0px 9px 7px rgba(16, 24, 40, 0.03), 0px 2px 4px rgba(16, 24, 40, 0.02)',
        xl: '0px 39px 26px rgba(24, 24, 27, 0.05), 0px 20px 13px rgba(24, 24, 27, 0.04), 0px 9px 7px rgba(16, 24, 40, 0.03), 0px 2px 4px rgba(16, 24, 40, 0.02)',
        '2xl':
          '0px 65px 47px rgba(24, 24, 27, 0.06), 0px 39px 26px rgba(24, 24, 27, 0.05), 0px 20px 13px rgba(24, 24, 27, 0.04), 0px 9px 7px rgba(24, 24, 27, 0.03), 0px 2px 4px rgba(16, 24, 40, 0.02)',
        '3xl':
          '0px 100px 80px rgba(24, 24, 27, 0.07), 0px 65px 47px rgba(24, 24, 27, 0.06), 0px 39px 26px rgba(24, 24, 27, 0.05), 0px 20px 13px rgba(24, 24, 27, 0.04), 0px 9px 4px rgba(24, 24, 27, 0.02), 0px 2px 4px rgba(16, 24, 40, 0.02)',
        top: '0px -20px 13px rgba(24, 24, 27, 0.04), 0px -9px 7px rgba(16, 24, 40, 0.03), 0px -2px 4px rgba(16, 24, 40, 0.02)',
      },
      transitions: {},
      breakpoints: {
        sm: 100,
        md: 768,
        lg: 992,
        xl: 1280,
        xxl: 1536,
      },
    },
    utils: {
      // MARGIN
      m: (value: Stitches.PropertyValue<'margin'>) => ({
        margin: value,
      }),
      mx: (value: Stitches.PropertyValue<'margin'>) => ({
        marginLeft: value,
        marginRight: value,
      }),
      my: (value: Stitches.PropertyValue<'margin'>) => ({
        marginTop: value,
        marginBottom: value,
      }),
      mt: (value: Stitches.PropertyValue<'margin'>) => ({
        marginTop: value,
      }),
      mb: (value: Stitches.PropertyValue<'margin'>) => ({
        marginBottom: value,
      }),
      ml: (value: Stitches.PropertyValue<'margin'>) => ({
        marginLeft: value,
      }),
      mr: (value: Stitches.PropertyValue<'margin'>) => ({
        marginRight: value,
      }),

      // PADDING
      p: (value: Stitches.PropertyValue<'padding'>) => ({
        padding: value,
      }),
      px: (value: Stitches.PropertyValue<'padding'>) => ({
        paddingLeft: value,
        paddingRight: value,
      }),
      py: (value: Stitches.PropertyValue<'padding'>) => ({
        paddingTop: value,
        paddingBottom: value,
      }),
      pt: (value: Stitches.PropertyValue<'padding'>) => ({
        paddingTop: value,
      }),
      pb: (value: Stitches.PropertyValue<'padding'>) => ({
        paddingBottom: value,
      }),
      pl: (value: Stitches.PropertyValue<'padding'>) => ({
        paddingLeft: value,
      }),
      pr: (value: Stitches.PropertyValue<'padding'>) => ({
        paddingRight: value,
      }),
      // DIMENSIONS
      w: (value: Stitches.PropertyValue<'width'>) => ({
        width: value,
      }),
      h: (value: Stitches.PropertyValue<'height'>) => ({
        height: value,
      }),
      size: (value: Stitches.PropertyValue<'width'>) => ({
        width: value,
        height: value,
      }),
      // GRID
      colSpan: (value: number | 'full') => {
        if (value === 'full') {
          return {
            gridColumn: '1 / -1',
          }
        }
        return {
          gridColumn: `span ${value} / span ${value}`,
        }
      },
    },
    media: {
      xs: '(min-width: 300px)',
      sm: '(min-width: 600px)',
      md: '(min-width: 900px)',
      lg: '(min-width: 1200px)',
      xl: '(min-width: 1400px)',
      bp300: '(min-width: 300px)',
      bp400: '(min-width: 400px)',
      bp500: '(min-width: 500px)',
      bp600: '(min-width: 600px)',
      bp700: '(min-width: 700px)',
      bp800: '(min-width: 800px)',
      bp900: '(min-width: 900px)',
      bp1000: '(min-width: 1000px)',
      bp1100: '(min-width: 1100px)',
      bp1200: '(min-width: 1200px)',
      bp1300: '(min-width: 1300px)',
      bp1400: '(min-width: 1400px)',
      motion: '(prefers-reduced-motion)',
      hover: '(any-hover: hover)',
      dark: '(prefers-color-scheme: dark)',
      light: '(prefers-color-scheme: light)',
    },
  })

export const globalReset = globalCss(reset)

export const darkTheme = createTheme({
  colors: {
    ...crimsonDark,
    ...limeDark,
    ...limeDarkA,
    ...slateDark,
    ...greenDark,
    ...whiteA,
    ...redDark,
    ...blackA,

    //Aliases

    //Primary
    primary1: '$lime1',
    primary2: '$lime2',
    primary3: '$lime3',
    primary4: '$lime4',
    primary5: '$lime5',
    primary6: '$lime6',
    primary7: '$lime7',
    primary8: '$lime8',
    primary9: '$lime9',
    primary10: '$lime10',
    primary11: '$lime11',
    primary12: '$lime12',
    primary13: 'hsl(141, 72%, 67%)',
    primary14: 'hsl(142, 34%, 51%)',

    //Secondary
    secondary1: '$limeA1',
    secondary2: '$limeA2',
    secondary3: '$limeA3',
    secondary4: '$limeA4',
    secondary5: '$limeA5',
    secondary6: '$limeA6',
    secondary7: '$limeA7',
    secondary8: '$limeA8',
    secondary9: '$limeA9',
    secondary10: '$limeA10',
    secondary11: '$limeA11',
    secondary12: '$limeA12',

    //Gray
    gray1: '$slate1',
    gray2: '$slate2',
    gray3: '$slate3',
    gray4: '$slate4',
    gray5: '$slate5',
    gray6: '$slate6',
    gray7: '$slate7',
    gray8: '$slate8',
    gray9: '$slate9',
    gray10: '$slate10',
    gray11: '$slate11',
    gray12: '$slate12',

    accent: '#79ffa8',

    neutralBgSubtle: '$gray3',
    neutralBg: '$gray1',

    panelBg: '$gray3',
    panelBorder: '$slate7',
    panelShadow: 'transparent',
  },
})

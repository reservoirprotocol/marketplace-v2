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
        primary1: 'hsl(141,100%,74%)',
        primary2: 'hsl(141,100%,74%)',
        primary3: 'hsl(141,100%,74%)',
        primary4: 'hsl(141,100%,74%),
        primary5: 'hsl(141,100%,74%),
        primary6: 'hsl(141,100%,74%),
        primary7: 'hsl(141,100%,74%),
        primary8: 'hsl(141,100%,74%),
        primary9: 'hsl(141,100%,64%)',
        primary10: 'hsl(141, 100%, 52%)',
        primary11: 'hsl(141,100%,74%)',
        primary12: 'hsl(141,100%,88%)',

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
      fontSizes: {},
      fontWeights: {},
      fonts: {
        body: 'Inter',
        button: '$body',
      },
      lineHeights: {},
      letterSpacings: {},
      sizes: {},
      radii: {},
      shadows: {},
      transitions: {},
      breakpoints: {
        sm: 100,
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

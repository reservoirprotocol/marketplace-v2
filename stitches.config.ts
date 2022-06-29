import {
  crimson,
  indigo,
  slate,
  indigoA,
  crimsonDark,
  indigoDark,
  slateDark,
  indigoDarkA,
  whiteA,
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
        ...indigo,
        ...indigoA,
        ...slate,
        ...whiteA,
        ...blackA,

        //Aliases

        //Primary
        primary1: '$indigo1',
        primary2: '$indigo2',
        primary3: '$indigo3',
        primary4: '$indigo4',
        primary5: '$indigo5',
        primary6: '$indigo6',
        primary7: '$indigo7',
        primary8: '$indigo8',
        primary9: '$indigo9',
        primary10: '$indigo10',
        primary11: '$indigo11',
        primary12: '$indigo12',

        //Secondary
        secondary1: '$indigoA1',
        secondary2: '$indigoA2',
        secondary3: '$indigoA3',
        secondary4: '$indigoA4',
        secondary5: '$indigoA5',
        secondary6: '$indigoA6',
        secondary7: '$indigoA7',
        secondary8: '$indigoA8',
        secondary9: '$indigoA9',
        secondary10: '$indigoA10',
        secondary11: '$indigoA11',
        secondary12: '$indigoA12',

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
      bp1: '(min-width: 600px)',
      bp2: '(min-width: 905px)',
      bp3: '(min-width: 1240px)',
      bp4: '(min-width: 1440px)',
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
    ...indigoDark,
    ...indigoDarkA,
    ...slateDark,
    ...whiteA,
    ...blackA,

    //Aliases

    //Primary
    primary1: '$indigo1',
    primary2: '$indigo2',
    primary3: '$indigo3',
    primary4: '$indigo4',
    primary5: '$indigo5',
    primary6: '$indigo6',
    primary7: '$indigo7',
    primary8: '$indigo8',
    primary9: '$indigo9',
    primary10: '$indigo10',
    primary11: '$indigo11',
    primary12: '$indigo12',

    //Secondary
    secondary1: '$indigoA1',
    secondary2: '$indigoA2',
    secondary3: '$indigoA3',
    secondary4: '$indigoA4',
    secondary5: '$indigoA5',
    secondary6: '$indigoA6',
    secondary7: '$indigoA7',
    secondary8: '$indigoA8',
    secondary9: '$indigoA9',
    secondary10: '$indigoA10',
    secondary11: '$indigoA11',
    secondary12: '$indigoA12',

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
  },
})

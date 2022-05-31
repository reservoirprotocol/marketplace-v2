import {
  // Colors
  blue,
  brown,
  crimson,
  cyan,
  grass,
  green,
  indigo,
  orange,
  pink,
  plum,
  purple,
  red,
  teal,
  tomato,
  violet,
  // Bright Colors
  amber,
  lime,
  mint,
  sky,
  yellow,
  // Grays
  gray,
  mauve,
  olive,
  sage,
  sand,
  slate,
  // Metals
  bronze,
  gold,
  //////////////
  // Colors
  blueA,
  brownA,
  crimsonA,
  cyanA,
  grassA,
  greenA,
  indigoA,
  orangeA,
  pinkA,
  plumA,
  purpleA,
  redA,
  tealA,
  tomatoA,
  violetA,
  // Bright Colors
  amberA,
  limeA,
  mintA,
  skyA,
  yellowA,
  // Grays
  grayA,
  mauveA,
  oliveA,
  sageA,
  sandA,
  slateA,
  // Metals
  bronzeA,
  goldA,
  ///////////
  // Colors
  blueDark,
  brownDark,
  crimsonDark,
  cyanDark,
  grassDark,
  greenDark,
  indigoDark,
  orangeDark,
  pinkDark,
  plumDark,
  purpleDark,
  redDark,
  tealDark,
  tomatoDark,
  violetDark,
  // Bright Colors
  amberDark,
  limeDark,
  mintDark,
  skyDark,
  yellowDark,
  // Grays
  grayDark,
  mauveDark,
  oliveDark,
  sageDark,
  sandDark,
  slateDark,
  // Metals
  bronzeDark,
  goldDark,
  //////////////
  // Colors
  blueDarkA,
  brownDarkA,
  crimsonDarkA,
  cyanDarkA,
  grassDarkA,
  greenDarkA,
  indigoDarkA,
  orangeDarkA,
  pinkDarkA,
  plumDarkA,
  purpleDarkA,
  redDarkA,
  tealDarkA,
  tomatoDarkA,
  violetDarkA,
  // Bright Colors
  amberDarkA,
  limeDarkA,
  mintDarkA,
  skyDarkA,
  yellowDarkA,
  // Grays
  grayDarkA,
  mauveDarkA,
  oliveDarkA,
  sageDarkA,
  sandDarkA,
  slateDarkA,
  // Metals
  bronzeDarkA,
  goldDarkA,
  /////////
  whiteA,
  blackA,
} from '@radix-ui/colors'
import { createStitches } from '@stitches/react'
import type * as Stitches from '@stitches/react'
import { reset } from 'utils/reset'

export const { createTheme, keyframes, styled, globalCss } = createStitches({
  theme: {
    colors: {
      // Colors
      ...blue,
      ...brown,
      ...crimson,
      ...cyan,
      ...grass,
      ...green,
      ...indigo,
      ...orange,
      ...pink,
      ...plum,
      ...purple,
      ...red,
      ...teal,
      ...tomato,
      ...violet,
      // Bright Colors
      ...amber,
      ...lime,
      ...mint,
      ...sky,
      ...yellow,
      // Grays
      ...gray,
      ...mauve,
      ...olive,
      ...sage,
      ...sand,
      ...slate,
      // Metals
      ...bronze,
      ...gold,
      //////////////
      // Colors
      ...blueA,
      ...brownA,
      ...crimsonA,
      ...cyanA,
      ...grassA,
      ...greenA,
      ...indigoA,
      ...orangeA,
      ...pinkA,
      ...plumA,
      ...purpleA,
      ...redA,
      ...tealA,
      ...tomatoA,
      ...violetA,
      // Bright Colors
      ...amberA,
      ...limeA,
      ...mintA,
      ...skyA,
      ...yellowA,
      // Grays
      ...grayA,
      ...mauveA,
      ...oliveA,
      ...sageA,
      ...sandA,
      ...slateA,
      // Metals
      ...bronzeA,
      ...goldA,
      ///////////
      ...whiteA,
      ...blackA,
    },
    space: {},
    fontSizes: {},
    fontWeights: {},
    fonts: {},
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

export const globalStyles = globalCss(reset)

export const darkTheme = createTheme({
  colors: {
    // Colors
    ...blueDark,
    ...brownDark,
    ...crimsonDark,
    ...cyanDark,
    ...grassDark,
    ...greenDark,
    ...indigoDark,
    ...orangeDark,
    ...pinkDark,
    ...plumDark,
    ...purpleDark,
    ...redDark,
    ...tealDark,
    ...tomatoDark,
    ...violetDark,
    // Bright Colors
    ...amberDark,
    ...limeDark,
    ...mintDark,
    ...skyDark,
    ...yellowDark,
    // Grays
    ...grayDark,
    ...mauveDark,
    ...oliveDark,
    ...sageDark,
    ...sandDark,
    ...slateDark,
    // Metals
    ...bronzeDark,
    ...goldDark,
    //////////////
    // Colors
    ...blueDarkA,
    ...brownDarkA,
    ...crimsonDarkA,
    ...cyanDarkA,
    ...grassDarkA,
    ...greenDarkA,
    ...indigoDarkA,
    ...orangeDarkA,
    ...pinkDarkA,
    ...plumDarkA,
    ...purpleDarkA,
    ...redDarkA,
    ...tealDarkA,
    ...tomatoDarkA,
    ...violetDarkA,
    // Bright Colors
    ...amberDarkA,
    ...limeDarkA,
    ...mintDarkA,
    ...skyDarkA,
    ...yellowDarkA,
    // Grays
    ...grayDarkA,
    ...mauveDarkA,
    ...oliveDarkA,
    ...sageDarkA,
    ...sandDarkA,
    ...slateDarkA,
    // Metals
    ...bronzeDarkA,
    ...goldDarkA,
  },
})

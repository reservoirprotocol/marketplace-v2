import localFont from '@next/font/local'
import {
  blackA,
  crimson,
  crimsonDark,
  green,
  greenDark,
  indigo,
  red,
  redDark,
  brown,
  brownDark,
  brownA,
  brownDarkA,
  slate,
  sand,
  sandDark,
  slateDark,
  violet,
  violetA,
  violetDark,
  violetDarkA,
  whiteA,
} from '@radix-ui/colors'
import type * as Stitches from '@stitches/react'
import { createStitches } from '@stitches/react'
import { reset } from 'utils/css/reset'

export const loreTheme = {
  // Lore Brand Colors
  BrandOrange200: '#FFD6BE',
  BrandOrange300: '#FFB57E',
  BrandOrange600: '#995D16',
  BrandRed200: '#FFD4D4',
  BrandRed300: '#FFB8B8',
  BrandRed600: '#A55252',
  BrandViolet200: '#E0DAFF',
  BrandViolet300: '#CDC2FF',
  BrandViolet600: '#6F61A3',
  BrandPink200: '#FFD0F5',
  BrandPink300: '#FFB1EF',
  BrandPink600: '#995577',

  BrandOrange: '#FFB57E',
  BrandOrangeLight: '#FFD6BE',
  BrandOrangeDark: '#995D16',
  BrandRed: '#FFB8B8',
  BrandRedLight: '#FFD4D4',
  BrandRedDark: '#A55252',
  BrandViolet: '#CDC2FF',
  BrandVioletLight: '#E0DAFF',
  BrandVioletDark: '#6F61A3',
  BrandPink: '#FFB1EF',
  BrandPinkLight: '#FFD0F5',
  BrandPinkDark: '#995577',
  lore: '#FFB57E',
  loreMuted: '#666666',
  loreBgMuted: '#202020',
  tweetBorder: '#4d1e02',
  White: '#ffffff',
  Black: '#040303',
  Gray050: '#FBF9F8',
  Gray100: '#F6F3F2',
  Gray200: '#DFDDDB',
  Gray300: '#D0CBC9',
  Gray400: '#AFA8A5',
  Gray500: '#8C8684',
  Gray600: '#6F6A68',
  Gray700: '#4F4C4A',
  Gray800: '#363433',
  Gray900: '#191817',
  Gray950: '#100E0C',
  Red100: '#fdf0ef',
  Red200: '#fad6d3',
  Red300: '#f8bbb5',
  Red400: '#f58d80',
  Red500: '#ea5633',
  Red600: '#bb4227',
  Red700: '#892f19',
  Red800: '#671900',
  Red900: '#350900',
  Orange100: '#fdf0eb',
  Orange200: '#fad7c6',
  Orange300: '#f7be9d',
  Orange400: '#ec964b',
  Orange500: '#c27528',
  Orange600: '#965d2e',
  Orange700: '#6d431f',
  Orange800: '#4d2d13',
  Orange900: '#271406',
  Yellow100: '#f9f3d1',
  Yellow200: '#ece08c',
  Yellow300: '#d9cc6f',
  Yellow400: '#b8ac4b',
  Yellow500: '#93893a',
  Yellow600: '#746c2c',
  Yellow700: '#544e1f',
  Yellow800: '#3a3513',
  Yellow900: '#1b1906',
  Green100: '#ebf5ee',
  Green200: '#c7e6d0',
  Green300: '#97d9ac',
  Green400: '#55bd7e',
  Green500: '#3b985f',
  Green600: '#1d7a45',
  Green700: '#125831',
  Green800: '#0a3e21',
  Green900: '#031e0d',
  Blue100: '#edf3fe',
  Blue200: '#cce0fc',
  Blue300: '#abcdfa',
  Blue400: '#6faef0',
  Blue500: '#318cd5',
  Blue600: '#256fab',
  Blue700: '#184f7a',
  Blue800: '#0e3858',
  Blue900: '#041a2c',
  Indigo100: '#f2f2fc',
  Indigo200: '#dbdcf8',
  Indigo300: '#c5c7f2',
  Indigo400: '#a0a3ee',
  Indigo500: '#787de7',
  Indigo600: '#545bde',
  Indigo700: '#343cb5',
  Indigo800: '#232982',
  Indigo900: '#0e1145',
  Violet100: '#f3f1fd',
  Violet200: '#e0dbf9',
  Violet300: '#ccc5f5',
  Violet400: '#ae9fef',
  Violet500: '#8e75e7',
  Violet600: '#764edd',
  Violet700: '#582eb6',
  Violet800: '#3e1e84',
  Violet900: '#1d0b45',
  Purple100: '#f7f0ff',
  Purple200: '#e9d8f9',
  Purple300: '#ddbef5',
  Purple400: '#c994ee',
  Purple500: '#b861e6',
  Purple600: '#9d3bcc',
  Purple700: '#722996',
  Purple800: '#511b6c',
  Purple900: '#290a38',
  Pink100: '#fcf0f5',
  Pink200: '#f6d6e3',
  Pink300: '#f0bcd3',
  Pink400: '#e88eb8',
  Pink500: '#e1519e',
  Pink600: '#b33e7e',
  Pink700: '#842b5a',
  Pink800: '#5e1c40',
  Pink900: '#300a1e',
}

const Aeonik = localFont({
  src: [
    {
      path: './public/fonts/NewBrandFonts/Aeonik-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './public/fonts/NewBrandFonts/Aeonik-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './public/fonts/NewBrandFonts/Aeonik-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})

const AeonikMono = localFont({
  src: [
    {
      path: './public/fonts/NewBrandFonts/AeonikMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './public/fonts/NewBrandFonts/AeonikMono-Medium.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})

// CONFIGURABLE: Here you can update all your theming (outside of ReservoirKit which can be configured in the app.tsx)
// The theme colors are all already hooked up to stitches scales, so you just need to swap them.
// Don't forget to check the dark mode themes below.
// More on Stitches theme tokens: https://stitches.dev/docs/tokens
// More on Radix color scales: https://www.radix-ui.com/docs/colors/palette-composition/the-scales

export const { createTheme, keyframes, styled, globalCss, getCssText } =
  createStitches({
    theme: {
      //  Replaced with Lore colors
      colors: {
        ...crimson,
        ...violet,
        ...violetA,
        ...brown,
        ...brownA,
        ...slate,
        ...sand,
        ...red,
        ...whiteA,
        ...blackA,
        ...green,
        ...indigo,

        //Aliases

        //Primary
        primary1: '$brown1',
        primary2: '$brown2',
        primary3: '$brown3',
        primary4: '$brown4',
        primary5: '$brown5',
        primary6: '$brown6',
        primary7: '$brown7',
        primary8: '$brown8',
        primary9: '$brown9',
        primary10: '$brown10',
        primary11: '$brown11',
        primary12: '$brown12',

        //Secondary
        secondary1: '$brownA1',
        secondary2: '$brownA2',
        secondary3: '$brownA3',
        secondary4: '$brownA4',
        secondary5: '$brownA5',
        secondary6: '$brownA6',
        secondary7: '$brownA7',
        secondary8: '$brownA8',
        secondary9: '$brownA9',
        secondary10: '$brownA10',
        secondary11: '$brownA11',
        secondary12: '$brownA12',

        gray1: '$sand1', // @Irwin this is how to replace colors across the app with lore theme colors
        gray2: '$sand2',
        gray3: '$sand3',
        gray4: '$sand4',
        gray5: '$sand5',
        gray6: '$sand6',
        gray7: '$sand7',
        gray8: '$sand8',
        gray9: '$sand9',
        gray10: '$sand10',
        gray11: '$sand11',
        gray12: '$sand12',

        //Red
        red1: '$red1',
        red2: '$red2',
        red3: '$red3',
        red4: '$red4',
        red5: '$red5',
        red6: '$red6',
        red7: '$red7',
        red8: '$red8',
        red9: '$red9',
        red10: '$red10',
        red11: '$red11',
        red12: '$red12',

        neutralBg: 'white',
        neutralBgSubtle: 'white',
        panelShadow: 'rgba(0,0,0,0.1)',
        panelBg: '$gray2',
        panelBorder: 'transparent',
        dropdownBg: 'white',
        sidebarOverlay: 'black',
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
        body: Aeonik.style.fontFamily,
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
      bp1500: '(min-width: 1500px)',
      motion: '(prefers-reduced-motion)',
      hover: '(any-hover: hover)',
      dark: '(prefers-color-scheme: dark)',
      light: '(prefers-color-scheme: light)',
    },
  })

export const globalReset = globalCss(reset)

export const darkTheme = createTheme({
  // Replaced with Lore colors
  colors: {
    ...crimsonDark,
    ...violetDark,
    ...violetDarkA,
    ...slateDark,
    ...sandDark,
    ...brownDark,
    ...brownDarkA,
    ...greenDark,
    ...whiteA,
    ...redDark,
    ...blackA,

    //Aliases

    //Primary
    primary1: '$brown1',
    primary2: '$brown2',
    primary3: '$brown3',
    primary4: '$brown4',
    primary5: '$brown5',
    primary6: '$brown6',
    primary7: '$brown7',
    primary8: '$brown8',
    primary9: '$brown9',
    primary10: '$brown10',
    primary11: '$brown11',
    primary12: '$brown12',

    //Secondary
    secondary1: '$brownA1',
    secondary2: '$brownA2',
    secondary3: '$brownA3',
    secondary4: '$brownA4',
    secondary5: '$brownA5',
    secondary6: '$brownA6',
    secondary7: '$brownA7',
    secondary8: '$brownA8',
    secondary9: '$brownA9',
    secondary10: '$brownA10',
    secondary11: '$brownA11',
    secondary12: '$brownA12',

    //Gray
    gray1: '$sand1',
    gray2: '$sand2',
    gray3: '$sand3',
    gray4: '$sand4',
    gray5: '$sand5',
    gray6: '$sand6',
    gray7: '$sand7',
    gray8: '$sand8',
    gray9: '$sand9',
    gray10: '$sand10',
    gray11: '$sand11',
    gray12: '$sand12',

    accent: '#7000FF',

    neutralBgSubtle: '$gray3',
    neutralBg: '$gray1',

    panelBg: '$gray3',
    panelBorder: '$slate7',
    panelShadow: 'transparent',
    dropdownBg: '$gray3',
    sidebarOverlay: 'black',
  },
})

export const globalStyles = globalCss({
  '@font-face': [
    {
      fontFamily: 'Aeonik',
      fontStyle: 'normal',
      fontDisplay: 'swap',
      fontWeight: 400,
      src: `url(/fonts/NewBrandFonts/Aeonik-Regular.woff2) format('woff2')`,
    },
    {
      fontFamily: 'Aeonik',
      fontStyle: 'normal',
      fontDisplay: 'swap',
      fontWeight: 500,
      src: `url(/fonts/NewBrandFonts/Aeonik-Medium.woff2) format('woff2')`,
    },
    {
      fontFamily: 'Aeonik',
      fontStyle: 'normal',
      fontDisplay: 'swap',
      fontWeight: 700,
      src: `url(/fonts/NewBrandFonts/Aeonik-Bold.woff2) format('woff2')`,
    },
    {
      fontFamily: 'Aeonik Mono',
      fontStyle: 'normal',
      fontDisplay: 'swap',
      fontWeight: 400,
      src: `url(/fonts/NewBrandFonts/AeonikMono-Regular.woff2) format('woff2')`,
    },
    {
      fontFamily: 'Aeonik Mono',
      fontStyle: 'normal',
      fontDisplay: 'swap',
      fontWeight: 700,
      src: `url(/fonts/NewBrandFonts/AeonikMono-Medium.woff2) format('woff2')`,
    },
    {
      fontFamily: 'GT Ultra',
      fontStyle: 'normal',
      fontDisplay: 'swap',
      fontWeight: 700,
      src: `url(/fonts/NewBrandFonts/AeonikMono-Medium.woff2) format('woff2')`,
    },
    {
      fontFamily: 'GT Ultra',
      fontStyle: 'normal',
      fontDisplay: 'swap',
      fontWeight: 900,
      src: `url(/fonts/NewBrandFonts/GT-Ultra-Median-Black.woff2) format('woff2')`,
    },
  ],
  html: {
    fontStyle: 'normal',
    fontFamily: 'Aeonik',
    fontSize: '16px',
    fontFeatureSettings: '"ss01", "ss07"',
    fontVariantLigatures: 'no-contextual',
  },
  body: {
    fontFamily: '$lore',
  },
})

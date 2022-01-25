const Colors: {
  [index: string]: any
  getColor: (name: string) => string
} = {
  motion: {
    primary: '#4C97FF',
    secondary: '#4280D7',
    tertiary: '#3373CC',
  },
  looks: {
    primary: '#9966FF',
    secondary: '#855CD6',
    tertiary: '#774DCB',
  },
  sounds: {
    primary: '#CF63CF',
    secondary: '#C94FC9',
    tertiary: '#BD42BD',
  },
  control: {
    primary: '#FFAB19',
    secondary: '#EC9C13',
    tertiary: '#CF8B17',
  },
  event: {
    primary: '#FFBF00',
    secondary: '#E6AC00',
    tertiary: '#CC9900',
  },
  sensing: {
    primary: '#5CB1D6',
    secondary: '#47A8D1',
    tertiary: '#2E8EB8',
  },
  pen: {
    primary: '#0fBD8C',
    secondary: '#0DA57A',
    tertiary: '#0B8E69',
  },
  operators: {
    primary: '#59C059',
    secondary: '#46B946',
    tertiary: '#389438',
  },
  data: {
    primary: '#FF8C1A',
    secondary: '#FF8000',
    tertiary: '#DB6E00',
  },
  // This is not a new category, but rather for differentiation
  // between lists and scalar variables.
  data_lists: {
    primary: '#FF661A',
    secondary: '#FF5500',
    tertiary: '#E64D00',
  },
  more: {
    primary: '#FF6680',
    secondary: '#FF4D6A',
    tertiary: '#FF3355',
  },
  text: '#575E75',
  workspace: '#F9F9F9',
  toolboxHover: '#4C97FF',
  toolboxSelected: '#e9eef2',
  toolboxText: '#575E75',
  toolbox: '#FFFFFF',
  flyout: '#F9F9F9',
  scrollbar: '#CECDCE',
  scrollbarHover: '#CECDCE',
  textField: '#FFFFFF',
  insertionMarker: '#000000',
  insertionMarkerOpacity: 0.2,
  dragShadowOpacity: 0.3,
  stackGlow: '#FFF200',
  stackGlowSize: 4,
  stackGlowOpacity: 1,
  replacementGlow: '#FFFFFF',
  replacementGlowSize: 2,
  replacementGlowOpacity: 1,
  colourPickerStroke: '#FFFFFF',
  // CSS colours: support RGBA
  fieldShadow: 'rgba(0,0,0,0.1)',
  dropDownShadow: 'rgba(0, 0, 0, .3)',
  numPadBackground: '#547AB2',
  numPadBorder: '#435F91',
  numPadActiveBackground: '#435F91',
  numPadText: 'white', // Do not use hex here, it cannot be inlined with data-uri SVG
  valueReportBackground: '#FFFFFF',
  valueReportBorder: '#AAAAAA',
  getColor: (name: string): string => {
    let c = Colors[name]
    if (typeof c === 'string') {
      return c
    }
    return ''
  },
}

export default Colors

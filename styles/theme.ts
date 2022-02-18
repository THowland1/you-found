import { createTheme } from '@mui/material';
import { green } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      '50': '#C9EEEA',
      light: '#00C7B7',
      main: '#00AD9F',
      dark: '#15847B',
      '900': '#0D544E',
      contrastText: '#FFFFFF'
    },
    secondary: {
      '50': '#F7F8F8',
      light: '#E9EBEB',
      main: '#A3A9AC',
      dark: '#7D8589',
      '900': '#2D3B41'
    },
    grey: {
      '50': '#F7F8F8',
      '300': '#E9EBEB',
      '500': '#A3A9AC',
      '700': '#7D8589',
      '900': '#2D3B41'
    },
    success: {
      main: green[400]
    },
    // success: {
    //   '50': '#C9EEEA',
    //   light: '#00C7B7',
    //   main: '#00AD9F',
    //   dark: '#15847B',
    //   '900': '#0D544E'
    // },
    error: {
      '50': '#FED7E2',
      light: '#FC989F',
      main: '#FA3946',
      dark: '#DF111F',
      '900': '#BE131E'
    },
    background: {
      default: '#F7FCFC',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#0E1E25'
      //   secondary: '#F7F8F8',
    }
  },
  typography: {
    fontFamily:
      '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    h1: {
      fontSize: '2.75rem',
      fontWeight: 300
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 400
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 400
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 400
    }
  }
});

import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
// $coral-gradient: linear-gradient(135deg, #feb692 10%, #ea5455 100%);
// $turquoise-gradient: linear-gradient(to right, #0f3443, #34e89e);
// --body-light: #F6F7F9;
// --body-dark: #202427;
// --card-light:  #fff;
// --card-dark: #2E3237;
// --font-light: #202427;
// --font-dark: #F6F7F9;

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ea5455',
    },
    secondary: {
      main: '#19857b',
      '100': '#19857b33',
    },

    error: {
      main: red.A400,
    },
    background: {
      default: '#202427',
    },
    text: {
      primary: '#202427',
      secondary: '#20242766',
    },
  },
  typography: {
    fontFamily:
      '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  },
});

import { createTheme } from '@mui/material/styles';
import { colorTokens, typographyTokens } from '../styles/styleguide';

export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colorTokens.primary },
    secondary: { main: colorTokens.secondary },
    success: { main: colorTokens.success },
    warning: { main: colorTokens.warning },
    error: { main: colorTokens.error },
    info: { main: colorTokens.info },
    background: {
      default: colorTokens.background,
      paper: colorTokens.surface
    },
    text: {
      primary: colorTokens.secondary
    }
  },
  typography: {
    fontFamily: typographyTokens.sans,
    h1: { fontFamily: typographyTokens.display },
    h2: { fontFamily: typographyTokens.display },
    h3: { fontFamily: typographyTokens.display }
  },
  shape: {
    borderRadius: 12
  }
});
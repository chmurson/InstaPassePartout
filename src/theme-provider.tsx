import React, { FC, PropsWithChildren } from 'react'
import { createTheme, ThemeProvider as MuiThemeProvider, useMediaQuery } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: prefersDarkMode ? '#78909c' : '#546e7a  ',
          },
          secondary: {
            main: '#b0bec5',
          },
          background: {
            default: prefersDarkMode ? '#161616' : '#cfd8dc',
          },
          text: {
            primary: prefersDarkMode ? '#eeeeee' : '#424242',
          },
          error: {
            main: '#b71c1c',
          },
        },
      }),
    [prefersDarkMode],
  )

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}

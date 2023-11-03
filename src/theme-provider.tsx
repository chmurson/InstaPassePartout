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
          ...(prefersDarkMode
            ? {}
            : {
                background: {
                  default: !prefersDarkMode ? '#dcdcdc' : undefined,
                },
              }),
          action: {
            disabled: '#2a2a2a',
            disabledBackground: '#2f2f2f',
          },
          primary: {
            main: '#808080',
          },
          secondary: {
            main: prefersDarkMode ? '#626262' : '#333333',
          },
          text: {
            primary: prefersDarkMode ? '#dedede' : '#000000',
          },
          // contrastText: 'red',
          // dark: 'blue',
          // light: 'yellow',
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

import React from 'react';

const ColorModeContext = React.createContext({ toggleColorMode: ():void => {} });

const DesignTokens: (mode: string) => object = (mode: string) => ({
  palette: {
    mode,
    ...(
      mode === 'light'
        ? {
          primary: { main: '#C41407', light: '#000' },
          divider: '#777',
          text: {
            primary: '#000',
            secondary: '#777'
          },
          background: {
            default: '#C41407',
            paper: '#FFF'
          }
        }
        : {
          // palette values for dark mode
          primary: { main: '#C41407', dark: '#000', contrastText: '#fff' },
          divider: '#898989',
          action: {
            hover: 'rgba(196,20,6,1)'
          },
          background: {
            default: '#000',
            paper: 'rgba(0,0,0,1)'
          },
          text: {
            primary: '#FFF',
            secondary: '#EDEDED'
          }
        })
  },
  shape: {
    borderRadius: 4
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          float: 'left',
          color: '#FFF',
          borderRadius: 0,
          width: '238px',
          height: '138px',
          padding: '8px',
          margin: '2px 8px',
          cursor: 'pointer',
          fontSize: '1.25rem',
          fontWeight: 700,
          border: '1px solid #FFFFFF',
          backgroundColor: '#4d4d4d'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '1.1rem',
          color: '#ababab',
          minHeight: 18,
          alignItems: 'end',
          justifyContent: 'right',
          padding: '10px 20px'
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          width: 8
        }
      }
    }
  }
});

export {
  ColorModeContext,
  DesignTokens
};

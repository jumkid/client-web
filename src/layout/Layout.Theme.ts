import React from 'react';

const ColorModeContext = React.createContext({ toggleColorMode: ():void => { console.log("empty function");} });

const DesignTokens = (mode: string):object => ({
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
          // palette values for dark or other mode
          primary: { main: '#C41407', dark: '#000', contrastText: '#fff' },
          secondary: { main: '#FFF'},
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
    MuiTabs: {
      styleOverrides: {
        indicator: {
          width: 8
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
    MuiCard: {
      styleOverrides: {
        root: {
          float: 'left',
          color: '#FFF',
          borderRadius: 0,
          width: '353px',
          height: '200px',
          padding: '0 0',
          margin: '6px 6px',
          fontSize: '1.25rem',
          fontWeight: 700,
          border: '1px solid #FFFFFF',
          backgroundColor: '#4d4d4d'
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#232323',
          padding: '0 0',
          margin: '2px 2px'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          width: '348px'
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: 'pointer'
        }
      }
    }
  }
});

export {
  ColorModeContext,
  DesignTokens
};

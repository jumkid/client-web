import React from 'react';
import { grey } from '@mui/material/colors';
import styled from '@emotion/styled';
import { Box, Paper } from '@mui/material';
import { Theme } from '@emotion/react';

const ColorModeContext = React.createContext({ toggleColorMode: ():void => { console.log("empty function");} });

const JK_RED = '#C41407';

const DesignTokens = (mode: string):object => ({
  palette: {
    mode,
    ...(
      mode === 'light'
        ? {
          primary: { main: JK_RED, light: '#000' },
          secondary: { main: '#53a23b' },
          divider: grey[900],
          action: {
            hover: 'rgba(196,20,6,1)'
          },
          text: {
            primary: '#000',
            secondary: grey[900]
          },
          background: {
            default: JK_RED,
            paper: '#FFF'
          }
        }
        : {
          // palette values for dark or other mode
          primary: { main: JK_RED, dark: '#642408' },
          secondary: { main: '#FFF' },
          divider: grey[900],
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
    borderRadius: 0
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: '1px solid',
          borderColor: JK_RED,
          margin: "1px 0",
          "&.Mui-expanded": {
            margin: "1px 0"
          }
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: JK_RED,
          padding: '6px 8px',
          minHeight: 0,
          "&.Mui-expanded": {
            minHeight: 1,
            margin: "0 0"
          }
        },
        content: {
          margin: '0 0',
          "&.Mui-expanded": {
            margin: "0 0"
          }
        }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: "0 0"
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: JK_RED
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          backgroundColor: grey[900],
          '&.MuiTableRow-hover:hover': {
            backgroundColor: grey[700]
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px'
        },
        stickyHeader: {
          backgroundColor: JK_RED,
          fontWeight: '900'
        }
      }
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: '28px 120px 18px 120px',
          backgroundColor: grey[900]
        }
      }
    },
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
          cursor: 'hand',
          fontSize: '1.0rem',
          color: grey[300],
          minHeight: 10,
          alignItems: 'end',
          justifyContent: 'right',
          padding: '8px 12px'
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
          color: grey[900],
          backgroundColor: grey[500],
          padding: '0 0',
          margin: '2px 2px',
          height: '28px'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          width: '328px'
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          width: '328px'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: 'medium',
          padding: '2px 10px 2px 10px'
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: 'pointer'
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: '#686868'
        }
      }
    }
  }
});

type ItemProps = {
  theme: Theme
}

const Item = styled(Paper)(({ theme }:ItemProps) => ({
  ...theme,
  backgroundImage: 'none',
  paddingBottom: '8px',
  fontSize: '16px',
  fontWeight: '200',
  float: 'left'
}));

const ItemText = styled(Box)(({ theme }:ItemProps) => ({
  ...theme,
  width: '248px',
  textTransform: 'uppercase',
  fontWeight: '500',
  fontSize: '18px'
}));

const ItemHeader = styled(Box)(({ theme }:ItemProps) => ({
  ...theme,
  width: '100%',
  textTransform: 'uppercase',
  fontWeight: '500',
  fontSize: '26px'
}));

export {
  Item, ItemText, ItemHeader,
  ColorModeContext,
  DesignTokens
};

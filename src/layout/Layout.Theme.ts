import React from 'react';
import { grey } from '@mui/material/colors';
import styled from '@emotion/styled';
import { Box, FormControl, Select } from '@mui/material';
import { Theme } from '@emotion/react';

const ColorModeContext = React.createContext({ toggleColorMode: ():void => { console.log("empty function");} });

export const JK_RED = '#C41407';

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
            default: JK_RED,
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
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: '#303030'
        },
        action: {
          margin: '0 4px',
          padding: '0 4px'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000',
          opacity: 1,
          minHeight: 54
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: '#686868'
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: '1px solid',
          borderColor: JK_RED,
          margin: "12px 0",
          "&.Mui-expanded": {
            margin: "12px 0"
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
          padding: "8px 8px"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: 'medium',
          marginRight: '6px',
          padding: '2px 10px 2px 10px'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          float: 'left',
          color: '#FFF',
          borderRadius: 0,
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
          textTransform: 'uppercase',
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '2px 0 0 14px',
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          color: grey[900],
          backgroundColor: grey[500],
          padding: '4px 2px',
          margin: '7px 2px',
          height: '28px'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: "12px 14px 13px 13px"
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "15px 15px"
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          margin: '5px 0 8px 0'
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
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#303030',
          margin: '0 0',
          padding: '0 0'
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
    MuiSelect: {
      styleOverrides: {
        root: {
          margin: '5px 0 8px 0',
          width: '328px'
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
          margin: 3,
          cursor: 'pointer',
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
          padding: 10,
          border: 0,
        },
        stickyHeader: {
          backgroundColor: JK_RED,
          fontWeight: '900'
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
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
          minHeight: 10,
          alignItems: 'end',
          justifyContent: 'right',
          margin: '0 2px',
          padding: '14px 12px',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '328px'
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          margin: '0 0'
        }
      }
    }
  }
});

type StyledItemProps = {
  theme: Theme
}

const Item = styled(Box)(({ theme }:StyledItemProps) => ({
  ...theme,
  paddingTop: '8px',
  marginRight: '8px',
  fontSize: '16px',
  fontWeight: '200',
  float: 'left',
  opacity: 1
}));

const ItemText = styled(Box)(({ theme }:StyledItemProps) => ({
  ...theme,
  width: '248px',
  textTransform: 'uppercase',
  fontWeight: '500',
  fontSize: '18px'
}));

const ItemHeader = styled(Box)(({ theme }:StyledItemProps) => ({
  ...theme,
  width: '100%',
  fontWeight: '500',
  fontSize: '26px',
  marginTop: '21px'
}));

const S_FormControl = styled(FormControl)(({theme}:StyledItemProps) =>({
  ...theme,
  margin: '0 0 0 0'
}));

const S_Selection = styled(Select)(({ theme }:StyledItemProps) => ({
  ...theme,
  width: 183
}));

export {
  StyledItemProps, Item, ItemText, ItemHeader,
  S_FormControl,
  S_Selection,
  ColorModeContext,
  DesignTokens
};

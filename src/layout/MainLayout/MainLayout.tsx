import React from 'react';
import { Container, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TopBar from './MainLayout.TopBar';
import authenticationManager from '../../security/Auth/AuthenticationManager';
import { DesignTokens, ColorModeContext } from '../Layout.Theme';
import './MainLayout.css';
import { MenuSetting, UserSetting } from './model';

const menuSettings: MenuSetting[] = [
  { title: 'My Garage', isCurrent: true, route: '/' },
  { title: 'Professional', isCurrent: false, route: '/professional' }
];

const userSettings: UserSetting[] = [
  { title: 'Profile',
    callback: () => {
      window.location.assign('/user-profile');
    }
  },
  { title: 'Setting' },
  { title: '-' },
  {
    title: 'Logout',
    callback: () => {
      authenticationManager.logout();
      window.location.assign('/login');
    }
  }
];

type Props = {
  mode: string
  menuIndex: number
  children?: React.ReactNode
}

function MainLayout (props: Props) {
  const [mode, setMode] = React.useState(props.mode);
  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: string) =>
          prevMode === 'light' ? 'dark' : 'light'
        );
      }
    }),
    []
  );
  const _menuSettings: MenuSetting[] = menuSettings.map((item, _index) => {
    return {
      ...item,
      isCurrent: _index === props.menuIndex
    };
  });

  // Update the theme only if the mode changes
  const jkTheme = React.useMemo(() => createTheme(DesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={jkTheme}>
        <TopBar menuSettings={_menuSettings} userSettings={userSettings}/>

        <Container maxWidth='xl'>
          <Box className='dashboard-container' sx={{ gridTemplateColumns: 'repeat(10, 1fr)', display: 'grid', gap: 1 }}>
            { props.children }
          </Box>
        </Container>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default MainLayout;

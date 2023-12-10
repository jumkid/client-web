import React from 'react';
import { Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TopBar from './MainLayout.TopBar';
import authenticationManager from '../../security/Auth/AuthenticationManager';
import { DesignTokens, ColorModeContext } from '../Layout.Theme';
import './MainLayout.css';
import { MenuSetting, UserSetting } from './model';

const menuSettings: MenuSetting[] = [
  { title: 'Vehicles', isCurrent: true, route: '/' },
  { title: 'Lookup', isCurrent: false, route: '/lookup' }
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
  mode: 'light' | 'dark'
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

        <Container
          className='layout-container'
          maxWidth='xl'
          sx={{ gridTemplateColumns: 'repeat(10, 1fr)', display: 'grid', gap: 1 }}
        >
          { props.children }
        </Container>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default MainLayout;

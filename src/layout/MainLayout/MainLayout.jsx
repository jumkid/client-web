import React from 'react';
import { Container, AppBar, Toolbar, Icon, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NavButtons from './MainLayout.NavButtons';

const theme = createTheme({
  palette: {
    secondary: {
      main: '#C41407'
    }
  }
});

const menuItems = [
  { title: 'Car Owner', isCurrent: true, route: '/' },
  { title: 'Professional', isCurrent: false, route: '/professional' }
];

function MainLayout () {
  const menuOnClickHandler = () => {
    console.log('clicked menu item');
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar color="secondary" position="static">
        <Container maxWidth="xl">
          <Toolbar variant="dense">
            <Icon className="navigation-logo"/>
            <Divider />
            <NavButtons items={menuItems} handleClick={menuOnClickHandler}/>
          </Toolbar>
        </Container>
      </AppBar>

      <Container fixed>
        <h1> here you go</h1>
      </Container>
    </ThemeProvider>
  );
}

export default MainLayout;

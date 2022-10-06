import React from 'react';
import { Container, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';
import './index.css';
import TopBar from './MainLayout.TopBar';

const jkTheme = createTheme({
  palette: {
    primary: {
      main: '#C41407'
    }
  }
});

const styles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gap: 1,
  borderColor: 'text.primary',
  m: 2,
  border: 0,
  height: '87vh',
  minHeight: '600px',
  minWidth: '1024px',
  padding: '6px 8px',
  borderRadius: 3,
  opacity: [0.5, 0.8, 0.9]
};

const menuItems = [
  { title: 'My Garage', isCurrent: true, route: '/' },
  { title: 'Professional', isCurrent: false, route: '/professional' }
];

const userSettings = ['Profile', 'Account', '-', 'Logout'];

function MainLayout (props) {
  return (
    <ThemeProvider theme={jkTheme}>
      <TopBar menuItems={menuItems} settings={userSettings}/>

      <Container maxWidth='xl'>
        <Box sx={{ ...styles }}>
          { props.children }
        </Box>
      </Container>
    </ThemeProvider>
  );
}

MainLayout.propTypes = {
  children: PropTypes.array.isRequired
};

export default MainLayout;

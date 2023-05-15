import React from 'react';
import {
  AppBar,
  Container,
  Icon,
  Toolbar
} from '@mui/material';

function TopBar () {
  return (
    <AppBar position="static">
      <Container maxWidth={false} disableGutters={true}>
        <Toolbar sx={{ backgroundColor: '#C41407' }} variant="dense">
          <Icon className="navigation-logo"/>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default TopBar;

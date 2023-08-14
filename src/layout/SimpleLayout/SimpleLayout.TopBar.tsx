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
        <Toolbar variant="dense">
          <Icon className="navigation-logo"/>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default TopBar;

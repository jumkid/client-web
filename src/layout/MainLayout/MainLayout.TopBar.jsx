import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Container,
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import NavButtons from './MainLayout.NavButtons';
import PropTypes from 'prop-types';

function TopBar ({ menuItems, settings }) {
  const [anchorElUser, setAnchorElUser] = useState(null);

  const menuOnClickHandler = () => {
    console.log('clicked menu item');
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth={false} disableGutters={true}>
        <Toolbar variant="dense">
          <Icon className="navigation-logo"/>
          <NavButtons items={menuItems} handleClick={menuOnClickHandler}/>
          <Box sx={{ flex: 1 }}/>
          <Box>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Chooli Yip" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu id="menu-appbar"
              sx={{ mt: '8px', mr: '200px' }}
              anchorEl={anchorElUser}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                setting === '-'
                  ? <Divider key={index}/>
                  : <MenuItem key={index} onClick={handleCloseUserMenu}><Typography textAlign="center">{setting}</Typography></MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

TopBar.propTypes = {
  settings: PropTypes.array.isRequired,
  menuItems: PropTypes.array.isRequired
};

export default TopBar;

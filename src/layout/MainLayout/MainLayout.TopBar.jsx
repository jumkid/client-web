import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
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
import { Notifications } from '@mui/icons-material';
import PropTypes from 'prop-types';
import authenticationManager from '../../Auth/AuthenticationManager';

function TopBar ({ menuItems, settings }) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const tokenUser = authenticationManager.getTokenUser();
  const menuOnClickHandler = () => {
    console.log('clicked menu item');
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNotification = () => {
    console.log('click notification');
  };

  return (
    <AppBar position="static">
      <Container maxWidth={false} disableGutters={true}>
        <Toolbar variant="dense">
          <Icon className="navigation-logo"/>
          <NavButtons items={menuItems} handleClick={menuOnClickHandler}/>

          <Box sx={{ flex: 1 }}/>

          { tokenUser && <IconButton aria-label={handleNotification}>
            <Badge sx={{ mr: 2 }} badgeContent={1} overlap="circular" color="success">
              <Notifications fontSize='large'/>
            </Badge>
          </IconButton> }

          <Box>
            { tokenUser && <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={tokenUser.name} src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip> }

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
                setting.title === '-'
                  ? <Divider key={index}/>
                  : <MenuItem key={index} onClick={() => setting.callback(this)}>
                    <Typography textAlign="center">{setting.title}</Typography>
                  </MenuItem>
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

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
import { HandleClick, MenuSetting, UserSetting } from './model';
import * as C from '../../App.constants';

interface Props {
  menuSettings: MenuSetting[],
  userSettings: UserSetting[]
}

const initialState: HTMLButtonElement | null = null;

function TopBar ({ menuSettings, userSettings }: Props) {
  const [anchorElUser, setAnchorElUser] = useState(initialState);
  const tokenUser = authenticationManager.getTokenUser();
  const [items, setItems] = useState(menuSettings);
  const menuOnClickHandler:HandleClick = (index:number) => {
    setItems(prevItems => prevItems.map((item, _index) => {
      return {
        ...item,
        isCurrent: _index === index
      };
    }));
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
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
        <Toolbar sx={{ backgroundColor: '#C41407' }} variant="dense">
          <Icon className="navigation-logo"/>
          <NavButtons items={items} handleClick={menuOnClickHandler}/>

          <Box sx={{ flex: 1 }}/>

          { tokenUser && <IconButton onClick={handleNotification} aria-label="check notification">
            <Badge sx={{ mr: 2 }} badgeContent={1} overlap="circular" color="success">
              <Notifications fontSize='large'/>
            </Badge>
          </IconButton> }

          <Box>
            { tokenUser && <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
                <Avatar alt={tokenUser.preferred_username} src={C.CONTENT_THUMBNAIL_API + tokenUser.avatarId} />
              </IconButton>
            </Tooltip> }

            <Menu id="menu-appbar"
              sx={{ mt: '8px' }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userSettings.map((setting, index) => (
                setting.title === '-'
                  ? <Divider key={index}/>
                  : <MenuItem sx={{ minWidth: '148px' }}
                    key={index}
                    onClick={(event) => {setting.callback && setting.callback(event.target);}}>
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
  menuSettings: PropTypes.array.isRequired,
  userSettings: PropTypes.array.isRequired
};

export default TopBar;

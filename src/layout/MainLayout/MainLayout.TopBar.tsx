import React, { useCallback, useEffect, useState } from 'react';
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
import { MenuSetting, UserSetting } from './model';
import * as C from '../../App.constants';
import { RootState } from '../../store';
import { useAppDispatch, useAppSelector } from '../../App.hooks';
import NotificationDrawer from '../../feature/UserOriented/NotificationDrawer';
import { fetchUserActivityNotifications } from '../../store/userNotificationsSlice';

type Props = {
  menuSettings: MenuSetting[],
  userSettings: UserSetting[]
}

const initialElement: HTMLButtonElement | null = null;

function TopBar ({ menuSettings, userSettings }: Props) {
  const [anchorElUser, setAnchorElUser] = useState(initialElement);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const tokenUser = useAppSelector((state:RootState) => state.tokenUser);
  const userProfile = tokenUser.userProfile;
  const userAvatar = userProfile.attributes?.avatar[0];
  const userName = userProfile.username;

  const [items, setItems] = useState(menuSettings);
  const menuOnClickHandler = useCallback((index:number) => {
    setItems(prevItems => prevItems.map((item, _index) => ({
      ...item,
      isCurrent: _index === index
    })));
  }, []);

  const userNotificationsCount = useAppSelector((state:RootState) => state.userNotifications.count);
  const dispatch = useAppDispatch();

  const autoRefresh = ():ReturnType<typeof setInterval> => {
    dispatch(fetchUserActivityNotifications()); // run at the very first time
    return setInterval(() => {
      dispatch(fetchUserActivityNotifications());
    }, 5000);
  }

  useEffect(() => {
    const autoRefreshEvent = autoRefresh();
    return () => { clearInterval(autoRefreshEvent); }
  },[]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLButtonElement>):void => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = ():void => {
    setAnchorElUser(null);
  };

  const toggleDrawer = ():void => {
    setDrawerOpen(prevState => !prevState);
  };

  return (
    <AppBar position="static">
      <Container maxWidth={false}>
        <Toolbar variant="dense">
          <Icon className="navigation-logo"/>
          <NavButtons items={items} handleClick={menuOnClickHandler}/>

          <Box sx={{ flex: 1 }}/>

          { tokenUser &&
          <IconButton onClick={toggleDrawer} aria-label="check notification" disabled={userNotificationsCount < 1}>
            <Badge sx={{ mr: 2 }} badgeContent={userNotificationsCount} overlap="circular" color="success">
              <Notifications fontSize='large'/>
            </Badge>
          </IconButton> }

          <NotificationDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

          <Box>
            { tokenUser && <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
                {!userAvatar && <Avatar alt={userName} />}
                {userAvatar && <Avatar alt={userName} src={`${C.CONTENT_THUMBNAIL_API}/${userAvatar}?size=medium`} />}
              </IconButton>
            </Tooltip> }

            <Menu
              sx={{ mt: '8px' }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              { userSettings.map((setting, index) => (
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

export default TopBar;

import React, { useCallback, useEffect, useState } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Container,
  Divider, Drawer,
  Icon,
  IconButton, ListItem, ListItemText,
  Menu,
  MenuItem, Paper,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import NavButtons from './MainLayout.NavButtons';
import { Notifications, Event, Close } from '@mui/icons-material';
import { MenuSetting, UserSetting } from './model';
import * as C from '../../App.constants';
import { RootState } from '../../store';
import { useAppSelector } from '../../App.hooks';
import { userService } from '../../service';
import UserActivity from './model/UserActivity';

type Props = {
  menuSettings: MenuSetting[],
  userSettings: UserSetting[]
}

const initialElement: HTMLButtonElement | null = null;
const initialUserActivities: UserActivity[] = [];

function TopBar ({ menuSettings, userSettings }: Props) {
  const [anchorElUser, setAnchorElUser] = useState(initialElement);
  const [userActivities, setUserActivities] = useState(initialUserActivities);
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

  useEffect(() => {
    userService.getUserActivities()
      .then(response => {
        setUserActivities(response.data || []);
      });
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

  const handleActivityClick = (userActivity:UserActivity):void => {
    console.log(userActivity.id);
    toggleDrawer();
  }

  const closeActivity = async (id: number): Promise<any> => {
    console.log(id);
    const response = await userService.closeUserActivity(id);
    if (response.status === 202) {
      setUserActivities(prevState => prevState.filter(userActivity => userActivity.id !== id));
    }
  }

  return (
    <AppBar position="static">
      <Container maxWidth={false} disableGutters={true}>
        <Toolbar sx={{ backgroundColor: '#C41407' }} variant="dense">
          <Icon className="navigation-logo"/>
          <NavButtons items={items} handleClick={menuOnClickHandler}/>

          <Box sx={{ flex: 1 }}/>

          { tokenUser &&
          <IconButton onClick={toggleDrawer} aria-label="check notification" disabled={userActivities.length < 1}>
            <Badge sx={{ mr: 2 }} badgeContent={userActivities.length} overlap="circular" color="success">
              <Notifications fontSize='large'/>
            </Badge>
          </IconButton> }

          <Drawer
            open={drawerOpen}
            anchor='right'
            sx={{width: '230px', px: 2, opacity: '96%'}}
            onClose={toggleDrawer}
          >
            <Paper sx={{ m: 2, borderRadius: '13px' }}>
              { userActivities.map((userActivity, idx) => (
                <ListItem key={idx}>
                  <Event sx={{ mr:1 }} fontSize={'small'}/>
                  <ListItemText
                    sx={{cursor: 'pointer', textDecoration: 'underline', mr: 2}}
                    primary={userActivity.title}
                    onClick={() => handleActivityClick(userActivity)}
                  />
                  <IconButton onClick={() => closeActivity(userActivity.id)}><Close fontSize={'small'}/></IconButton>
                </ListItem>
              ))}
            </Paper>
          </Drawer>

          <Box>
            { tokenUser && <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
                {!userAvatar && <Avatar alt={userName} />}
                {userAvatar && <Avatar alt={userName} src={`${C.CONTENT_THUMBNAIL_API}/${userAvatar}?size=medium`} />}
              </IconButton>
            </Tooltip> }

            <Menu
              id="menu-appbar"
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

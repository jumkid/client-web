import React from 'react';
import { Drawer, IconButton, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { Close, Event } from '@mui/icons-material';
import ActivityNotification from '../../../layout/MainLayout/model/ActivityNotification';
import { userService } from '../../../service';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { RootState } from '../../../store';
import { readActivityNotification, removeActivityNotification } from '../../../store/userNotificationsSlice';

interface Props {
  drawerOpen: boolean
  toggleDrawer: () => void
}

function NotificationDrawer ({drawerOpen, toggleDrawer}:Props) {
  const activityNotifications = useAppSelector((state:RootState) => state.userNotifications.activityNotifications);
  const dispatch = useAppDispatch();

  const handleClick = async (activityNotification:ActivityNotification):Promise<any> => {
    const activityNotificationId = activityNotification.id;
    if (activityNotification.unread) {
      const response = await userService.readActivityNotification(activityNotificationId);
      if (response.data?.success) {
        dispatch(readActivityNotification(activityNotificationId));
      }
    }
    toggleDrawer();
  }

  const deleteActivity = async (activityNotificationId: number): Promise<any> => {
    const response = await userService.deleteActivityNotification(activityNotificationId);
    if (response.status === 204) {
      dispatch(removeActivityNotification(activityNotificationId));
      toggleDrawer();
    }
  }

  return (
    <Drawer
      open={drawerOpen}
      anchor='right'
      sx={{px: 2, '& .MuiDrawer-paper': {width: '300px', backgroundColor: 'transparent'}}}
      onClose={toggleDrawer}
    >
      <Paper sx={{ m: 2, borderRadius: '13px' }}>
        { activityNotifications.map((activityNotification, idx) => (
          <ListItem key={idx}>
            <Event sx={{ mr:1 }} fontSize={'small'}/>
            <ListItemText
              sx={{cursor: 'pointer', mr: 2}}
              primary={<Typography variant='body1' fontWeight={activityNotification.unread ? 'bold' : 'normal'}>{activityNotification.title}</Typography>}
              onClick={() => handleClick(activityNotification)}
            />
            <IconButton onClick={() => deleteActivity(activityNotification.id)}><Close fontSize={'small'}/></IconButton>
          </ListItem>
        ))}
      </Paper>
    </Drawer>
  )
}

export default NotificationDrawer;

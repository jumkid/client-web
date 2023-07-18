import React from 'react';
import { Drawer, IconButton, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { Close, Event } from '@mui/icons-material';
import ActivityNotification from '../../../layout/MainLayout/model/ActivityNotification';
import { userService } from '../../../service';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { RootState } from '../../../store';
import { readActivityNotification, removeActivityNotification } from '../../../store/userNotificationsSlice';
import { fetchActivity } from '../../../store/vehicleActivitiesSlice';
import { APIResponse } from '../../../service/model/Response';
import { Activity } from '../../../store/model/Activity';
import { VEHICLE } from '../../../App.constants';
import * as _ from 'lodash';
import { changePick } from '../../../store/userVehiclesSlice';
import { SIDE_TABS_OFFSET } from '../../CustomerGarage/GarageSideBar/GarageSideTabs';

interface Props {
  drawerOpen: boolean
  toggleDrawer: () => void
}

function NotificationDrawer ({drawerOpen, toggleDrawer}:Props) {
  const activityNotifications = useAppSelector((state:RootState) => state.userNotifications.activityNotifications);
  const userVehicles = useAppSelector((state:RootState) => state.userVehicles.vehicles);
  const dispatch = useAppDispatch();

  const handleClick = async (activityNotification:ActivityNotification):Promise<any> => {
    const activityNotificationId = activityNotification.id;
    const activityId = parseInt(activityNotification.entityId);
    if (activityNotification.unread) {
      const response = await userService.readActivityNotification(activityNotificationId);
      if (response.data?.success) {
        dispatch(readActivityNotification(activityNotificationId));
      }
    }

    dispatch(fetchActivity(activityId)).then(
      (response) => {
        //locate vehicle profile
        const payload = response.payload as APIResponse<Activity>;
        const activity = payload.data;
        const entityLinks = activity?.activityEntityLinks || []
        const first = entityLinks.findIndex(entityLink => entityLink.entityName === VEHICLE);
        const vehicleId = _.isUndefined(first) ? null : entityLinks[first].entityId;
        const vehicleIdx = userVehicles.findIndex(vehicle => vehicle.id === vehicleId);
        dispatch(changePick(vehicleIdx + SIDE_TABS_OFFSET));
      }
    );

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
        { !_.isNil(activityNotifications) && activityNotifications.map((activityNotification, idx) => (
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

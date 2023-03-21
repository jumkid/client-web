import React, { useContext, useEffect } from 'react';
import { Box, Chip, Link } from '@mui/material';
import { Event } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { fetchActivity, fetchVehicleActivities } from '../../../../store/vehicleActivitiesSlice';
import { RootState } from '../../../../store';
import './Activity.css';
import { ErrorsContext } from './ActivityContext';

interface Props {
  entityId: string
}

function ActivitiesList ({entityId}:Props) {
  const dispatch = useAppDispatch();
  const activities = useAppSelector((state:RootState) => state.vehicleActivities.activities);

  const {setErrors} = useContext(ErrorsContext);

  useEffect(() => {
    dispatch(fetchVehicleActivities(entityId));
  },[entityId]);

  const handleClick = (activityId: number) => {
    dispatch(fetchActivity(activityId)).then(() => {
      setErrors({hasUpdate: false});
    });
  }

  const dateFormatter = (datetime: string):string => {
    const now = new Date();
    const parts = datetime.split("T");
    if (parts[0].startsWith(now.getFullYear().toString())) {
      return parts[0].substring(5);
    } else {
      return parts[0];
    }
  }

  const timeFormatter = (datetime: string):string => {
    const parts = datetime.split("T");
    return parts[1];
  }

  return (
    <Box padding={1}>
      { activities && activities.map((activity, index) =>
        <div key={index}>
          <Event className="activity-icon" />
          <Chip className="date-chip" label={dateFormatter(activity.startDate)}/>
          <Chip className="time-chip" label={timeFormatter(activity.startDate)}/>
          <Link onClick={ ()=> handleClick(activity.id) } color="secondary" variant="body1">{activity.name}</Link>
        </div>
      )}
    </Box>
  )
}

export default ActivitiesList;

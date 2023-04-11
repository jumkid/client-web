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

  const handleClick = async (activityId: number): Promise<void> => {
    try {
      await dispatch(fetchActivity(activityId));
      setErrors({hasUpdate: false});
    } catch (error) {
      console.error(error);
    }
  }

  const dateFormatter = (datetime: string | undefined):string => {
    const [dateString] = getDatetimeParts(datetime);
    const currentYear = new Date().getFullYear().toString();
    return dateString.startsWith(currentYear) ? dateString.substring(5) : dateString;
  }

  const timeFormatter = (datetime: string | undefined):string => {
    const parts = getDatetimeParts(datetime);
    return !parts ? '' : parts[1];
  }

  const getDatetimeParts = (datetime: string | undefined):string[] => {
    if (!datetime) { return [] }
    return datetime.split("T");
  }

  return (
    <Box padding={1}>
      { activities?.map((activity, index) =>
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

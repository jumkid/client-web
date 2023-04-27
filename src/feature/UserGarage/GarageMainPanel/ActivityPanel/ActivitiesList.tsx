import React, { useContext } from 'react';
import { Box, Chip, Link } from '@mui/material';
import { Event } from '@mui/icons-material';
import { useAppDispatch } from '../../../../App.hooks';
import { fetchActivity } from '../../../../store/vehicleActivitiesSlice';
import './Activity.css';
import { ErrorsContext } from './ActivityContext';
import { Activity } from '../../../../store/model/Activity';
import { dateFormatter, timeFormatter } from '../../../../App.utils';

interface Props {
  activities?: Activity[]
}

function ActivitiesList ({activities}:Props) {
  const dispatch = useAppDispatch();
  const {setErrors} = useContext(ErrorsContext);

  const handleClick = async (activityId: number): Promise<void> => {
    try {
      await dispatch(fetchActivity(activityId));
      setErrors({hasUpdate: false});
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box padding={1}>
      { activities?.map((activity, index) =>
        <div key={index}>
          <Event className="activity-icon" />
          <Chip className="date-chip" label={dateFormatter(activity.startDate)}/>
          <Chip className="time-chip" label={timeFormatter(activity.startDate, true)}/>
          <Link onClick={ ()=> handleClick(activity.id) } color="secondary" variant="body1">{activity.name}</Link>
        </div>
      )}
    </Box>
  )
}

export default ActivitiesList;

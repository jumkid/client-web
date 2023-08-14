import React, { useEffect, useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Fab,
  Tab,
  Tabs
} from '@mui/material';
import { List, CalendarViewWeek, Add } from '@mui/icons-material';
import ActivitiesList from './ActivitiesList';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { RootState } from '../../../../store';
import { fetchVehicleActivities, resetCurrentActivity } from '../../../../store/vehicleActivitiesSlice';
import { ErrorsContext } from './ActivityContext';
import { initValidationErrors } from './ActivityMaintenance/ActivityMaintForm.Validator';
import ActivityMaintDialog from './ActivityMaintenance/ActivityMaintDialog';
import ActivityCalendar from './ActivityCalendar';
import * as C from '../../../../App.constants';
import './Activity.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel ({children, value, index}:TabPanelProps) {
  return (
    <>
      {value === index && (
        children
      )}
    </>
  )
}

interface Props {
  vehicleId: string
}

function ActivitiesPanel ({vehicleId}:Props) {
  const [tab, setTab] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  const [errors, setErrors] = useState(initValidationErrors);
  const errorsProvider = useMemo(() => ({errors, setErrors}), [errors, setErrors]);

  const currentActivity = useAppSelector((state:RootState) => state.vehicleActivities.currentActivity);
  const activities = useAppSelector((state:RootState) => state.vehicleActivities.activities);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchVehicleActivities(vehicleId));
  },[vehicleId]);

  const handleTabChange = (event: React.SyntheticEvent, tabNum: number) => {
    setTab(tabNum);
  };

  useEffect(() => {
    if (currentActivity.id > 0) {
      setShowDialog(true);
    }
  }, [currentActivity]);

  const handleAddClick = () => {
    dispatch(resetCurrentActivity(vehicleId));
    setErrors(initValidationErrors);
    setShowDialog(true);
  }

  return (
    <Box>
      <AppBar position="static">
        <Tabs value={tab} onChange={handleTabChange} aria-label="activity view">
          <Tab icon={<List />} iconPosition="start" label="LIST" />
          <Tab icon={<CalendarViewWeek />} iconPosition="start" label="WEEK" />
        </Tabs>
        <Box className="activity-add-btn">
          <Fab
            onClick={handleAddClick}
            size={'small'}
            aria-label="add"
            variant="extended"
          >
            <Add/>
            Create
          </Fab>
        </Box>
      </AppBar>

      <ErrorsContext.Provider value={errorsProvider}>
        <ActivityMaintDialog vehicleId={vehicleId} showDialog={showDialog} setShowDialog={setShowDialog}/>

        <TabPanel value={tab} index={0}>
          <ActivitiesList activities={activities || []}/>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <ActivityCalendar mode={C.WEEK} activities={activities || []}/>
        </TabPanel>
      </ErrorsContext.Provider>
    </Box>
  )
}

export default ActivitiesPanel;

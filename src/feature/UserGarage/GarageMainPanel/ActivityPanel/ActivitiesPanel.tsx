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
import { resetCurrentActivity } from '../../../../store/vehicleActivitiesSlice';
import { ErrorsContext } from './ActivityContext';
import { initValidationErrors } from './ActivityMainForm.Validator';
import ActivityMainDialog from './ActivityMainDialog';

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
  const dispatch = useAppDispatch();

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
        <Fab
          onClick={handleAddClick}
          size={'small'}
          sx={{position: 'absolute', top: 41, right: 12}}
          aria-label="add"
          variant="extended"
        >
          <Add/>
          Create
        </Fab>
      </AppBar>

      <ErrorsContext.Provider value={errorsProvider}>
        <ActivityMainDialog vehicleId={vehicleId} showDialog={showDialog} setShowDialog={setShowDialog}/>

        <TabPanel value={tab} index={0}>
          <ActivitiesList entityId={vehicleId}/>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          week view
        </TabPanel>
      </ErrorsContext.Provider>
    </Box>
  )
}

export default ActivitiesPanel;

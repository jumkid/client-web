import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Tab,
  Tabs
} from '@mui/material';
import { List, CalendarViewWeek, Add, Close } from '@mui/icons-material';
import ActivitiesList from './ActivitiesList';
import ActivityMainForm from './ActivityMainForm';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { RootState } from '../../../../store';
import {
  fetchVehicleActivities,
  resetCurrentActivity,
  saveUpdate,
  saveNew,
  deleteActivity
} from '../../../../store/vehicleActivitiesSlice';
import * as _ from 'lodash';
import ConfirmDialog from '../../../../component/ConfirmDialog';
import { ErrorsContext } from './ActivityContext';
import { initValidationErrors } from './ActivityMainForm.Validator';

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
  const [newActivity, setNewActivity] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [errors, setErrors] = useState(initValidationErrors);
  const errorsProvider = useMemo(() => ({errors, setErrors}), [errors, setErrors]);

  const currentActivity = useAppSelector((state:RootState) => state.vehicleActivities.currentActivity);
  const dispatch = useAppDispatch();

  const handleTabChange = (event: React.SyntheticEvent, tabNum: number) => {
    setTab(tabNum);
  };

  const handleAddClick = () => {
    dispatch(resetCurrentActivity(vehicleId));
    setNewActivity(true);
  }

  const handleSaveClick = async () => {
    let response;
    let actionFulfilled;
    if (currentActivity.id > 0) {
      response = await dispatch(saveUpdate(currentActivity));
      actionFulfilled = saveUpdate.fulfilled.type;
    } else {
      if (_.isNil(currentActivity.activityEntityLinks)) {
        currentActivity.activityEntityLinks = [];
      }
      response = await dispatch(saveNew(currentActivity));
      actionFulfilled = saveNew.fulfilled.type;
    }

    if (!_.isNull(response) && response.type === actionFulfilled) {
      setNewActivity(false);
      setErrors({hasUpdate: false});
      dispatch(fetchVehicleActivities(vehicleId));
    }
  }

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  }

  const deleteConfirm = () => {
    dispatch(deleteActivity(currentActivity.id)).then(
      () => {
        dispatch(fetchVehicleActivities(vehicleId));
      }
    );
    handleCancelClick();
    setIsConfirmOpen(false);
  }

  const deleteCancel = () => {
    setIsConfirmOpen(false);
  }

  const handleCancelClick = () => {
    dispatch(resetCurrentActivity(vehicleId));
    setNewActivity(false);
  }

  const showDialog = newActivity || currentActivity.id > 0;
  const showDeleteButton = currentActivity.id > 0;
  const isFormValid = (Object.values(errors).length === 1 && errors.hasUpdate);

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
        <Dialog open={showDialog} maxWidth={false}>
          <DialogTitle>
            Activity Details
            <IconButton
              aria-label="close"
              onClick={handleCancelClick}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Close/>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <ActivityMainForm vehicleId={vehicleId}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveClick} color="primary" variant="outlined" disabled={!isFormValid}>save</Button>
            <Button onClick={handleDeleteClick} color="primary" variant="outlined" disabled={!showDeleteButton}>delete</Button>
            <ConfirmDialog
              title="Delete Activity"
              message="Are you sure to delete this activity?"
              isShown={isConfirmOpen}
              confirmCallback={deleteConfirm}
              cancelCallback={deleteCancel}
            />
          </DialogActions>
        </Dialog>

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

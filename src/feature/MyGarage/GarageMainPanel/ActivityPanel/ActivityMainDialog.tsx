import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs, Typography
} from '@mui/material';
import { Close, Warning } from '@mui/icons-material';
import ActivityMainForm from './ActivityMainForm';
import ConfirmDialog from '../../../../component/ConfirmDialog';
import {
  deleteActivity,
  fetchVehicleActivities,
  resetCurrentActivity,
  saveNew,
  saveUpdate
} from '../../../../store/vehicleActivitiesSlice';
import { initValidationErrors } from './ActivityMainForm.Validator';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { RootState } from '../../../../store';
import { ErrorsContext } from './ActivityContext';
import ActivityAttachmentsPanel from './ActivityAttachmentsPanel';
import { contentService } from '../../../../service';
import * as _ from 'lodash';

interface Props {
  vehicleId: string
  showDialog:boolean
  setShowDialog:(showDialog:boolean) => void
}

function ActivityMainDialog ({vehicleId, showDialog, setShowDialog}:Props) {
  const [currentTab, setCurrentTab] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {errors, setErrors} = useContext(ErrorsContext);
  const [serverError, setServerError] = useState('');

  const currentActivity = useAppSelector((state:RootState) => state.vehicleActivities.currentActivity);
  const dispatch = useAppDispatch();

  const handleTabChange = (event: React.SyntheticEvent, index: number) => {
    setCurrentTab(index);
  };

  const handleSaveClick = async () => {
    const activity = { ...currentActivity, activityEntityLinks: currentActivity.activityEntityLinks || []}
    const action = currentActivity.id > 0 ? saveUpdate(activity) : saveNew(activity);

    try {
      const response = await dispatch(action);
      if (response.type.endsWith('/fulfilled')) {
        setShowDialog(false);
        setErrors({hasUpdate: false});
        dispatch(fetchVehicleActivities(vehicleId));
      } else {
        setServerError(response.payload as string);
      }
    } catch (e:any) {
      setServerError(e.response.data);
    }

  }

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  }

  const deleteConfirm = () => {
    dispatch(deleteActivity(currentActivity.id)).then(
      () => {
        handleClose();
        dispatch(fetchVehicleActivities(vehicleId));
      }
    );
    setIsConfirmOpen(false);
  }

  const deleteCancel = () => {
    setIsConfirmOpen(false);
  }

  const handleClose = () => {
    dispatch(resetCurrentActivity(vehicleId));
    setErrors(initValidationErrors);
    cleanUpNewUploads();
    setShowDialog(false);
    setCurrentTab(0);
  }

  const cleanUpNewUploads = () => {
    if (currentActivity.id > 0) { return; }
    currentActivity.contentResources?.forEach(async contentResource =>
      await contentService.deleteContentMetadata(contentResource.contentResourceId)
    );
  }

  const showDeleteButton = currentActivity.id > 0;
  const isFormValid = (Object.values(errors).length === 1 && errors.hasUpdate);

  return (
    <Dialog open={showDialog} maxWidth={false}>
      <DialogTitle>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{ borderColor: 'divider', width: '100%', mb: 1, p: 0 }}
        >
          <Tab label="Activity Details" />
          <Tab label="Attachments" />
        </Tabs>
        <IconButton
          aria-label="close"
          onClick={handleClose}
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

      <DialogContent sx={{width:1024, height:364}}>
        { currentTab == 0 && <ActivityMainForm /> }
        { currentTab == 1 && <ActivityAttachmentsPanel/> }
      </DialogContent>

      <DialogActions>
        <Box mr={2} mb={2} width='100%' textAlign='right'>
          { !_.isEmpty(serverError) && <Typography ml={2} color="red" sx={{float: 'left'}}>
            <Warning sx={{verticalAlign: 'middle'}} fontSize='small'/> {serverError}</Typography>
          }
          <Button onClick={handleSaveClick} color="primary" variant="outlined" disabled={!isFormValid}>save</Button>
          &nbsp;
          <Button onClick={handleDeleteClick} color="primary" variant="outlined" disabled={!showDeleteButton}>delete</Button>
          <ConfirmDialog
            title="Delete Activity"
            message="This activity record and its attachments will be removed. Are you sure to delete this activity?"
            isShown={isConfirmOpen}
            confirmCallback={deleteConfirm}
            cancelCallback={deleteCancel}
          />
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default ActivityMainDialog;

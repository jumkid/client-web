import React, { useContext, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs
} from '@mui/material';
import { Close } from '@mui/icons-material';
import ActivityMaintForm from './ActivityMaintForm';
import ConfirmDialog from '../../../../../component/ConfirmDialog';
import {
  deleteActivity,
  fetchVehicleActivities,
  resetCurrentActivity,
  saveNew,
  saveUpdate
} from '../../../../../store/vehicleActivitiesSlice';
import { initValidationErrors } from './ActivityMaintForm.Validator';
import { useAppDispatch, useAppSelector } from '../../../../../App.hooks';
import { RootState } from '../../../../../store';
import { ErrorsContext } from '../ActivityContext';
import ActivityAttachmentsPanel from '../ActivityAttachments/ActivityAttachmentsPanel';
import { contentService } from '../../../../../service';
import * as _ from 'lodash';
import WarningSignText from '../../../../../component/WarningSignText';
import './index.css';

interface Props {
  vehicleId: string
  showDialog:boolean
  setShowDialog:(showDialog:boolean) => void
}

function ActivityMaintDialog ({vehicleId, showDialog, setShowDialog}:Props) {
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
        <Tabs className="side-tabs" value={currentTab} onChange={handleTabChange}>
          <Tab label="Activity Details" />
          <Tab label="Attachments" />
        </Tabs>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          className="close-icon"
        >
          <Close/>
        </IconButton>
      </DialogTitle>

      <DialogContent className="activity-dialog-content">
        { currentTab == 0 && <ActivityMaintForm /> }
        { currentTab == 1 && <ActivityAttachmentsPanel/> }
      </DialogContent>

      <DialogActions className="activity-dialog-action">
        <>
          { !_.isEmpty(serverError) && <WarningSignText message={serverError} />}
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
        </>
      </DialogActions>
    </Dialog>
  )
}

export default ActivityMaintDialog;

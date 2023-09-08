import React, { useContext, useMemo, useState } from 'react';
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
  deleteActivity, fetchActivity,
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
import { setUserCenterWarning } from '../../../../../store/userNotificationsSlice';
import CenterWarningBar from '../../../../../component/CenterWarningBar';
import { APIResponse } from '../../../../../service/model/Response';
import { VehicleProfile } from '../../../../../store/model/VehicleProfile';

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
  const userCenterWarning = useAppSelector((state:RootState) => state.userNotifications.userCenterWarning);

  const dispatch = useAppDispatch();

  const handleTabChange = (event: React.SyntheticEvent, index: number) => {
    setCurrentTab(index);
  };

  const handleSave = async () => {
    const activity = { ...currentActivity, activityEntityLinks: currentActivity.activityEntityLinks || []}
    const action = currentActivity.id > 0 ? saveUpdate(activity) : saveNew(activity);

    try {
      const response = await dispatch(action);
      const apiResponse = response.payload as APIResponse<VehicleProfile>;

      if (apiResponse.status === 409) {
        dispatch(setUserCenterWarning(true));
        return;
      }

      setShowDialog(false);
      setErrors({hasUpdate: false});
      dispatch(fetchVehicleActivities(vehicleId));
    } catch (e:any) {
      setServerError(e.response.data);
    }

  }

  const handleDelete = () => {
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

  const reloadActivity = (id:number) => {
    dispatch(fetchActivity(id));
  }

  const showDeleteButton = useMemo(() => currentActivity.id > 0, [currentActivity]);
  const isFormValid = (Object.values(errors).length === 1 && errors.hasUpdate);

  return (
    <Dialog open={showDialog} maxWidth={false}>
      <DialogTitle>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Activity Details" />
          <Tab label="Attachments" />
        </Tabs>
        <IconButton aria-label="close" onClick={handleClose} className="close-icon">
          <Close/>
        </IconButton>
      </DialogTitle>

      <DialogContent className="activity-dialog-content">
        { currentTab == 0 && <ActivityMaintForm /> }
        { currentTab == 1 && <ActivityAttachmentsPanel/> }
      </DialogContent>

      <DialogActions className="activity-dialog-action">
        { !_.isEmpty(serverError) && <WarningSignText message={serverError} />}
        <Button onClick={handleSave} color="primary" variant="contained" disabled={!isFormValid}>save</Button>
        &nbsp;
        <Button onClick={handleDelete} color="primary" variant="contained" disabled={!showDeleteButton}>delete</Button>

        <ConfirmDialog
          title="Delete Activity"
          message="This activity record and its attachments will be removed. Are you sure to delete this activity?"
          isShown={isConfirmOpen}
          confirmCallback={deleteConfirm}
          cancelCallback={deleteCancel}
        />
        <CenterWarningBar
          open={userCenterWarning}
          message="Activity data is not up to date. Please reload before making changes."
          actionButton="RELOAD"
          actionButtonCallBack={async () => {
            await reloadActivity(currentActivity.id!);
            dispatch(setUserCenterWarning(false));
          }}
        />
      </DialogActions>
    </Dialog>
  )
}

export default ActivityMaintDialog;

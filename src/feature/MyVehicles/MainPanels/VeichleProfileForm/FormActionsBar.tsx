import React, { useCallback, useContext, useState } from 'react';
import { Button } from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';
import {
  deleteVehicle, fetchVehicle,
  saveNewVehicle, setCurrentVehicle,
  updateVehicle
} from '../../../../store/userVehiclesSlice';
import { ErrorsContext } from '../VehicleProfileContext';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { RootState } from '../../../../store';
import * as C from '../../../../App.constants';
import * as _ from 'lodash';
import ConfirmDialog from '../../../../component/ConfirmDialog';
import { setConnectedVehicle } from '../../../../store/connectedVehicleSlice';
import { fetchMatchVehicles } from '../../../../store/searchVehiclesSlice';
import { APIResponse } from '../../../../service/model/Response';
import { VehicleProfile } from '../../../../store/model/VehicleProfile';
import { setUserCenterWarning } from '../../../../store/userNotificationsSlice';
import { VehicleConnectorContext } from '../../../VehicleResearch/VehicleConnector/VehicleConnectorContext';
import CenterWarningBar from '../../../../component/CenterWarningBar';

function FormActionsBar () {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddConfirm, setShowAddConfirm] = useState(false);

  const currentVehicle = useAppSelector((state:RootState) => state.userVehicles.currentVehicle);
  const connectedVehicle = useAppSelector((state:RootState) => state.connectedVehicle.vehicle);
  const matchFields = useAppSelector((state:RootState) => state.searchVehicles.matchFields);
  const status = useAppSelector((state:RootState) => state.userVehicles.status);
  const userCenterWarning = useAppSelector((state:RootState) => state.userNotifications.userCenterWarning);

  const {connectorStep, setConnectorStep} = useContext(VehicleConnectorContext);
  const {errors, setErrors} = useContext(ErrorsContext);

  const dispatch = useAppDispatch();

  const handleSave = useCallback(async () => {
    if (status === C.LOADING || _.isNil(currentVehicle)) { return; }

    const isUpdated = !_.isNil(currentVehicle.id);
    const response = isUpdated ?
      await dispatch(updateVehicle({id: currentVehicle.id!, vehicle: currentVehicle}))
      :
      await dispatch(saveNewVehicle(currentVehicle));

    const apiResponse = response.payload as APIResponse<VehicleProfile>;

    if (apiResponse.status === 409) {
      dispatch(setUserCenterWarning(true));
      return;
    }

    setErrors({hasUpdate: false});

    if (isUpdated) {
      const updatedVehicle = apiResponse.data;
      dispatch(setCurrentVehicle(updatedVehicle));
      setErrors({hasUpdate: false});

      if (connectedVehicle && connectedVehicle!.id === updatedVehicle!.id) {
        dispatch(setConnectedVehicle(updatedVehicle));
        dispatch(fetchMatchVehicles({page: 1, size: C.DEFAULT_PAGE_SIZE, data: matchFields}));
      }
    }



  },[currentVehicle]);

  const confirmDelete = ():void => {
    if (status === C.LOADING || _.isNil(currentVehicle)) {
      return;
    }

    if (!_.isNil(currentVehicle.id)) {
      setShowDeleteConfirm(true);
    }
  }

  const doDelete = async (): Promise<void> => {
    if (status === C.LOADING || _.isNil(currentVehicle)) {
      return;
    }

    setShowDeleteConfirm(false);

    const response = await dispatch(deleteVehicle(currentVehicle.id!));

    if (response.type.endsWith('/fulfilled')) {
      if (connectorStep > 0) {
        //go back to first step after delete successfully
        setTimeout(() => setConnectorStep(0), 500);
      }
    }
  };

  const confirmAdd = ():void => {
    if (status === C.LOADING || _.isNil(currentVehicle)) { return; }
    setShowAddConfirm(true);
  }

  const doAdd = async (): Promise<void> => {
    if (status === C.LOADING || _.isNil(currentVehicle)) { return; }

    try {
      await dispatch(saveNewVehicle({...currentVehicle, id: null}));
      setErrors({hasUpdate: false});
      setShowAddConfirm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const isFormValid = Object.values(errors).length === 1 && errors.hasUpdate;

  const reloadCurrentVehicle = (id: string) => {
    dispatch(fetchVehicle(id));
  }

  return (
    <>
      <Button
        onClick={handleSave}
        color="primary"
        variant="contained"
        disabled={currentVehicle!.id === null || !isFormValid}
        startIcon={<Save/>}
      >
        save
      </Button>
      <Button
        onClick={confirmDelete}
        color="primary"
        variant="contained"
        disabled={currentVehicle!.id === null}
        startIcon={<Delete/>}
      >
        delete
      </Button>
      <Button
        variant="contained"
        onClick={confirmAdd}
        disabled={!isFormValid}
        startIcon={<Add/>}
      >
        add
      </Button>

      <ConfirmDialog
        title="Delete Vehicle"
        message="All related data will be removed. Are you sure to delete this vehicle?"
        isShown={showDeleteConfirm}
        confirmCallback={doDelete}
        cancelCallback={ ():void => setShowDeleteConfirm(false) }
      />

      <ConfirmDialog
        title="Add Vehicle"
        message="Are you sure to add this vehicle as new one?"
        isShown={showAddConfirm}
        confirmCallback={doAdd}
        cancelCallback={ ():void => setShowAddConfirm(false) }
      />

      <CenterWarningBar
        open={userCenterWarning}
        message="Vehicle profile is not up to date. Please reload before making changes."
        actionButton="RELOAD"
        actionButtonCallBack={async () => {
          await reloadCurrentVehicle(currentVehicle.id!);
          dispatch(setUserCenterWarning(false));
        }}
      />
    </>
  )
}

export default FormActionsBar;
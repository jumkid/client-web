import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';
import {
  changePick,
  deleteVehicle, fetchVehicle, removeVehicleFromList,
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
import {
  clearMatchFields,
  fetchMatchVehicles,
  setMatchVehicles,
  setStatus
} from '../../../../store/searchVehiclesSlice';
import { APIResponse } from '../../../../service/model/Response';
import { VehicleProfile } from '../../../../store/model/VehicleProfile';
import { setUserCenterWarning } from '../../../../store/userNotificationsSlice';
import { VehicleConnectorContext } from '../../../VehicleResearch/VehicleConnector/VehicleConnectorContext';
import CenterWarningBar from '../../../../component/CenterWarningBar';

function FormActionsBar () {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const currentPick = useAppSelector((state: RootState) => state.userVehicles.currentPick);
  const currentVehicle = useAppSelector((state:RootState) => state.userVehicles.currentVehicle);
  const matchFields = useAppSelector((state:RootState) => state.searchVehicles.matchFields);
  const status = useAppSelector((state:RootState) => state.userVehicles.status);
  const userCenterWarning = useAppSelector((state:RootState) => state.userNotifications.userCenterWarning);

  const {setConnectorStep} = useContext(VehicleConnectorContext);
  const {errors, setErrors} = useContext(ErrorsContext);

  const dispatch = useAppDispatch();

  const handleAddAsNew = async (): Promise<void> => {
    if (status === C.LOADING || _.isNil(currentVehicle)) { return; }

    try {
      await dispatch(saveNewVehicle({...currentVehicle, id: null}));
      dispatch(clearMatchFields());
      dispatch(setMatchVehicles([]));
      //go back to first step after add successfully
      setConnectorStep(0);
    } catch (error) {
      console.error(error)
    }
  };

  const handleSave = useCallback(async () => {
    if (status === C.LOADING || _.isNil(currentVehicle)) {
      return;
    }

    if (!_.isNil(currentVehicle.id)) {
      const response = await dispatch(updateVehicle({id: currentVehicle.id, vehicle: currentVehicle}));
      const apiResponse = response.payload as APIResponse<VehicleProfile>;

      if (apiResponse.status === 409) {
        dispatch(setUserCenterWarning(true));
        return;
      }

      const updatedVehicle = apiResponse.data;

      dispatch(setCurrentVehicle(updatedVehicle));
      setErrors({hasUpdate: false});

      if (currentPick === 0) {
        dispatch(setConnectedVehicle(updatedVehicle));
        dispatch(fetchMatchVehicles({page: 1, size: C.DEFAULT_PAGE_SIZE, data: matchFields}));
      }
    } else {
      dispatch(saveNewVehicle(currentVehicle))
        .then(() => {
          setErrors({hasUpdate: false});
        });
    }
  },[currentVehicle]);

  const confirmDelete = ():void => {
    if (status === C.LOADING || _.isNil(currentVehicle)) {
      return;
    }

    if (!_.isNil(currentVehicle.id)) {
      setIsConfirmOpen(true);
    }
  }

  const dialogConfirm = async (): Promise<void> => {
    if (status === C.LOADING || _.isNil(currentVehicle)) {
      return;
    }

    const response = await dispatch(deleteVehicle(currentVehicle.id!));

    if (response.type.endsWith('/fulfilled')) {
      setIsConfirmOpen(false);

      if (currentPick === 0) {
        dispatch(setStatus(C.LOADING));
        dispatch(setMatchVehicles([]));
        //go back to first step after delete successfully
        setConnectorStep(0);
        // delay for a second for search index update on the backend
        await new Promise((resolve) => setTimeout(resolve, 1000));
        dispatch(fetchMatchVehicles({ page: 1, size: C.DEFAULT_PAGE_SIZE, data: matchFields }));
      } else {
        const index = currentPick - 1;
        dispatch(removeVehicleFromList(index));
        dispatch(changePick(1));
      }
    }
  };

  const dialogCancel = ():void => {
    setIsConfirmOpen(false);
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
        onClick={handleAddAsNew}
        disabled={!isFormValid}
        startIcon={<Add/>}
      >
        add
      </Button>

      <ConfirmDialog
        title="Delete Vehicle"
        message="All related data will be removed. Are you sure to delete this vehicle?"
        isShown={isConfirmOpen}
        confirmCallback={dialogConfirm}
        cancelCallback={dialogCancel}
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
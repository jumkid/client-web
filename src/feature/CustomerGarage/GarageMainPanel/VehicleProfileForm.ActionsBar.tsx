import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';
import {
  changePick,
  deleteVehicle, removeVehicleFromList,
  saveNewVehicle, setCurrentVehicle,
  syncCurrentVehicleToList,
  updateVehicle
} from '../../../store/userVehiclesSlice';
import { ErrorsContext } from './VehicleProfileContext';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { RootState } from '../../../store';
import * as C from '../../../App.constants';
import * as _ from 'lodash';
import ConfirmDialog from '../../../component/ConfirmDialog';
import { setConnectedVehicle, setConnectorStep } from '../../../store/connectedVehicleSlice';
import { fetchMatchVehicles, setMatchVehicles, setStatus } from '../../../store/searchVehiclesSlice';
import { APIResponse } from '../../../service/model/Response';
import { VehicleProfile } from '../../../store/model/VehicleProfile';

function VehicleFormActionsBar () {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const {errors, setErrors} = useContext(ErrorsContext);

  const currentPick = useAppSelector((state: RootState) => state.userVehicles.currentPick);
  const currentVehicle = useAppSelector((state:RootState) => state.userVehicles.currentVehicle);
  const matchFields = useAppSelector((state:RootState) => state.searchVehicles.matchFields);
  const status = useAppSelector((state:RootState) => state.userVehicles.currentVehicleStatus);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setErrors({hasUpdate: false});
  }, []);

  const handleAdd = async (): Promise<void> => {
    if (status === C.LOADING || _.isNil(currentVehicle)) { return; }

    try {
      await dispatch(saveNewVehicle({...currentVehicle, id: null}));
      dispatch(setConnectorStep(0));
    } catch (error) {
      console.error(error)
    }
  };

  const handleSave = ():void => {
    if (status === C.LOADING || _.isNil(currentVehicle)) return;

    if (!_.isNil(currentVehicle.id)) {
      dispatch(updateVehicle({id:currentVehicle.id!, vehicle:currentVehicle}))
        .then((response) => {
          const apiResponse = response.payload as APIResponse<VehicleProfile>;
          const updatedVehicle = apiResponse.data;

          dispatch(setCurrentVehicle(updatedVehicle));
          dispatch(syncCurrentVehicleToList());
          setErrors({hasUpdate:false});

          if (currentPick === 0) {
            dispatch(setConnectedVehicle(updatedVehicle));
            dispatch(fetchMatchVehicles({ page: 1, size: C.DEFAULT_PAGE_SIZE, data: matchFields }));
          }
        });
    } else {
      dispatch(saveNewVehicle(currentVehicle))
        .then(() => {
          setErrors({hasUpdate:false});
        });
    }
  }

  const confirmDelete = ():void => {
    if (status === C.LOADING || _.isNil(currentVehicle)) return;

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
        dispatch(setConnectorStep(0));
        // delay for a second for search index update on the backend
        await new Promise((resolve) => setTimeout(resolve, 1000));
        dispatch(fetchMatchVehicles({ page: 1, size: C.DEFAULT_PAGE_SIZE, data: matchFields }));
      } else {
        const index = currentPick - 2;
        dispatch(removeVehicleFromList(index));
        dispatch(changePick(1));
      }
    }
  };

  const dialogCancel = ():void => {
    setIsConfirmOpen(false);
  };

  const isFormValid = (Object.values(errors).length === 1 && errors.hasUpdate);

  return (
    <>
      <Button
        sx={{ mr:1, fontSize:'large' }}
        onClick={handleSave}
        color="primary"
        variant="outlined"
        disabled={!isFormValid}
        startIcon={<Save/>}
      >
        save
      </Button>
      <Button
        sx={{ mr:1, fontSize:'large' }}
        onClick={confirmDelete}
        color="primary"
        variant="outlined"
        startIcon={<Delete/>}
      >
        delete
      </Button>
      <Button
        sx={{ fontSize: 'large' }}
        variant="outlined"
        onClick={handleAdd}
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
    </>
  )
}

export default VehicleFormActionsBar;
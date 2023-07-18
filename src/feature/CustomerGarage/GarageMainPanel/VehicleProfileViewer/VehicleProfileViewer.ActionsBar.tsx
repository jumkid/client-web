import React from 'react';
import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { RootState } from '../../../../store';
import * as _ from 'lodash';
import * as C from '../../../../App.constants';
import { saveNewVehicle } from '../../../../store/userVehiclesSlice';
import { setConnectorStep } from '../../../../store/connectedVehicleSlice';

function VehicleViewerActionsBar () {
  const connectedVehicle = useAppSelector((state:RootState) => state.connectedVehicle.vehicle);
  const status = useAppSelector((state:RootState) => state.userVehicles.currentVehicleStatus);
  const dispatch = useAppDispatch();

  const isValid = !_.isNil(connectedVehicle) && !_.isNil(connectedVehicle.name) && connectedVehicle.name.length > 1;

  const handleAdd = async (): Promise<void> => {
    if (status === C.LOADING || _.isNil(connectedVehicle)) { return; }

    try {
      await dispatch(saveNewVehicle({...connectedVehicle, id: null}));
      dispatch(setConnectorStep(0));
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <>
      <Button sx={{ fontSize: 'large' }} variant="outlined" onClick={handleAdd} disabled={!isValid}>
        <Add/>add
      </Button>
    </>
  )
}

export default VehicleViewerActionsBar;
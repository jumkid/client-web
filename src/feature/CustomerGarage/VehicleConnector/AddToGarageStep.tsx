import React, { useMemo, useState } from 'react';
import authenticationManager from '../../../security/Auth/AuthenticationManager';
import AddToGarageStepUserView from './AddToGarageStep.UserView';
import { Box, Button, CircularProgress } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import { setConnectorStep } from '../../../store/connectedVehicleSlice';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { RootState } from '../../../store';
import * as C from '../../../App.constants';
import AddToGarageStepAdminView from './AddToGarageStep.AdminView';
import VehicleFormActionsBar from '../GarageMainPanel/VeichleProfileForm/VehicleProfileForm.ActionsBar';
import { ErrorsContext } from '../GarageMainPanel/VehicleProfileContext';
import { initValidationErrors } from '../GarageMainPanel/VeichleProfileForm/VehicleProfileForm.Validator';
import VehicleViewerActionsBar from '../GarageMainPanel/VehicleProfileViewer/VehicleProfileViewer.ActionsBar';

function AddToGarageStep () {
  const [errors, setErrors] = useState(initValidationErrors);
  const errorsProvider = useMemo(() => ({errors, setErrors}), [errors, setErrors]);

  const currentStep = useAppSelector((state:RootState) => state.connectedVehicle.connectorStep);
  const status = useAppSelector((state:RootState) => state.userVehicles.currentVehicleStatus);

  const dispatch = useAppDispatch();

  const isAdmin: boolean = useMemo(() => authenticationManager.isAdmin(), []);

  const handleBackward = (): void => {
    dispatch(setConnectorStep(currentStep - 1));
  };

  return (
    <ErrorsContext.Provider value={errorsProvider}>
      { status === C.LOADING && <CircularProgress size="1.5rem" sx={{ position: "absolute", mt: 2, ml: 20 }}/> }
      <Box mx={3} py={1}>
        <Button sx={{ fontSize: 'large', mr: 1 }} variant="outlined" onClick={handleBackward}>
          <ArrowBackIos/>back
        </Button>
        { isAdmin ? <VehicleFormActionsBar /> : <VehicleViewerActionsBar /> }
      </Box>
      { isAdmin ? <AddToGarageStepAdminView /> : <AddToGarageStepUserView /> }
    </ErrorsContext.Provider>
  )
}

export default AddToGarageStep;

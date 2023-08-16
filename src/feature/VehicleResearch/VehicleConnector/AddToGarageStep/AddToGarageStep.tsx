import React, { useMemo, useState } from 'react';
import AddToGarageStepUserView from './AddToGarageStep.UserView';
import { Box, Button, CircularProgress } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import { setConnectorStep } from '../../../../store/connectedVehicleSlice';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { RootState } from '../../../../store';
import * as C from '../../../../App.constants';
import AddToGarageStepAdminView from './AddToGarageStep.AdminView';
import FormActionsBar from '../../../MyVehicles/MainPanels/VeichleProfileForm/FormActionsBar';
import { ErrorsContext } from '../../../MyVehicles/MainPanels/VehicleProfileContext';
import VehicleViewerActionsBar from '../../../MyVehicles/MainPanels/VehicleProfileViewer/ViewerActionsBar';
import AdminUser from '../../../../security/Auth/AdminUser';
import NoneAdminUser from '../../../../security/Auth/NoneAdminUser';

function AddToGarageStep () {
  const [errors, setErrors] = useState({hasUpdate: false});
  const errorsProvider = useMemo(() => ({errors, setErrors}), [errors, setErrors]);

  const currentStep = useAppSelector((state:RootState) => state.connectedVehicle.connectorStep);
  const dispatch = useAppDispatch();

  const handleBackward = (): void => {
    dispatch(setConnectorStep(currentStep - 1));
  };

  return (
    <ErrorsContext.Provider value={errorsProvider}>
      <Box className="tool-bar-container">
        <Button variant="outlined" onClick={handleBackward}>
          <ArrowBackIos/>back
        </Button>

        <AdminUser><FormActionsBar /></AdminUser>
        <NoneAdminUser><VehicleViewerActionsBar /></NoneAdminUser>
      </Box>

      <AdminUser><AddToGarageStepAdminView /></AdminUser>
      <NoneAdminUser><AddToGarageStepUserView /></NoneAdminUser>

    </ErrorsContext.Provider>
  )
}

export default AddToGarageStep;

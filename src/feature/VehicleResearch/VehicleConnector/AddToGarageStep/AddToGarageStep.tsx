import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import AddToGarageStepUserView from './AddToGarageStep.UserView';
import { Box, Button } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import AddToGarageStepAdminView from './AddToGarageStep.AdminView';
import FormActionsBar from '../../../MyVehicles/MainPanels/VeichleProfileForm/FormActionsBar';
import { ErrorsContext } from '../../../MyVehicles/MainPanels/VehicleProfileContext';
import VehicleViewerActionsBar from '../../../MyVehicles/MainPanels/VehicleProfileViewer/ViewerActionsBar';
import AdminUser from '../../../../security/Auth/AdminUser';
import NoneAdminUser from '../../../../security/Auth/NoneAdminUser';
import { VehicleConnectorContext } from '../VehicleConnectorContext';
import {
  initValidationErrors,
  ValidationErrors
} from '../../../MyVehicles/MainPanels/VeichleProfileForm/VehicleFormValidator';

function AddToGarageStep () {
  const [errors, setErrors] = useState<ValidationErrors>({hasUpdate:false});
  const errorsProvider = useMemo(() => ({errors, setErrors}), [errors, setErrors]);

  const { setConnectorStep } = useContext(VehicleConnectorContext);

  const handleBackward = (): void => {
    setConnectorStep(prevState => prevState - 1);
  };

  return (
    <ErrorsContext.Provider value={errorsProvider}>
      <Box className="tool-bar-container">
        <Button variant="contained" onClick={handleBackward}>
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

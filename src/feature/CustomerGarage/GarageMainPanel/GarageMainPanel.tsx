import React, { useEffect, useMemo, useState } from 'react';
import VehicleProfileViewer from './VehicleProfileViewer';
import VehicleListViewer from './VehicleListViewer';
import { RootState } from '../../../store';
import { useAppSelector } from '../../../App.hooks';
import VehicleConnector from '../VehicleConnector';
import authenticationManager from '../../../security/Auth/AuthenticationManager';
import VehicleProfileForm from './VehicleProfileForm';
import { ErrorsContext } from './VehicleProfileContext';
import { initValidationErrors } from './VehicleProfileForm.Validator';
import VehicleFormActionsBar from './VehicleProfileForm.ActionsBar';
import { Box } from '@mui/material';
import * as C from '../../../App.constants';

function GarageMainPanel () {
  const currentPick = useAppSelector((state: RootState) => state.userVehicles.currentPick);
  const currentVehicle = useAppSelector((state: RootState) => state.userVehicles.currentVehicle);

  const [errors, setErrors] = useState(initValidationErrors);
  const errorsProvider = useMemo(() => ({errors, setErrors}), [errors, setErrors]);

  const isAdmin: boolean = useMemo(() => authenticationManager.isAdmin(), []);

  useEffect(() => {
    setErrors({hasUpdate: false});
  }, [currentPick]);

  return (
    <>
      {currentPick === 0 && <VehicleConnector/>}

      {currentPick === 1 && <VehicleListViewer/>}

      {currentPick > 1 && currentVehicle &&
      <>
        {isAdmin &&
        <ErrorsContext.Provider value={errorsProvider}>
          <Box mx={2} mt={2} mb={1}>
            <VehicleFormActionsBar />
          </Box>
          <VehicleProfileForm />
        </ErrorsContext.Provider>}
        { !isAdmin && <VehicleProfileViewer vehicleProfile={currentVehicle} mode={C.MODE_ACTIVE}/> }
      </>
      }
    </>
  );
}

export default GarageMainPanel;

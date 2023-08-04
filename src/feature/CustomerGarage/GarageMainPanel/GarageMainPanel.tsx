import React, { useEffect, useMemo, useState } from 'react';
import VehicleProfileViewer from './VehicleProfileViewer/VehicleProfileViewer';
import VehicleListViewer from './VehicleListViewer';
import { RootState } from '../../../store';
import { useAppSelector } from '../../../App.hooks';
import VehicleConnector from '../VehicleConnector';
import VehicleProfileForm from './VeichleProfileForm/VehicleProfileForm';
import { ErrorsContext } from './VehicleProfileContext';
import { initValidationErrors } from './VeichleProfileForm/VehicleProfileForm.Validator';
import VehicleFormActionsBar from './VeichleProfileForm/VehicleProfileForm.ActionsBar';
import { Box } from '@mui/material';
import * as C from '../../../App.constants';
import * as _ from 'lodash';
import AdminUser from '../../../security/Auth/AdminUser';
import NoneAdminUser from '../../../security/Auth/NoneAdminUser';

function GarageMainPanel () {
  const currentPick = useAppSelector((state: RootState) => state.userVehicles.currentPick);
  const currentVehicle = useAppSelector((state: RootState) => state.userVehicles.currentVehicle);

  const [errors, setErrors] = useState(initValidationErrors);
  const errorsProvider = useMemo(() => ({errors, setErrors}), [errors, setErrors]);

  useEffect(() => {
    setErrors({hasUpdate: false});
  }, [currentPick]);

  return (
    <>
      {currentPick === 0 && <VehicleConnector/>}

      {currentPick === 1 && <VehicleListViewer/>}

      {currentPick > 1 && !_.isNil(currentVehicle) &&
      <>
        <AdminUser>
          <ErrorsContext.Provider value={errorsProvider}>
            <Box mx={2} mt={2} mb={1}>
              <VehicleFormActionsBar />
            </Box>
            <VehicleProfileForm />
          </ErrorsContext.Provider>
        </AdminUser>
        <NoneAdminUser>
          <VehicleProfileViewer vehicleProfile={currentVehicle} mode={C.MODE_ACTIVE}/>
        </NoneAdminUser>
      </>
      }
    </>
  );
}

export default GarageMainPanel;

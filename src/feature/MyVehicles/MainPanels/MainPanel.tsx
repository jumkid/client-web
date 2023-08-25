import React, { useEffect, useMemo, useState } from 'react';
import VehicleProfileViewer from './VehicleProfileViewer/VehicleProfileViewer';
import VehicleListViewer from './VehicleListViewer';
import { RootState } from '../../../store';
import { useAppSelector } from '../../../App.hooks';
import VehicleProfileForm from './VeichleProfileForm/VehicleProfileForm';
import { ErrorsContext } from './VehicleProfileContext';
import { initValidationErrors } from './VeichleProfileForm/VehicleFormValidator';
import FormActionsBar from './VeichleProfileForm/FormActionsBar';
import * as C from '../../../App.constants';
import * as _ from 'lodash';
import AdminUser from '../../../security/Auth/AdminUser';
import NoneAdminUser from '../../../security/Auth/NoneAdminUser';
import { Box } from '@mui/material';

function MainPanel () {
  const currentPick = useAppSelector((state: RootState) => state.userVehicles.currentPick);
  const currentVehicle = useAppSelector((state: RootState) => state.userVehicles.currentVehicle);

  const [errors, setErrors] = useState(initValidationErrors);
  const errorsProvider = useMemo(() => ({errors, setErrors}), [errors, setErrors]);

  useEffect(() => {
    setErrors({hasUpdate: false});
  }, [currentPick]);

  return (
    <>
      {currentPick === 0 && <VehicleListViewer/>}

      {currentPick > 0 && !_.isNil(currentVehicle) &&
      <>
        <AdminUser>
          <ErrorsContext.Provider value={errorsProvider}>
            <Box className="tool-bar-container"><FormActionsBar /></Box>
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

export default MainPanel;

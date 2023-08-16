import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import VehicleProfileForm from '../../../MyVehicles/MainPanels/VeichleProfileForm';
import { setConnectorStep } from '../../../../store/connectedVehicleSlice';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import FormActionsBar from '../../../MyVehicles/MainPanels/VeichleProfileForm/FormActionsBar';
import * as _ from 'lodash';
import { RootState } from '../../../../store';
import { ErrorsContext } from '../../../MyVehicles/MainPanels/VehicleProfileContext';
import { initValidationErrors } from '../../../MyVehicles/MainPanels/VeichleProfileForm/VehicleFormValidator';

function ManageProfileStep () {
  const currentVehicle = useAppSelector((state:RootState) => state.userVehicles.currentVehicle);
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState(initValidationErrors);
  const errorsProvider = useMemo(() => ({errors, setErrors}), [errors, setErrors]);

  useEffect(() => {
    setErrors({hasUpdate: false});
  }, []);

  const handleBackward = (): void => {
    dispatch(setConnectorStep(1));
  };

  return (
    <ErrorsContext.Provider value={errorsProvider}>
      <Box className="tool-bar-container">
        <Button variant="outlined" onClick={handleBackward}>
          <ArrowBackIos/>Back
        </Button>
        <FormActionsBar />
      </Box>

      {!_.isNil(currentVehicle.id) && <VehicleProfileForm/>}
    </ErrorsContext.Provider>
  )
}

export default ManageProfileStep;
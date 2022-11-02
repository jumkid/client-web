import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import VehicleProfileViewer from '../GarageMainPanel/VehicleProfileViewer';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAppDispatch } from '../../../App.hooks';
import { setConnectorStep } from '../../../store/connectedVehicleSlice';

interface Prop {
  connectedVehicle: VehicleProfile
}

function PreviewVehicleStep ({connectedVehicle}:Prop) {
  const currentStep = useSelector((state:RootState) => state.connectedVehicle.connectorStep);
  const dispatch = useAppDispatch();

  const handleBackward = () => {
    dispatch(setConnectorStep(currentStep - 1));
  };

  const handleForward = () => {
    dispatch(setConnectorStep(currentStep + 1));
  };

  return (
    <>
      <Box mx={3} pt={2}>
        <Button sx={{ fontSize: 'large', mr: 1 }} variant="outlined" onClick={handleBackward}>
          <ArrowBackIos/>Back
        </Button>
        <Button sx={{ fontSize: 'large' }} variant="outlined" onClick={handleForward}>
          Next<ArrowForwardIos/>
        </Button>
      </Box>
      <VehicleProfileViewer showName={false} vehicleProfile={connectedVehicle} />
    </>
  )
}

export default PreviewVehicleStep;
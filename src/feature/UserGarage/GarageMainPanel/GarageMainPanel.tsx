import React from 'react';
import VehicleProfileViewer from './VehicleProfileViewer';
import VehicleListViewer from './VehicleListViewer';
import { RootState } from '../../../store';
import { useAppSelector } from '../../../App.hooks';
import VehicleConnector from '../VehicleConnector';
import { Box } from '@mui/material';

function GarageMainPanel () {
  const currentPick = useAppSelector((state:RootState) => state.userVehicles.currentPick);
  const currentVehicle = useAppSelector((state:RootState) => state.userVehicles.currentVehicle);

  return (
    <>
      { currentPick === 0 && <VehicleConnector/> }

      { currentPick === 1 && <VehicleListViewer /> }

      { currentPick > 1 && currentVehicle &&
      <Box mt={3}>
        <VehicleProfileViewer vehicleProfile={currentVehicle} />
      </Box>
      }
    </>
  );
}

export default GarageMainPanel;

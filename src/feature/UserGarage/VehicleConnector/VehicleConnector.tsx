import React from 'react';
import { Box } from '@mui/material';
import VehicleConnectStepper from './VehicleConnectStepper';
import VehicleFinderStep from './VehicleFinderStep';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import PreviewVehicleStep from './PreviewVehicleStep';
import AddToGarageStep from './AddToGarageStep';

const steps = ['Find a Vehicle', 'Preview Vehicle', 'Add to Garage'];

function VehicleConnector () {
  const connectedVehicle = useSelector((state:RootState) => state.connectedVehicle.vehicle);
  const currentStep = useSelector((state:RootState) => state.connectedVehicle.connectorStep);

  const getStepComponents = (currentStep:number) => {
    switch (currentStep) {
    case 1:
      return <PreviewVehicleStep connectedVehicle={connectedVehicle!}/>
    case 2:
      return <AddToGarageStep connectedVehicle={connectedVehicle!}/>
    default:
      return <VehicleFinderStep/>;
    }
  };

  return (
    <>
      <VehicleConnectStepper currentStep={currentStep} steps={steps}/>
      { getStepComponents(currentStep) }
    </>
  )
}

export default VehicleConnector;

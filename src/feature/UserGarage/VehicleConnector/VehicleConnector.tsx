import React, { useState } from 'react';
import VehicleConnectStepper from './VehicleConnectStepper';
import VehicleFinderStep from './VehicleFinderStep';
import { RootState } from '../../../store';
import PreviewVehicleStep from './PreviewVehicleStep';
import AddToGarageStep from './AddToGarageStep';
import { useAppSelector } from '../../../App.hooks';

const steps = ['Find a Vehicle', 'Preview Vehicle', 'Add to Garage'];

function VehicleConnector () {
  const [currentTab, setCurrentTab] = useState(0);
  const connectedVehicle =useAppSelector((state:RootState) => state.connectedVehicle.vehicle);
  const currentStep = useAppSelector((state:RootState) => state.connectedVehicle.connectorStep);

  const handleTabChange = (event: React.SyntheticEvent, index: number) => {
    setCurrentTab(index);
  };

  const getStepComponents = (currentStep:number) => {
    switch (currentStep) {
    case 1:
      return <PreviewVehicleStep connectedVehicle={connectedVehicle!}/>
    case 2:
      return <AddToGarageStep connectedVehicle={connectedVehicle!}/>
    default:
      return <VehicleFinderStep currentTab={currentTab} handleTabChange={handleTabChange}/>;
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

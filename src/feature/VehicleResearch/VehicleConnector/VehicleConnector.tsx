import React, { useMemo, useState } from 'react';
import VehicleConnectStepper from './VehicleConnectStepper';
import { RootState } from '../../../store';
import PreviewVehicleStep from './PreviewVehicleStep';
import AddToGarageStep from './AddToGarageStep';
import { useAppSelector } from '../../../App.hooks';
import VehicleFinderStep from './VehicleFinderStep';
import { VehicleConnectorContext } from './VehicleConnectorContext';

const steps = ['Find a Vehicle', 'Preview Vehicle', 'Add to Vehicles'];

function VehicleConnector () {
  const [currentTab, setCurrentTab] = useState(0);
  const connectedVehicle =useAppSelector((state:RootState) => state.connectedVehicle.vehicle);

  const [connectorStep, setConnectorStep] = useState(0);
  const contextProvider = useMemo(() => ({connectorStep, setConnectorStep}), [connectorStep,setConnectorStep]);

  const handleTabChange = (event: React.SyntheticEvent, index: number): void => {
    setCurrentTab(index);
  };

  const getStepComponents = (currentStep:number): JSX.Element => {
    switch (currentStep) {
    case 1:
      return <PreviewVehicleStep connectedVehicle={connectedVehicle!}/>
    case 2:
      return <AddToGarageStep/>
    default:
      return <VehicleFinderStep currentTab={currentTab} handleTabChange={handleTabChange}/>;
    }
  };

  return (
    <VehicleConnectorContext.Provider value={contextProvider}>
      <VehicleConnectStepper currentStep={connectorStep} steps={steps}/>
      { getStepComponents(connectorStep) }
    </VehicleConnectorContext.Provider>
  )
}

export default VehicleConnector;

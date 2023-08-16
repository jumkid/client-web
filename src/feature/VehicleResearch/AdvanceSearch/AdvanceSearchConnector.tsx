import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../App.hooks';
import { RootState } from '../../../store';
import PreviewVehicleStep from '../VehicleConnector/PreviewVehicleStep';
import AddToGarageStep from '../VehicleConnector/AddToGarageStep';
import VehicleFinderStep from '../VehicleConnector/VehicleFinderStep';
import AdvanceSearchPanel from './AdvanceSearchPanel';
import VehicleProfileForm from '../../MyVehicles/MainPanels/VeichleProfileForm';
import VehicleConnectStepper from '../VehicleConnector/VehicleConnectStepper';
import ManageProfileStep from './ManageProfileStep';

const steps = ['Find Vehicles', 'Manage Profile'];

function AdvanceSearchConnector () {
  const currentStep = useAppSelector((state:RootState) => state.connectedVehicle.connectorStep);

  const getStepComponents = (currentStep:number): JSX.Element => {
    switch (currentStep) {
    case 1:
      return <AdvanceSearchPanel/>
    case 2:
      return <ManageProfileStep/>
    default:
      return <AdvanceSearchPanel/>;
    }
  };

  return (
    <>
      <VehicleConnectStepper currentStep={currentStep} steps={steps}/>
      { getStepComponents(currentStep) }
    </>
  )
}

export default AdvanceSearchConnector;
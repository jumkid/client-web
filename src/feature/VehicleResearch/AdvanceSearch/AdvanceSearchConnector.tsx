import React, { useMemo, useState } from 'react';
import AdvanceSearchPanel from './AdvanceSearchStep/AdvanceSearchPanel';
import VehicleConnectStepper from '../VehicleConnector/VehicleConnectStepper';
import ManageProfilePanel from './ManageProfileStep';
import { AdvanceSearchContext } from './AdvanceSearchContext';

const steps = ['Find Vehicles', 'Manage Profile'];

function AdvanceSearchConnector () {
  const [searchStep, setSearchStep] = useState(0);
  const searchContextProvider = useMemo(() => ({searchStep,setSearchStep}), [searchStep, setSearchStep]);

  const getStepComponents = (currentStep:number): JSX.Element => {
    switch (currentStep) {
    case 1:
      return <AdvanceSearchPanel/>
    case 2:
      return <ManageProfilePanel/>
    default:
      return <AdvanceSearchPanel/>;
    }
  };

  return (
    <AdvanceSearchContext.Provider value={searchContextProvider}>
      <VehicleConnectStepper currentStep={searchStep} steps={steps}/>
      { getStepComponents(searchStep) }
    </AdvanceSearchContext.Provider>
  )
}

export default AdvanceSearchConnector;
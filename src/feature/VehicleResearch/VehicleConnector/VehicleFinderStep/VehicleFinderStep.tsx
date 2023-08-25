import React from 'react';
import { Tab, Tabs } from '@mui/material';
import FastMatchPanel from './FastMatch';
import VinMatchPanel from './VinMatch';

interface Prop {
  currentTab: number
  handleTabChange: (event: React.SyntheticEvent, index: number) => void
}

function VehicleFinderStep ({currentTab, handleTabChange}:Prop) {
  return (
    <>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        className="main-tabs"
      >
        <Tab label="Fast Match" />
        <Tab label="Find by VIN" />
      </Tabs>
      { currentTab == 0 && <FastMatchPanel/> }
      { currentTab == 1 && <VinMatchPanel/> }
    </>
  )
}

export default VehicleFinderStep;

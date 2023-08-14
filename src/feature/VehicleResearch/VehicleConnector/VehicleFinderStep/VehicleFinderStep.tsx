import React from 'react';
import { Tab, Tabs } from '@mui/material';
import FastMatchPanel from './FastMatchPanel';
import AdvanceSearchPanel from './AdvanceSearchPanel';
import VinMatchPanel from './VinMatchPanel';

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
        className="tab_fullwidth"
      >
        <Tab label="Fast Match" />
        <Tab label="Find by VIN" />
        <Tab label="Advance Search" />
      </Tabs>
      { currentTab == 0 && <FastMatchPanel/> }
      { currentTab == 1 && <VinMatchPanel/> }
      { currentTab == 2 && <AdvanceSearchPanel/> }
    </>
  )
}

export default VehicleFinderStep;

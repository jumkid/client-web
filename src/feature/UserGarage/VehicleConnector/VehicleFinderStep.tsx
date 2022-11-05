import React from 'react';
import { Tab, Tabs } from '@mui/material';
import FastMatchPanel from './FastMatchPanel';
import AdvanceSearchPanel from './AdvanceSearchPanel';

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
        sx={{ borderColor: 'divider', width: '100%', mt: 1, p: 0 }}
      >
        <Tab label="Fast Match" />
        <Tab label="Advance Search" />
      </Tabs>
      { currentTab == 0 && <FastMatchPanel/> }
      { currentTab == 1 && <AdvanceSearchPanel/> }
    </>
  )
}``

export default VehicleFinderStep;

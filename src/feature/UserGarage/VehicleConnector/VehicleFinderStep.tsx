import React, { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import FastMatchPanel from './FastMatchPanel';
import AdvanceSearchPanel from './AdvanceSearchPanel';

function VehicleFinderStep () {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <Tabs
        value={currentIndex}
        onChange={handleTabChange}
        sx={{ borderColor: 'divider', width: '100%', mt: 1, p: 0 }}
      >
        <Tab label="Fast Match" />
        <Tab label="Advance Search" />
      </Tabs>
      { currentIndex == 0 && <FastMatchPanel/> }
      { currentIndex == 1 && <AdvanceSearchPanel/> }
    </>
  )
}

export default VehicleFinderStep;

import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { ViewList } from '@mui/icons-material';

function GarageSideTabs () {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={value}
      onChange={handleChange}
      aria-label="Vertical tabs example"
      sx={{ borderColor: 'divider', width: '100%', m: 0, p: 0 }}
    >
      <Tab sx={{ color: '#7a7a7a' }} icon={<ViewList/>} />
      <Tab sx={{ color: '#7a7a7a' }} label="Highlander" />
      <Tab sx={{ color: '#7a7a7a' }} label="X5" />
      <Tab sx={{ color: '#7a7a7a' }} label="Cayenne Turbo" />
      <Tab sx={{ color: '#7a7a7a' }} label="Item Four" />
    </Tabs>
  );
}

export default GarageSideTabs;

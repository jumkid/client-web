import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { ViewList } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { changePick } from '../store/vehiclePickerSlice';
import PropTypes from 'prop-types';

function GarageSideTabs ({ vehicles }) {
  const currentPick = useSelector((state) => state.vehiclePicker.value);
  const dispatch = useDispatch();

  const handleChange = (event, index) => {
    dispatch(changePick(index));
  };

  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={currentPick}
      onChange={handleChange}
      aria-label="Vertical tabs example"
      sx={{ borderColor: 'divider', width: '100%', m: 0, p: 0 }}
    >
      <Tab sx={{ color: '#7a7a7a' }} icon={<ViewList/>} />
      { vehicles.map((vehicle, index) =>
        <Tab key={index} sx={{ color: '#7a7a7a' }} label={vehicle.name} />
      )}
    </Tabs>
  );
}

GarageSideTabs.propTypes = {
  vehicles: PropTypes.array.isRequired
};

export default GarageSideTabs;

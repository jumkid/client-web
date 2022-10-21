import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { ViewList } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { changePick } from '../../../store/vehiclePickerSlice';
import PropTypes from 'prop-types';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import { RootState } from '../../../store';

interface Props {
  vehicles: VehicleProfile[]
}

function GarageSideTabs ({ vehicles }: Props) {
  const currentPick = useSelector((state: RootState) => state.vehiclePicker.value);
  const dispatch = useDispatch();

  const handleChange = (event: any, index: number) => {
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
      <Tab icon={<ViewList/>} iconPosition="start" label="ALL" sx={{ backgroundColor: "#232323"}}/>
      { vehicles.map((vehicle, index) =>
        <Tab key={index} label={vehicle.name} />
      )}
    </Tabs>
  );
}

GarageSideTabs.propTypes = {
  vehicles: PropTypes.array.isRequired
};

export default GarageSideTabs;

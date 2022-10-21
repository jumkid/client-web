import React from 'react';
import { useSelector } from 'react-redux';
import { Box, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import VehicleProfileViewer from './VehicleProfileViewer';
import VehicleListViewer from './VehicleListViewer';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import { RootState } from '../../../store';

interface Props {
  vehicles: VehicleProfile[]
}

function GarageMainPanel ({ vehicles }:Props) {
  const currentPick = useSelector((state:RootState) => state.vehiclePicker.value);
  const currentIndex = currentPick - 1;

  return (
    <>
      { currentPick === 0 &&
        <Box className="dashboard-list-box">
          <Box>
            <TextField sx={{ backgroundColor: '#fff' }} fullWidth={true} placeholder="search your vehicle"/>
          </Box>
          <br/>
          <VehicleListViewer vehicles={vehicles} />
        </Box>
      }
      { currentPick > 0 && <VehicleProfileViewer vehicleProfile={vehicles[currentIndex]} />}
    </>
  );
}

GarageMainPanel.propTypes = {
  vehicles: PropTypes.array.isRequired
};

export default GarageMainPanel;

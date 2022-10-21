import React from 'react';
import PropTypes from 'prop-types';
import { Box, Card, CardContent, CardHeader } from '@mui/material';
import { useDispatch } from 'react-redux';
import { changePick } from '../store/vehiclePickerSlice';
import { VehicleProfile } from '../model/VehicleProfile';

interface Props {
  vehicles: VehicleProfile[]
}

function VehicleListViewer ({ vehicles }:Props) {
  const dispatch = useDispatch();

  const handleClick = (index:number) => {
    dispatch(changePick(++index));
  };

  return (
    <Box>
      { vehicles && vehicles.map((vehicle, index) => (
        <Card raised key={index} onClick={ () => handleClick(index) }>
          <CardHeader titleTypographyProps={{ fontWeight: 'bold' }} title={vehicle.name} subheader={vehicle.make + ' ' + vehicle.model}/>
          <CardContent>
            ...
          </CardContent>
        </Card>
      ))
      }
    </Box>
  );
}

VehicleListViewer.propTypes = {
  vehicles: PropTypes.array.isRequired
};

export default VehicleListViewer;

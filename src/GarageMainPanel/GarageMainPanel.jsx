import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, CardHeader, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import VehicleProfileViewer from './VehicleProfileViewer';
import { changePick } from '../store/vehiclePickerSlice';

function GarageMainPanel ({ vehicles }) {
  const dispatch = useDispatch();
  const currentPick = useSelector((state) => state.vehiclePicker.value);
  const currentIndex = currentPick - 1;

  const handleClick = (index) => {
    dispatch(changePick(++index));
  };

  return (
    <>
      { currentPick === 0 &&
        <Box className="dashboard-list-box">
          <Box>
            <TextField sx={{ backgroundColor: '#fff' }} fullWidth={true} placeholder="search your vehicle"/>
          </Box>
          <br/>
          <Box>
            { vehicles.map((vehicle, index) => (
              <Card raised key={index} onClick={ () => handleClick(index) }>
                <CardHeader titleTypographyProps={{ fontWeight: 'bold' }} title={vehicle.name} subheader={vehicle.make}/>
                <CardContent>
                  ...
                </CardContent>
              </Card>
            ))
            }
          </Box>
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

import React from 'react';
import { Button, Stack } from '@mui/material';
import { DirectionsCarFilled } from '@mui/icons-material';
import GarageSideTabs from './GarageSideTabs';
import PropTypes from 'prop-types';

function GarageSideBar ({ vehicles }) {
  const handleVehicleConnect = (event) => {
    console.log("let's connect a new vehicle");
  };

  return (
    <Stack pt="18px" m="auto" alignItems="center">
      <Button
        id="connect-car"
        variant="contained"
        onClick={handleVehicleConnect}
        startIcon={<DirectionsCarFilled sx={{ mr: 1 }} />}
      >
        Connect a vehicle
      </Button>

      <GarageSideTabs vehicles={vehicles} />

    </Stack>
  );
}

GarageSideBar.propTypes = {
  vehicles: PropTypes.array.isRequired
};

export default GarageSideBar;

import React from 'react';
import { Box, Card, CardContent, Button, Paper } from '@mui/material';
import { DirectionsCarFilled } from '@mui/icons-material';

const cardStyles = {
  height: '128px',
  cursor: 'pointer'
};

function GarageSideBar (props) {
  const handleVehicleConnect = (event) => {
    console.log("let's connect a new vehicle");
  };

  return (
    <>
      <Card sx={ cardStyles }>
        <CardContent>
          <Paper sx={{ fontSize: 14 }}>
            ?
          </Paper>
        </CardContent>
      </Card>

      <Box display='flex' flex='1'/>

      <Button
        sx={{ mt: 2, p: 1.24, fontSize: '14px' }}
        variant="contained"
        onClick={handleVehicleConnect}
        startIcon={<DirectionsCarFilled sx={{ mr: 1 }} />}
      >
        Connect your vehicle
      </Button>
    </>
  );
}

export default GarageSideBar;

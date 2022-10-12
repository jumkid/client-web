import React from 'react';
import { Card, CardContent, Button, Stack, CardHeader } from '@mui/material';
import { DirectionsCarFilled } from '@mui/icons-material';

const cardStyles = {
  width: '100%',
  height: '128px',
  cursor: 'pointer'
};

function GarageSideBar (props) {
  const handleVehicleConnect = (event) => {
    console.log("let's connect a new vehicle");
  };

  return (
    <Stack m="auto" alignItems="center">
      <Button
        sx={{ mb: 2, p: 1.24, fontSize: '14px' }}
        variant="contained"
        onClick={handleVehicleConnect}
        startIcon={<DirectionsCarFilled sx={{ mr: 1 }} />}
      >
        Connect new vehicle
      </Button>

      <Card sx={ cardStyles }>
        <CardHeader title="Toyota Highlander"/>
        <CardContent>
          whatever it takes
        </CardContent>
      </Card>
    </Stack>
  );
}

export default GarageSideBar;

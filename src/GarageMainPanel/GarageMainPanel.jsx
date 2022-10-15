import React from 'react';
import { Box, Card, CardContent, CardHeader, Divider, TextField } from '@mui/material';

function GarageMainPanel () {
  return (
    <>
      <Box sx={{ p: '18px' }}>
        <TextField sx={{ backgroundColor: '#fff' }} fullWidth="true" placeholder="search your vehicle"/>
      </Box>

      <Divider/>

      <Box sx={{ p: '18px' }}>
        <Card>
          <CardHeader title="Toyota Highlander"/>
          <CardContent>
            Limited | year 2015
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="BMW X5"/>
          <CardContent>
            i350 | year 2020
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default GarageMainPanel;

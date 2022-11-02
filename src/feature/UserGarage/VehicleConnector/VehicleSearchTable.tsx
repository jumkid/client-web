import React from 'react'
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useAppDispatch } from '../../../App.hooks';
import { setConnectedVehicle, setConnectorStep } from '../../../store/connectedVehicleSlice';

interface Props {
  vehicles: VehicleProfile[]
}

function VehicleSearchTable ({vehicles}:Props) {
  const dispatch = useAppDispatch();

  const handleRowClick = (vehicle:VehicleProfile):void => {
    dispatch(setConnectedVehicle(vehicle));
    dispatch(setConnectorStep(1));
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ overflowX: 'hidden', maxHeight: '55vh' }}>
        <Table stickyHeader aria-label="vehicle fast search table">
          <TableHead>
            <TableRow>
              <TableCell>Make</TableCell>
              <TableCell align="right">Model</TableCell>
              <TableCell align="right">Model Year</TableCell>
              <TableCell align="right">Trim Level</TableCell>
              <TableCell align="right">Variant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle, index) => (
              <TableRow
                key={index}
                hover
                tabIndex={-1}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => handleRowClick(vehicle)}
              >
                <TableCell component="th" scope="row">{vehicle.make}</TableCell>
                <TableCell align="right">{vehicle.model}</TableCell>
                <TableCell align="right">{vehicle.modelYear}</TableCell>
                <TableCell align="right">{vehicle.trimLevel}</TableCell>
                <TableCell align="right">...</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default VehicleSearchTable;

import React from 'react';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import { Box, Card, CardActions, CardContent, Fade, Link, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faGears, faCarSide } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../../App.hooks';
import { setConnectedVehicle, setConnectorStep } from '../../../store/connectedVehicleSlice';

interface Prop {
  vehicles: VehicleProfile[]
}

function VehicleCardViewer ({vehicles}:Prop) {
  const dispatch = useAppDispatch();

  const handleViewClick = (vehicle:VehicleProfile): void => {
    dispatch(setConnectedVehicle(vehicle));
    dispatch(setConnectorStep(1));
  }

  return (
    <Fade in={true}>
      <Box>
        { vehicles?.map((vehicle, index) => (
          <Card sx={{ width: 236, height: 146 }} raised key={index}>
            <CardContent sx={{ verticalAlign: "top" }}>
              <Typography fontSize="16px" fontWeight="bold" noWrap={true}>
                <FontAwesomeIcon icon={faCar} size="1x" width={23}/> {vehicle.vehicleEngine!.name}
              </Typography>
              <Typography fontSize="16px" fontWeight="bold" noWrap={true}>
                <FontAwesomeIcon icon={faGears} size="1x" width={23}/> {vehicle.vehicleTransmission!.name}
              </Typography>
              <Typography fontSize="16px" fontWeight="bold" noWrap={true}>
                <FontAwesomeIcon icon={faCarSide} size="1x" width={23}/> {vehicle.vehicleTransmission!.drivetrain}
              </Typography>
            </CardContent>
            <CardActions>
              <Link color="secondary" variant="body1" onClick={() => handleViewClick(vehicle)}>
                VIEW
              </Link>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Fade>
  )
}

export default VehicleCardViewer;

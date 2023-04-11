import React from 'react';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import { Box, Card, CardActionArea, CardContent, Fade, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faGears, faCarSide } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../../App.hooks';
import { setConnectedVehicle, setConnectorStep } from '../../../store/connectedVehicleSlice';

interface Prop {
  vehicles: VehicleProfile[]
}

function VehicleCardViewer ({vehicles}:Prop) {
  const dispatch = useAppDispatch();

  const handleClick = (vehicle:VehicleProfile): void => {
    dispatch(setConnectedVehicle(vehicle));
    dispatch(setConnectorStep(1));
  }

  return (
    <Fade in={true}>
      <Box>
        { vehicles?.map((vehicle, index) => (
          <Card sx={{ width: 236, height: 168 }} raised key={index}>
            <CardActionArea sx={{ height: '100%' }} onClick={() => handleClick(vehicle)}>
              <CardContent sx={{ verticalAlign: "top" }}>
                <Stack direction="row" alignItems="top" gap={1} fontSize="medium" mb={2}>
                  <FontAwesomeIcon icon={faCar} size="1x"/>{vehicle.vehicleEngine!.name}
                </Stack>
                <Stack direction="row" alignItems="top" gap={1} fontSize="medium" mb={2}>
                  <FontAwesomeIcon icon={faGears} size="1x"/>{vehicle.vehicleTransmission!.name}
                </Stack>
                <Stack direction="row" alignItems="top" gap={1} fontSize="medium" mb={1}>
                  <FontAwesomeIcon icon={faCarSide} size="1x"/>{vehicle.vehicleTransmission!.drivetrain}
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        )
        )}
      </Box>
    </Fade>
  )
}

export default VehicleCardViewer;

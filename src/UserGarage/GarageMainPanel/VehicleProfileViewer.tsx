import React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import { Lock, ModeEdit } from '@mui/icons-material';
import styled from '@emotion/styled';
import { Theme } from '@emotion/react';
import { VehicleProfile } from '../model/VehicleProfile';

interface ItemProps {
    theme: Theme
}

const Item = styled(Paper)(({ theme }:ItemProps) => ({
  ...theme,
  backgroundImage: 'none',
  paddingBottom: '8px',
  float: 'left'
}));

const ItemText = styled(Box)(({ theme }:ItemProps) => ({
  ...theme,
  width: '208px',
  textTransform: 'uppercase',
  fontWeight: '700',
  fontSize: '18px'
}));

interface Props {
    vehicleProfile: VehicleProfile
}

function VehicleProfileViewer ({ vehicleProfile }:Props) {
  const vehicleEngine = vehicleProfile.vehicleEngine;
  const vehicleTransmission = vehicleProfile.vehicleTransmission;

  return (
    <Stack className="dashboard-viewer-box">
      <Item>
        <h1>
          {vehicleProfile.name}
          &nbsp;&nbsp;
          <IconButton color="primary" aria-label="edit name" component="label"><ModeEdit/></IconButton>
          <IconButton color="primary" aria-label="access scope" component="label"><Lock/></IconButton>
        </h1>
      </Item>
      <Item>
        <Item>Make <ItemText>{vehicleProfile.make}</ItemText></Item>
        <Item>Model <ItemText>{vehicleProfile.model}</ItemText></Item>
      </Item>
      <Item>
        <Item>Trim Level <ItemText>{vehicleProfile.trimLevel}</ItemText></Item>
        <Item>Model Year <ItemText>{vehicleProfile.modelYear}</ItemText></Item>
      </Item>

      <Item>
        <h2>Engine</h2>
        <Typography variant="h5" color="primary">{vehicleEngine.name}</Typography>
      </Item>
      <Item>
        <Item>Type <ItemText>{vehicleEngine.type}</ItemText></Item>
        <Item>Number of Cylinder <ItemText>{vehicleEngine.cylinder}</ItemText></Item>
        <Item>Displacement <ItemText>{vehicleEngine.displacement}L</ItemText></Item>
        <Item>Fuel Type <ItemText>{vehicleEngine.fuelType}</ItemText></Item>
      </Item>
      <Item>
        <Item>Horsepower <ItemText>{vehicleEngine.horsepower} @ {vehicleEngine.horsepowerRpm}</ItemText></Item>
        <Item>Torque <ItemText>{vehicleEngine.torque} @ {vehicleEngine.torqueRpm}</ItemText></Item>
        <Item>Engine Code <ItemText>{vehicleEngine.manufacturerEngineCode}</ItemText></Item>
      </Item>

      <Item>
        <h2>Transmission</h2>
        <Typography variant="h5" color="primary">{vehicleTransmission.name}</Typography>
      </Item>
      <Item>
        <Item>Type <ItemText>{vehicleTransmission.type}</ItemText></Item>
        <Item>Drivetrain <ItemText>{vehicleTransmission.drivetrain}</ItemText></Item>
        <Item>Automatic Type <ItemText>{vehicleTransmission.automaticType}</ItemText></Item>
        <Item>Number of Speeds <ItemText>{vehicleTransmission.numberOfSpeeds}</ItemText></Item>
      </Item>
    </Stack>
  );
}

VehicleProfileViewer.propTypes = {
  vehicleProfile: PropTypes.object.isRequired
};

export default VehicleProfileViewer;

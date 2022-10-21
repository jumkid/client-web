import React from 'react';
import PropTypes from 'prop-types';
import { Box, Card, CardActions, CardContent, CardHeader, Chip, Icon, Link } from '@mui/material';
import { useDispatch } from 'react-redux';
import { changePick } from '../../../store/vehiclePickerSlice';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import * as C from '../../../App.constants';
import { PlayArrow } from '@mui/icons-material';

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
        <Card raised key={index}>
          <CardHeader
            titleTypographyProps={{ fontWeight: 'bold' }}
            title={vehicle.name}
            subheader={vehicle.trimLevel}
          />
          <CardContent>
            <Chip
              icon={<Icon sx={{ background: `url(${C.DOMAIN_IMAGES_AUTO_BRAND_API}/${vehicle.make}.png) no-repeat top left`, backgroundSize: "contain" }} />}
              label={vehicle.make}
            />
            <Chip label={vehicle.model} />
            <Chip label={vehicle.modelYear} />
          </CardContent>
          <CardActions>
            <PlayArrow fontSize="small"/><Link onClick={ ()=> handleClick(index) } color="secondary" variant="body1">Details</Link>
          </CardActions>
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

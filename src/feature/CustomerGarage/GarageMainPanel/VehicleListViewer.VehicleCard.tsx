import React from 'react';
import { Card, CardActions, CardContent, CardHeader, Chip, Icon, Link } from '@mui/material';
import * as C from '../../../App.constants';
import { PlayArrow } from '@mui/icons-material';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import { useAppDispatch } from '../../../App.hooks';

interface Props {
  vehicle: VehicleProfile
  callback: () => void
}

function VehicleCard ({vehicle, callback}:Props) {
  const dispatch = useAppDispatch();

  return (
    <Card raised key={vehicle.id}>
      <CardHeader
        titleTypographyProps={{ fontWeight: 'bold', noWrap: true, width: 328 }}
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
        <PlayArrow fontSize="small"/><Link onClick={ () => callback() } color="secondary" variant="body1">Details</Link>
      </CardActions>
    </Card>
  )
}

export default VehicleCard;
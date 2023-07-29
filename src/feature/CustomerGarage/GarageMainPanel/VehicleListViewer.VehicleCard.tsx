import React, { useState } from 'react';
import { Box, Card, CardActions, CardContent, CardHeader, Chip, Icon, Link } from '@mui/material';
import * as C from '../../../App.constants';
import { Collections, PlayArrow } from '@mui/icons-material';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import { useAppDispatch } from '../../../App.hooks';
import * as _ from 'lodash';
import BootstrapTooltip from '../../../component/BootstrapTooltip';

interface Props {
  vehicle: VehicleProfile
  callback: () => void
}

function VehicleCard ({vehicle, callback}:Props) {
  const [sourceMediaGalleryId, setSourceMediaGalleryId] = useState('');
  const [sourceBackgroundColor, setSourceBackgroundColor] = useState('');
  const dispatch = useAppDispatch();

  const handleOnDragCapture = (event:any, mediaGalleryId:string):void=> {
    setSourceMediaGalleryId(mediaGalleryId);
    setSourceBackgroundColor(event.currentTarget.style.getPropertyValue('background-color'));
  }

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
        { !_.isNil(vehicle.mediaGalleryId) &&
        <Box
          onDragStartCapture={(event) => handleOnDragCapture(event, vehicle.mediaGalleryId!)}
          draggable={true}
          className="draggable"
        >
          <BootstrapTooltip title="Copy this gallery to another card by drag and drop">
            <Collections
              sx={{float: 'right'}}
              fontSize='large'
            />
          </BootstrapTooltip>
        </Box>
        }
      </CardContent>
      <CardActions>
        <PlayArrow fontSize="small"/><Link onClick={ () => callback() } color="secondary" variant="body1">Details</Link>
      </CardActions>
    </Card>
  )
}

export default VehicleCard;
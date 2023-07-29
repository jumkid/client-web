import React, { useState } from 'react';
import { VehicleProfile } from '../../../../store/model/VehicleProfile';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader, CircularProgress,
  Fade,
  Link,
  Typography
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faGears, faCarSide } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { setConnectedVehicle, setConnectorStep } from '../../../../store/connectedVehicleSlice';
import * as _ from 'lodash';
import { Collections } from '@mui/icons-material';
import BootstrapTooltip from '../../../../component/BootstrapTooltip';
import ConfirmDialog from '../../../../component/ConfirmDialog';
import { vehicleService } from '../../../../service';
import { AxiosError } from 'axios';
import { RootState } from '../../../../store';
import UserProfile from '../../../../security/AuthUser/UserProfile';
import { setMatchVehicles } from '../../../../store/searchVehiclesSlice';

function VehicleCardViewer () {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [currentCard, setCurrentCard] = useState<HTMLElement | null>(null);
  const [currentVehicleId, setCurrentVehicleId] = useState<string | undefined | null>('');

  const [sourceVehicle, setSourceVehicle] = useState<VehicleProfile | null>(null);
  const [sourceBackgroundColor, setSourceBackgroundColor] = useState('');

  const matchVehicles = useAppSelector((state:RootState) => state.searchVehicles.matchVehicles);
  const dispatch = useAppDispatch();

  const handleViewClick = (vehicle:VehicleProfile): void => {
    dispatch(setConnectedVehicle(vehicle));
    dispatch(setConnectorStep(1));
  }

  const handleOnDragCapture = (event:any, sourceVehicle:VehicleProfile):void=> {
    setSourceVehicle(sourceVehicle);
    setSourceBackgroundColor(event.currentTarget.style.getPropertyValue('background-color'));
  }

  const handleOnDragOver = (event:any, mediaGalleryId:string | undefined | null):void => {
    event.preventDefault();
    if (mediaGalleryId != sourceVehicle!.mediaGalleryId) {
      event.currentTarget.style.setProperty('background-color', 'rgba(255,165,0)');
    }
  }

  const handleOnDragOut = (event:any):void => {
    event.currentTarget.style.setProperty('background-color', sourceBackgroundColor);
  }

  const handleOnDrop = (event:any, vehicleId:string | undefined | null):void => {
    if (isSubmitted || vehicleId === sourceVehicle!.id) {
      return;
    }
    setCurrentVehicleId(vehicleId);
    setCurrentCard(event.currentTarget);
    setIsDialogOpen(true);
  }

  const doConfirm = async () => {
    setIsSubmitted(true);
    setIsDialogOpen(false);

    try {
      const response = await vehicleService.copyGallery(currentVehicleId!, sourceVehicle!.mediaGalleryId!);
      if (response.status === 201) {
        const updatedMatchVehicles = matchVehicles.map(vehicle => {
          if (vehicle.id === currentVehicleId) {
            return {...vehicle, mediaGalleryId: response.data}
          } else {
            return vehicle;
          }
        });
        dispatch(setMatchVehicles(updatedMatchVehicles));
      }
      setIsSubmitted(false);
      currentCard!.style.setProperty('background-color', sourceBackgroundColor);
    } catch (err) {
      setIsSubmitted(false);
      currentCard!.style.setProperty('background-color', sourceBackgroundColor);

      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 409) {
        const blink = warningBlink();
        setTimeout(() => {
          clearInterval(blink);
          currentCard!.style.setProperty('background-color', sourceBackgroundColor);
        }, 1000);
      }
    }
  }

  const warningBlink = ():ReturnType<typeof setInterval> => {
    let ofs = 0;
    return setInterval(function(){
      currentCard!.style.setProperty('background-color', 'rgba(255,165,0,'+Math.abs(Math.sin(ofs))+')');
      ofs += 0.05;
    }, 1);
  }

  const doCancel = ():void => {
    setIsSubmitted(false);
    setIsDialogOpen(false);
    currentCard!.style.setProperty('background-color', sourceBackgroundColor);
  }

  return (
    <Fade in={true}>
      <Box>
        { !_.isNil(matchVehicles) && matchVehicles.map((vehicle, index) => (
          <Card
            key={index}
            sx={{ width: 236, height: 228 }}
            raised
            onDragOver={(event) => { handleOnDragOver(event, vehicle.mediaGalleryId);}}
            onDragLeave={(event) => { handleOnDragOut(event);}}
            onDrop={(event) => { handleOnDrop(event, vehicle.id);}}
          >
            <CardHeader
              titleTypographyProps={{ noWrap: true, fontSize: 16, fontWeight: 'bold' }}
              title={`${vehicle.modelYear} ${vehicle.model}`}
              subheader={vehicle.trimLevel}
              sx={{ pb:0 }}
            />

            <CardContent sx={{ verticalAlign: "top", mt:0, pt:1 }}>
              <Typography noWrap={true}>
                {vehicle.vehicleEngine!.horsepower}hp {vehicle.vehicleEngine!.torque}lbf
              </Typography>
              <Typography noWrap={true}>
                <FontAwesomeIcon icon={faCar} size="1x" width={23}/> {vehicle.vehicleEngine!.name}
              </Typography>
              <Typography noWrap={true}>
                <FontAwesomeIcon icon={faGears} size="1x" width={23}/> {vehicle.vehicleTransmission!.name}
              </Typography>
              <Typography noWrap={true}>
                <FontAwesomeIcon icon={faCarSide} size="1x" width={23}/> {vehicle.vehicleTransmission!.drivetrain}
              </Typography>

              { UserProfile.isAdmin() && !_.isNil(vehicle.mediaGalleryId) &&
                <Box
                  onDragStartCapture={(event) => handleOnDragCapture(event, vehicle)}
                  draggable={true}
                  className="draggable"
                  sx={{float: 'right'}}
                >
                  { (isSubmitted && currentVehicleId === vehicle.id) ?
                    <CircularProgress size="2rem" color='secondary'/>
                    :
                    <BootstrapTooltip title="Drag this gallery to another vehicle with empty gallery to make a copy">
                      <Collections
                        fontSize='large'
                      />
                    </BootstrapTooltip>
                  }
                </Box>
              }
            </CardContent>

            <CardActions>
              <Link color="secondary" variant="body1" onClick={() => handleViewClick(vehicle)}>
                VIEW
              </Link>
            </CardActions>
          </Card>
        ))}

        <ConfirmDialog
          title="Copy Gallery"
          message="Copy the gallery to this vehicle. Are you sure to do that?"
          isShown={isDialogOpen}
          confirmCallback={doConfirm}
          cancelCallback={doCancel}
        />
      </Box>
    </Fade>
  )
}

export default VehicleCardViewer;

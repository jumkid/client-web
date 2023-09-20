import React, { DragEvent, useState } from 'react';
import { VehicleProfile } from '../../../../store/model/VehicleProfile';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader, Chip,
  CircularProgress,
  Fade, Icon, IconButton,
  Link,
  Typography
} from '@mui/material';
import * as _ from 'lodash';
import AdminUser from '../../../../security/Auth/AdminUser';
import BootstrapTooltip from '../../../../component/BootstrapTooltip';
import { Collections, Lock, LockOpen } from '@mui/icons-material';
import NoneAdminUser from '../../../../security/Auth/NoneAdminUser';
import { vehicleService } from '../../../../service';
import { AxiosError } from 'axios';
import ConfirmDialog from '../../../../component/ConfirmDialog';
import * as C from '../../../../App.constants';
import './index.css';

interface Props {
  vehicles: VehicleProfile[]
  detailsLnkCallback: (index:number) => void
  copyDoneCallback: (vehicleId:string, mediaGalleryId:string) => void
}

function VehicleCards ({vehicles, detailsLnkCallback, copyDoneCallback}:Props) {

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [currentCard, setCurrentCard] = useState<HTMLElement | null>(null);
  const [currentVehicleId, setCurrentVehicleId] = useState<string | undefined | null>('');

  const [sourceVehicle, setSourceVehicle] = useState<VehicleProfile | null>(null);
  const [sourceBackgroundColor, setSourceBackgroundColor] = useState('');

  const handleOnDragCapture = (event: DragEvent<HTMLDivElement>, sourceVehicle: VehicleProfile): void => {
    setSourceVehicle(sourceVehicle);
    setSourceBackgroundColor(event.currentTarget.style.getPropertyValue('background-color'));
  }

  const handleOnDragOver = (event: DragEvent<HTMLDivElement>, mediaGalleryId: string | undefined | null): void => {
    event.preventDefault();
    if (mediaGalleryId != sourceVehicle!.mediaGalleryId) {
      event.currentTarget.style.setProperty('background-color', 'rgba(255,165,0)');
    }
  }

  const handleOnDragOut = (event: DragEvent<HTMLDivElement>): void => {
    event.currentTarget.style.setProperty('background-color', sourceBackgroundColor);
  }

  const handleOnDrop = (event: DragEvent<HTMLDivElement>, vehicleId: string | undefined | null): void => {
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
        copyDoneCallback(currentVehicleId!, response.data!);
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

  const warningBlink = (): ReturnType<typeof setInterval> => {
    let ofs = 0;
    return setInterval(function () {
      currentCard!.style.setProperty('background-color', 'rgba(255,165,0,' + Math.abs(Math.sin(ofs)) + ')');
      ofs += 0.05;
    }, 1);
  }

  const doCancel = (): void => {
    setIsSubmitted(false);
    setIsDialogOpen(false);
    currentCard!.style.setProperty('background-color', sourceBackgroundColor);
  }

  return (
    <Box className="clear-all">
      {!_.isEmpty(vehicles) && vehicles.map((vehicle, index) => (
        !_.isEmpty(vehicle.make) &&
        <Fade key={index} in={true}>
          <Card
            className="vehicle-card"
            raised
            onDragOver={(event) => {
              handleOnDragOver(event, vehicle.mediaGalleryId);
            }}
            onDragLeave={(event) => {
              handleOnDragOut(event);
            }}
            onDrop={(event) => {
              handleOnDrop(event, vehicle.id);
            }}
          >
            <IconButton className="vehicle-card-access-scope" aria-label="access scope" component="label" disabled={true}>
              { vehicle.accessScope === C.PRIVATE ? <Lock fontSize="large"/> : <LockOpen fontSize="large"/> }
            </IconButton>

            <CardHeader
              titleTypographyProps={{noWrap: true, fontSize: 16, fontWeight: 'bold'}}
              title={`${vehicle.modelYear} ${vehicle.model}`}
              subheader={vehicle.trimLevel}
              sx={{pb: 0}}
            />

            <CardContent>
              <Box>
                <Box>
                  <Chip
                    icon={<Icon sx={{
                      background: `url(${C.DOMAIN_IMAGES_AUTO_BRAND_API}/${vehicle.make}.png) no-repeat top left`,
                      backgroundSize: "contain"
                    }}/>}
                    label={vehicle.make}
                  />
                  { !_.isNil(vehicle.vehicleEngine) &&
                    <>
                      { !_.isNil(vehicle.vehicleEngine.horsepower) && vehicle.vehicleEngine.horsepower !== 0
                        && <Chip label={`${vehicle.vehicleEngine!.horsepower} hp`}/> }
                      { !_.isNil(vehicle.vehicleEngine.torque) && vehicle.vehicleEngine.torque !== 0
                        && <Chip label={`${vehicle.vehicleEngine!.torque} lbf`}/> }
                    </>
                  }
                </Box>

                <ul>
                  <li>
                    <Typography noWrap={true}>{vehicle.vehicleEngine!.displacement}L {vehicle.vehicleEngine!.cylinder} cylinders</Typography>
                  </li>
                  <li>
                    <Typography noWrap={true}>
                      {vehicle.vehicleTransmission!.numberOfSpeeds} speed {vehicle.vehicleTransmission!.type} transmission
                    </Typography>
                  </li>
                  <li>
                    <Typography noWrap={true}>{vehicle.vehicleTransmission!.drivetrain}</Typography>
                  </li>
                </ul>

                {!_.isNil(vehicle.mediaGalleryId) &&
                <>
                  <AdminUser>
                    <Box
                      onDragStartCapture={(event) => handleOnDragCapture(event, vehicle)}
                      draggable={true}
                      className="draggable position-right"
                    >
                      {(isSubmitted && currentVehicleId === vehicle.id) ?
                        <CircularProgress size="2rem" color='secondary'/>
                        :
                        <BootstrapTooltip title="Drag this gallery to another vehicle with empty gallery to make a copy">
                          <Collections fontSize='large'/>
                        </BootstrapTooltip>
                      }
                    </Box>
                  </AdminUser>

                  <NoneAdminUser>
                    <Collections className="position-right" fontSize='large'/>
                  </NoneAdminUser>
                </>
                }
              </Box>
            </CardContent>

            <CardActions>
              <Link color="secondary" variant="body1" onClick={() => detailsLnkCallback(index)}>
                Details
              </Link>
            </CardActions>
          </Card>
        </Fade>
      ))}

      <ConfirmDialog
        title="Copy Gallery"
        message="Copy the gallery to this vehicle. Are you sure to do that?"
        isShown={isDialogOpen}
        confirmCallback={doConfirm}
        cancelCallback={doCancel}
      />
    </Box>
  )
}

export default VehicleCards;
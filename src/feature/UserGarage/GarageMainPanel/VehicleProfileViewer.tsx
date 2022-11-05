import React from 'react';
import { Avatar, Fade, Grid, IconButton, Stack, Typography } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import * as C from '../../../App.constants';
import VehicleNameTools from './VehicleProfileViewer.VehicleNameTools';
import { Item, ItemHeader, ItemText } from '../../../layout/Layout.Theme';
import * as _ from 'lodash';

interface Props {
  showName?: true | false
  vehicleProfile: VehicleProfile
}

function VehicleProfileViewer ({ showName, vehicleProfile }:Props) {
  const showEditableName = _.isUndefined(showName) ? true : showName;
  const vehicleEngine = vehicleProfile.vehicleEngine;
  const vehicleTransmission = vehicleProfile.vehicleTransmission;

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Stack className="dashboard-viewer-box">
        <Grid container spacing={2} columns={16}>
          <Grid item xs={12}>
            <ItemHeader>
              <h2>
                <Avatar
                  variant="rounded"
                  src={`${C.DOMAIN_IMAGES_AUTO_BRAND_API}/${vehicleProfile.make}.png`}
                  sx={{ float: "left", mb: 1, mr: 2, width: 58, height: 64 }}
                />
                { showEditableName &&
                  <VehicleNameTools
                    vehicleName={vehicleProfile.name!}
                    vehicleId={vehicleProfile.id!}
                  />
                }
              </h2>
            </ItemHeader>
            <Item>
              <Item>Make <ItemText>{vehicleProfile.make}</ItemText></Item>
              <Item>Model <ItemText>{vehicleProfile.model}</ItemText></Item>
            </Item>
            <Item>
              <Item>Trim Level <ItemText>{vehicleProfile.trimLevel}</ItemText></Item>
              <Item>Model Year <ItemText>{vehicleProfile.modelYear}</ItemText></Item>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <IconButton sx={{ float: 'right', mt: 3.5 }} aria-label="access scope" component="label">
              { vehicleProfile.accessScope === "private" && <Lock fontSize="large"/> }
              { vehicleProfile.accessScope === "public" && <LockOpen fontSize="large"/> }
            </IconButton>
          </Grid>
        </Grid>

        { vehicleEngine &&
          <>
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
          </>
        }

        { vehicleTransmission &&
          <>
            <Item>
              <h2>Transmission</h2>
              <Typography variant="h5" color="primary">{vehicleTransmission.name}</Typography>
            </Item>
            <Item>
              <Item>Type <ItemText>{vehicleTransmission.type}</ItemText></Item>
              <Item>Automatic Type <ItemText>{vehicleTransmission.automaticType}</ItemText></Item>
              <Item>Number of Speeds <ItemText>{vehicleTransmission.numberOfSpeeds}</ItemText></Item>
              <Item>Drivetrain <ItemText>{vehicleTransmission.drivetrain}</ItemText></Item>
            </Item>
          </>
        }
      </Stack>
    </Fade>
  );
}

export default VehicleProfileViewer;

import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Item, ItemText } from '../../../layout/Layout.Theme';
import { VehicleProfile } from '../../../store/model/VehicleProfile';

type Props = {
  expanded: boolean
  vehicleProfile: VehicleProfile
}

function DetailsAccordion ({expanded, vehicleProfile}:Props) {
  const vehicleEngine = vehicleProfile!.vehicleEngine;
  const vehicleTransmission = vehicleProfile!.vehicleTransmission;

  return (
    <Accordion defaultExpanded={expanded}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>Technical Spec</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack className="dashboard-viewer-box">
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
      </AccordionDetails>
    </Accordion>
  )
}

export default DetailsAccordion;

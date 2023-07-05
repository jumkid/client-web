import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Item, S_FormControl } from '../../../layout/Layout.Theme';
import React, { ChangeEvent, useContext } from 'react';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { RootState } from '../../../store';
import * as _ from 'lodash';
import { ErrorsContext } from './VehicleProfileContext';
import Validator from './VehicleProfileForm.Validator';
import {
  changeEngineCode,
  changeEngineCylinder,
  changeEngineDisplacement,
  changeEngineFuelType,
  changeEngineHorsepower,
  changeEngineHorsepowerRpm,
  changeEngineName,
  changeEngineTorque,
  changeEngineTorqueRpm,
  changeEngineType,
  changeTransmissionAutomaticType, changeTransmissionDrivetrain,
  changeTransmissionName,
  changeTransmissionNumberOfSpeeds,
  changeTransmissionType
} from '../../../store/userVehiclesSlice';

type Props = {
  expanded: boolean
}

function DetailsAccordion ({expanded}:Props) {
  const vehicleProfile = useAppSelector((state: RootState) => state.userVehicles.currentVehicle);

  const vehicleEngine = vehicleProfile!.vehicleEngine!;
  const vehicleTransmission = vehicleProfile!.vehicleTransmission!;

  const dispatch = useAppDispatch();
  const {errors, setErrors} = useContext(ErrorsContext);

  const validator = new Validator(vehicleProfile, errors);

  const handleEngineTypeChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(changeEngineType(value));
    validator.validateEngineType(value);
    validateForm();
  };

  const handleEngineNameChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(changeEngineName(value));
    validator.validateEngineName(value);
    validateForm();
  };

  const handleCylinderChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    dispatch(changeEngineCylinder(value));
    validator.validateEngineCylinder(value);
    validateForm();
  };

  const handleDisplacementChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    dispatch(changeEngineDisplacement(value));
    validator.validateEngineDisplacement(value);
    validateForm();
  };

  const handleFuelTypeChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(changeEngineFuelType(value));
    validator.validateEngineFuelType(value);
    validateForm();
  };

  const handleEngineCodeChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(changeEngineCode(value));
    validator.validateEngineCode(value);
    validateForm();
  };

  const handleHorsepowerChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    dispatch(changeEngineHorsepower(value));
    validator.validateEngineHorsepower(value);
    validateForm();
  };

  const handleHorsepowerRpmChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    dispatch(changeEngineHorsepowerRpm(value));
    validator.validateEngineHorsepowerRpm(value);
    validateForm();
  };

  const handleTorqueChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    dispatch(changeEngineTorque(value));
    validator.validateEngineTorque(value);
    validateForm();
  };

  const handleTorqueRpmChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    dispatch(changeEngineTorqueRpm(value));
    validator.validateEngineTorqueRpm(value);
    validateForm();
  };

  const handleTransmissionNameChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(changeTransmissionName(value));
    validator.validateTransmissionName(value);
    validateForm();
  };

  const handleTransmissionTypeChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(changeTransmissionType(value));
    validator.validateTransmissionType(value);
    validateForm();
  };

  const handleTransmissionAutomaticTypeChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(changeTransmissionAutomaticType(value));
    validator.validateTransmissionAutomaticType(value);
    validateForm();
  };

  const handleNumberOfSpeedsChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    dispatch(changeTransmissionNumberOfSpeeds(value));
    validator.validateTransmissionNumberOfSpeeds(value);
    validateForm();
  };

  const handleTransmissionDrivetrainChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(changeTransmissionDrivetrain(value));
    validator.validateTransmissionDrivetrain(value);
    validateForm();
  };

  const validateForm = () => {
    setErrors( { ...validator.errors });
  };

  return (
    <Accordion defaultExpanded={expanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Technical Spec</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack className="dashboard-viewer-box">
          { vehicleEngine &&
          <S_FormControl>
            <Item>
              <h2>Engine</h2>
              <Item>
                <TextField
                  label="Name"
                  name="name"
                  onChange={handleEngineNameChange}
                  variant="outlined"
                  value={vehicleEngine.name}
                  error={!_.isNil(errors.engine) && !_.isNil(errors.engine.name)}
                  helperText={!_.isNil(errors.engine) && !_.isNil(errors.engine.name) ? errors.engine.name : ''}
                />
              </Item>
            </Item>
            <Item>
              <Item>
                <TextField
                  label="Type"
                  name="type"
                  onChange={handleEngineTypeChange}
                  variant="outlined"
                  value={vehicleEngine.type}
                  error={!_.isNil(errors.engine) && !_.isNil(errors.engine.type)}
                  helperText={!_.isNil(errors.engine) && !_.isNil(errors.engine.type) ? errors.engine.type : ''}
                />
              </Item>
              <Item>
                <TextField
                  label="Number of Cylinder"
                  name="cylinder"
                  onChange={handleCylinderChange}
                  type="integer"
                  variant="outlined"
                  value={vehicleEngine.cylinder}
                  error={!_.isNil(errors.engine) && !_.isNil(errors.engine.cylinder)}
                  helperText={!_.isNil(errors.engine) && !_.isNil(errors.engine.cylinder) ? errors.engine.cylinder : ''}
                />
              </Item>
              <Item>
                <TextField
                  label="Displacement"
                  name="displacement"
                  onChange={handleDisplacementChange}
                  type="float"
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">L</InputAdornment>
                  }}
                  value={vehicleEngine.displacement}
                  error={!_.isNil(errors.engine) && !_.isNil(errors.engine.displacement)}
                  helperText={!_.isNil(errors.engine) && !_.isNil(errors.engine.displacement) ? errors.engine.displacement : ''}
                />
              </Item>
            </Item>
            <Item>
              <Item>
                <TextField
                  label="Fuel Type"
                  name="fuelType"
                  onChange={handleFuelTypeChange}
                  variant="outlined"
                  value={vehicleEngine.fuelType}
                  error={!_.isNil(errors.engine) && !_.isNil(errors.engine.fuelType)}
                  helperText={!_.isNil(errors.engine) && !_.isNil(errors.engine.fuelType) ? errors.engine.fuelType : ''}
                />
              </Item>
              <Item>
                <TextField
                  label="Manufacturer Engine Code"
                  name="engineCode"
                  onChange={handleEngineCodeChange}
                  variant="outlined"
                  value={vehicleEngine.manufacturerEngineCode}
                  error={!_.isNil(errors.engine) && !_.isNil(errors.engine.manufacturerEngineCode)}
                  helperText={!_.isNil(errors.engine) && !_.isNil(errors.engine.manufacturerEngineCode) ? errors.engine.manufacturerEngineCode : ''}
                />
              </Item>
            </Item>
            <Item>
              <Item>
                <TextField
                  label="Horsepower"
                  name="horsepower"
                  onChange={handleHorsepowerChange}
                  type="integer"
                  variant="outlined"
                  value={vehicleEngine.horsepower}
                  error={!_.isNil(errors.engine) && !_.isNil(errors.engine.horsepower)}
                  helperText={!_.isNil(errors.engine) && !_.isNil(errors.engine.horsepower) ? errors.engine.horsepower : ''}
                />
              </Item>
              <Item>
                <TextField
                  label="Horsepower RPM"
                  name="horsepowerRpm"
                  onChange={handleHorsepowerRpmChange}
                  type="integer"
                  variant="outlined"
                  value={vehicleEngine.horsepowerRpm}
                  error={!_.isNil(errors.engine) && !_.isNil(errors.engine.horsepowerRpm)}
                  helperText={!_.isNil(errors.engine) && !_.isNil(errors.engine.horsepowerRpm) ? errors.engine.horsepowerRpm : ''}
                />
              </Item>
            </Item>
            <Item>
              <Item>
                <TextField
                  label="Torque"
                  name="torque"
                  onChange={handleTorqueChange}
                  type="integer"
                  variant="outlined"
                  value={vehicleEngine.torque}
                  error={!_.isNil(errors.engine) && !_.isNil(errors.engine.torque)}
                  helperText={!_.isNil(errors.engine) && !_.isNil(errors.engine.torque) ? errors.engine.torque : ''}
                />
              </Item>
              <Item>
                <TextField
                  label="Torque RPM"
                  name="torqueRpm"
                  onChange={handleTorqueRpmChange}
                  type="integer"
                  variant="outlined"
                  value={vehicleEngine.torqueRpm}
                  error={!_.isNil(errors.engine) && !_.isNil(errors.engine.torqueRpm)}
                  helperText={!_.isNil(errors.engine) && !_.isNil(errors.engine.torqueRpm) ? errors.engine.torqueRpm : ''}
                />
              </Item>
            </Item>
          </S_FormControl>
          }

          { vehicleTransmission &&
          <S_FormControl>
            <Item>
              <h2>Transmission</h2>
              <Item>
                <TextField
                  label="Name"
                  name="name"
                  onChange={handleTransmissionNameChange}
                  variant="outlined"
                  value={vehicleTransmission.name}
                  error={!_.isNil(errors.transmission) && !_.isNil(errors.transmission.name)}
                  helperText={!_.isNil(errors.transmission) && !_.isNil(errors.transmission.name) ? errors.transmission.name : ''}
                />
              </Item>
            </Item>
            <Item>
              <Item>
                <TextField
                  label="Type"
                  name="type"
                  onChange={handleTransmissionTypeChange}
                  variant="outlined"
                  value={vehicleTransmission.type}
                  error={!_.isNil(errors.transmission) && !_.isNil(errors.transmission.type)}
                  helperText={!_.isNil(errors.transmission) && !_.isNil(errors.transmission.type) ? errors.transmission.type : ''}
                />
              </Item>
              <Item>
                <TextField
                  label="Automatic Type"
                  name="automaticType"
                  onChange={handleTransmissionAutomaticTypeChange}
                  variant="outlined"
                  value={vehicleTransmission.automaticType}
                  error={!_.isNil(errors.transmission) && !_.isNil(errors.transmission.automaticType)}
                  helperText={!_.isNil(errors.transmission) && !_.isNil(errors.transmission.automaticType) ? errors.transmission.automaticType : ''}
                />
              </Item>
              <Item>
                <TextField
                  label="Number of Speeds"
                  name="numberOfSpeeds"
                  onChange={handleNumberOfSpeedsChange}
                  variant="outlined"
                  type="integer"
                  value={vehicleTransmission.numberOfSpeeds}
                  error={!_.isNil(errors.transmission) && !_.isNil(errors.transmission.numberOfSpeeds)}
                  helperText={!_.isNil(errors.transmission) && !_.isNil(errors.transmission.numberOfSpeeds) ? errors.transmission.numberOfSpeeds : ''}
                />
              </Item>
            </Item>
            <Item>
              <TextField
                label="Drivetrain"
                name="drivetrain"
                onChange={handleTransmissionDrivetrainChange}
                variant="outlined"
                value={vehicleTransmission.drivetrain}
                error={!_.isNil(errors.transmission) && !_.isNil(errors.transmission.drivetrain)}
                helperText={!_.isNil(errors.transmission) && !_.isNil(errors.transmission.drivetrain) ? errors.transmission.drivetrain : ''}
              />
            </Item>
          </S_FormControl>
          }
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

export default DetailsAccordion;
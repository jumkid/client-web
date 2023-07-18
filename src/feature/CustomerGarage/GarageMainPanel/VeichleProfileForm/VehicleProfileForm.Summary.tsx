import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Item, S_FormControl } from '../../../../layout/Layout.Theme';
import {
  Avatar,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import * as _ from 'lodash';
import { changeName } from '../../../../store/vehicleActivitiesSlice';
import {
  changeAccessScope,
  changeMake,
  changeModel,
  changeModelYear,
  changeTrimLevel
} from '../../../../store/userVehiclesSlice';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { RootState } from '../../../../store';
import { ErrorsContext } from '../VehicleProfileContext';
import Validator from './VehicleProfileForm.Validator';
import * as C from '../../../../App.constants';
import { PRIVATE, PUBLIC } from '../../../../App.constants';
import { Lock, LockOpen } from '@mui/icons-material';
import { domainDataService } from '../../../../service';
import { DomainData } from '../../../../store/model/DomainData';

const initialState:DomainData[] = [];

function VehicleProfileSummaryForm () {
  const currentVehicle = useAppSelector((state: RootState) => state.userVehicles.currentVehicle);
  const {errors, setErrors} = useContext(ErrorsContext);
  const [automobileBrands, setAutomobileBrands] = useState(initialState);

  const dispatch = useAppDispatch();

  const validator = new Validator(currentVehicle, errors);

  useEffect(() => {
    domainDataService.getDomainData('automobile', 'brand').then(
      (response) => {
        setAutomobileBrands(response.data!);
      }
    );
  }, []);

  const validateForm = ():void => {
    setErrors({ ...validator.errors });
  };

  const toggleAccessScope = ():void => {
    dispatch(changeAccessScope(currentVehicle!.accessScope === PUBLIC ? PRIVATE : PUBLIC));
    validateForm();
  }

  const handleNameChange = (event:ChangeEvent<HTMLInputElement>):void => {
    const value = event.target.value
    dispatch(changeName(value));
    validator.validateName(value);
    validateForm();
  };

  const handleMakeChange = (event:SelectChangeEvent):void => {
    const value = event.target.value
    dispatch(changeMake(value));
    validator.validateMake(value);
    validateForm();
  };

  const handleModelChange = (event:ChangeEvent<HTMLInputElement>):void => {
    const value = event.target.value
    dispatch(changeModel(value));
    validator.validateModel(value);
    validateForm();
  };

  const handleTrimLevelChange = (event:ChangeEvent<HTMLInputElement>):void => {
    const value = event.target.value
    dispatch(changeTrimLevel(value));
    validator.validateTrimLevel(value);
    validateForm();
  };

  const handleModelYearChange = (event:ChangeEvent<HTMLInputElement>):void => {
    const value = Number(event.target.value);
    dispatch(changeModelYear(value));
    validator.validateModelYear(value);
    validateForm();
  };
  return (
    <S_FormControl>
      <Grid container columns={16}>
        <Grid item xs={12}>
          <Avatar
            variant="rounded"
            src={`${C.DOMAIN_IMAGES_AUTO_BRAND_API}/${currentVehicle!.make}.png`}
            sx={{ float: "left", mb: 1, mr: 2, width: 58, height: 64 }}
          />
        </Grid>
        <Grid item xs={4}>
          <IconButton sx={{ float: 'right' }} aria-label="access scope" component="label" onClick={toggleAccessScope}>
            { currentVehicle!.accessScope === PRIVATE && <Lock fontSize="large"/> }
            { currentVehicle!.accessScope === PUBLIC && <LockOpen fontSize="large"/> }
          </IconButton>
        </Grid>
      </Grid>

      <Item>
        <TextField
          label="Name"
          name="name"
          onChange={handleNameChange}
          required={true}
          variant="outlined"
          value={currentVehicle!.name}
          error={!_.isNil(errors.name)}
          helperText={!_.isNil(errors.name) ? errors.name : ' '}
        />
      </Item>
      <Item>
        <Item>
          <S_FormControl error={!_.isNil(errors.make)}>
            <InputLabel id="select-label-make">Make *</InputLabel>
            <Select
              labelId="select-label-make"
              label="Make *"
              onChange={handleMakeChange}
              required={true}
              variant="outlined"
              value={currentVehicle!.make!}
              MenuProps={{ PaperProps: { sx: { maxHeight: 230 } } }}
            >
              {!_.isNil(automobileBrands) && automobileBrands.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </Select>
            {!_.isNil(errors.make) && <FormHelperText>make is required</FormHelperText>}
          </S_FormControl>
        </Item>
        <Item>
          <TextField
            label="Model"
            name="model"
            onChange={handleModelChange}
            required={true}
            variant="outlined"
            value={currentVehicle!.model}
            error={!_.isNil(errors.model)}
            helperText={!_.isNil(errors.model) ? errors.model : ' '}
          />
        </Item>
        <Item>
          <TextField
            label="Trim Level"
            name="trimLevel"
            onChange={handleTrimLevelChange}
            required={true}
            variant="outlined"
            value={currentVehicle!.trimLevel}
            error={!_.isNil(errors.trimLevel)}
            helperText={!_.isNil(errors.trimLevel) ? errors.trimLevel : ' '}
          />
        </Item>
        <Item>
          <TextField
            label="Model Year"
            name="modelYear"
            onChange={handleModelYearChange}
            required={true}
            type="integer"
            variant="outlined"
            value={currentVehicle!.modelYear}
            error={!_.isNil(errors.modelYear)}
            helperText={!_.isNil(errors.modelYear) ? errors.modelYear : null}
          />
        </Item>
      </Item>
    </S_FormControl>
  )
}

export default VehicleProfileSummaryForm;
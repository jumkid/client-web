import React, { ChangeEvent, useContext } from 'react';
import { Avatar, Grid, IconButton, Stack, TextField } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import * as C from '../../../App.constants';
import { Item } from '../../../layout/Layout.Theme';
import * as _ from 'lodash';
import GalleryAccordion from './VehicleProfileForm.GalleryAccordion';
import DetailsAccordion from './VehicleProfileForm.DetailsAccordion';
import { PRIVATE, PUBLIC } from '../../../App.constants';
import { S_FormControl } from '../../../layout/Layout.Theme';
import {
  changeAccessScope,
  changeMake,
  changeModel,
  changeModelYear,
  changeTrimLevel
} from '../../../store/userVehiclesSlice';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import Validator from './VehicleProfileForm.Validator';
import { ErrorsContext } from './VehicleProfileContext';
import { RootState } from '../../../store';
import { changeName } from '../../../store/vehicleActivitiesSlice';
import PricingAccordion from './VehicleProfileForm.PricingAccordion';

function VehicleProfileForm () {
  const editableVehicle = useAppSelector((state: RootState) => state.userVehicles.currentVehicle);
  const {errors, setErrors} = useContext(ErrorsContext);

  const dispatch = useAppDispatch();

  const validator = new Validator(editableVehicle, errors);

  const handleNameChange = (event:ChangeEvent<HTMLInputElement>):void => {
    const value = event.target.value
    dispatch(changeName(value));
    validator.validateName(value);
    validateForm();
  };

  const handleMakeChange = (event:ChangeEvent<HTMLInputElement>):void => {
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

  const toggleAccessScope = ():void => {
    dispatch(changeAccessScope(editableVehicle!.accessScope === PUBLIC ? PRIVATE : PUBLIC));
    validateForm();
  }

  const validateForm = ():void => {
    setErrors({ ...validator.errors });
  };

  return (
    <Stack className="dashboard-viewer-box">
      <Grid container columns={16}>
        <Grid item xs={12}>
          <Avatar
            variant="rounded"
            src={`${C.DOMAIN_IMAGES_AUTO_BRAND_API}/${editableVehicle!.make}.png`}
            sx={{ float: "left", mb: 1, mr: 2, width: 58, height: 64 }}
          />
        </Grid>
        <Grid item xs={4}>
          <IconButton sx={{ float: 'right' }} aria-label="access scope" component="label" onClick={toggleAccessScope}>
            { editableVehicle!.accessScope === PRIVATE && <Lock fontSize="large"/> }
            { editableVehicle!.accessScope === PUBLIC && <LockOpen fontSize="large"/> }
          </IconButton>
        </Grid>
      </Grid>
      <S_FormControl>
        <Item>
          <TextField
            label="Name"
            name="name"
            onChange={handleNameChange}
            required={true}
            variant="outlined"
            value={editableVehicle!.name}
            error={!_.isNil(errors.name)}
            helperText={!_.isNil(errors.name) ? errors.name : ' '}
          />
        </Item>
        <Item>
          <Item>
            <TextField
              label="Make"
              name="make"
              onChange={handleMakeChange}
              required={true}
              variant="outlined"
              value={editableVehicle!.make}
              error={!_.isNil(errors.make)}
              helperText={!_.isNil(errors.make) ? errors.make : ' '}
            />
          </Item>
          <Item>
            <TextField
              label="Model"
              name="model"
              onChange={handleModelChange}
              required={true}
              variant="outlined"
              value={editableVehicle!.model}
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
              value={editableVehicle!.trimLevel}
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
              value={editableVehicle!.modelYear}
              error={!_.isNil(errors.modelYear)}
              helperText={!_.isNil(errors.modelYear) ? errors.modelYear : null}
            />
          </Item>
        </Item>
      </S_FormControl>

      <GalleryAccordion mode={C.MODE_ACTIVE}/>

      <PricingAccordion mode={C.MODE_ACTIVE} />

      <DetailsAccordion mode={C.MODE_ACTIVE}/>
    </Stack>
  );
}

export default VehicleProfileForm;

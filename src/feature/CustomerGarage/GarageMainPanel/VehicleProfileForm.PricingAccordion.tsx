import React, { ChangeEvent, useContext } from 'react';
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
import { changePricingMSRP } from '../../../store/userVehiclesSlice';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { RootState } from '../../../store';
import { ErrorsContext } from './VehicleProfileContext';
import Validator from './VehicleProfileForm.Validator';
import { DISPLAY_MODE } from '../../../service/model/CommonTypes';
import * as _ from 'lodash';
import * as C from '../../../App.constants';

type Props = {
  mode: DISPLAY_MODE
}

function PricingAccordion ({mode}:Props) {
  const vehicleProfile = useAppSelector((state: RootState) => state.userVehicles.currentVehicle);
  const vehiclePricing = vehicleProfile!.vehiclePricing!;

  const dispatch = useAppDispatch();
  const {errors, setErrors} = useContext(ErrorsContext);

  const validator = new Validator(vehicleProfile, errors);

  const handlePricingMsrpChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    dispatch(changePricingMSRP(value));
    validator.validatePricingMSRP(value);
    validateForm();
  };

  const validateForm = () => {setErrors( { ...validator.errors });};

  return (
    <Accordion defaultExpanded={mode === C.MODE_ACTIVE}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Prices</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack className="dashboard-viewer-box">
          <S_FormControl>
            <Item>
              <TextField
                label="MSRP"
                name="msrp"
                type="integer"
                onChange={handlePricingMsrpChange}
                variant="outlined"
                value={_.isNil(vehiclePricing) ? 0 : vehiclePricing.msrp}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                error={!_.isNil(errors.pricing) && !_.isNil(errors.pricing.msrp)}
                helperText={!_.isNil(errors.pricing) && !_.isNil(errors.pricing.msrp) ? errors.pricing.msrp : ''}
              />
            </Item>
          </S_FormControl>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

export default PricingAccordion;
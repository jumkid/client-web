import React, { ChangeEvent, useContext, useEffect } from 'react';
import {
  Box,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { RootState } from '../../../../store';
import {
  changeDescription,
  changeEndDate, changeName, changePriority,
  changeStartDate, changeStatus,
  fetchActivityPriorities, fetchActivityStatuses
} from '../../../../store/vehicleActivitiesSlice';
import * as _ from 'lodash';
import Validator  from './ActivityMainForm.Validator';
import { ErrorsContext } from './ActivityContext';
import { DATETIME_FORMAT, DATETIME_FORMAT_NO_SECOND } from '../../../../App.constants';
import { S_FormControl } from '../../../../layout/Layout.Theme';

function ActivityMainForm () {
  const activity = useAppSelector((state:RootState) => state.vehicleActivities.currentActivity);
  const activityPriorities = useAppSelector((state:RootState) => state.vehicleActivities.activityPriorities);
  const activityStatuses = useAppSelector((state:RootState) => state.vehicleActivities.activityStatuses);

  const dispatch = useAppDispatch();

  const {errors, setErrors} = useContext(ErrorsContext);

  useEffect(() => {
    dispatch(fetchActivityPriorities());
    dispatch(fetchActivityStatuses());
  },[]);

  const validator = new Validator(activity, errors);

  const handleNameChange = (event:ChangeEvent<HTMLInputElement>) => {
    const nameValue = event.target.value;
    dispatch(changeName(nameValue));
    validator.validateName(nameValue);
    validateForm();
  };

  const handleDescriptionChange = (event:ChangeEvent<HTMLInputElement>) => {
    const descriptionValue = event.target.value
    dispatch(changeDescription(descriptionValue));
    validator.validateDescription(descriptionValue);
    validateForm();
  };

  const handleStartDateChange = (newValue: Dayjs | null) => {
    dispatch(changeStartDate(newValue?.format(DATETIME_FORMAT)));
    validator.validateStartDate(newValue, _.isNil(activity.endDate) ? null : dayjs(activity.endDate));
    validateForm();
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    dispatch(changeEndDate(newValue?.format(DATETIME_FORMAT)));
    validator.validateEndDate(newValue, dayjs(activity.startDate));
    validateForm();
  };

  const handleOnStatusChange = (event:SelectChangeEvent<unknown>) => {
    const statusValue = event.target.value;
    validator.validateStatus(statusValue);
    dispatch(changeStatus(statusValue));
    validateForm();
  };

  const handleOnPriorityChange = (event:SelectChangeEvent<unknown>) => {
    const priorityValue = event.target.value;
    validator.validatePriority(priorityValue);
    const priority = activityPriorities?.find(priority => priority.id === priorityValue);
    dispatch(changePriority(priority));
    validateForm();
  };

  const validateForm = () => {
    setErrors({ ...validator.errors });
  };

  return (
    <Box className="activity-main">
      <form>
        <Grid container spacing={1} columns={6}>
          {/** LEFT AREA **/}
          <Grid item xs={4}>
            <S_FormControl>
              <TextField
                label="Name"
                name="name"
                onChange={handleNameChange}
                required={true}
                variant="outlined"
                value={activity?.name}
                error={!_.isNil(errors.name)}
                helperText={!_.isNil(errors.name) ? errors.name : ' '}
              />
            </S_FormControl>

            <Grid container spacing={1} columns={4}>
              <Grid item xs={2}>
                <S_FormControl>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    label="Status"
                    name="status"
                    required={true}
                    error={!_.isNil(errors.status)}
                    value={(!_.isEmpty(activityStatuses) && activity?.status) || ''}
                    onChange={handleOnStatusChange}
                  >
                    { activityStatuses && activityStatuses.map((status, index) => (
                      <MenuItem key={index} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </S_FormControl>
                <S_FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Start Time"
                      inputFormat={DATETIME_FORMAT_NO_SECOND}
                      ampm={true}
                      disablePast={true}
                      value={dayjs(activity.startDate)}
                      onChange={handleStartDateChange}
                      renderInput={
                        (params) =>
                          <TextField
                            {...params}
                            required={true}
                            error={!_.isNil(errors.startDate)}
                            helperText={!_.isNil(errors.startDate) ? errors.startDate : ' '}
                          />}
                    />
                  </LocalizationProvider>
                </S_FormControl>
              </Grid>

              <Grid item xs={2}>
                <S_FormControl>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    label="Priority"
                    name="priority"
                    required={true}
                    error={!_.isNil(errors.priority)}
                    value={(!_.isEmpty(activityPriorities) && activity.priority?.id) || ''}
                    onChange={handleOnPriorityChange}
                  >
                    { activityPriorities && activityPriorities.map((priority, index) => (
                      <MenuItem key={index} value={priority.id}>
                        {priority.label}
                      </MenuItem>
                    ))}
                  </Select>
                </S_FormControl>
                <S_FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="End Time"
                      inputFormat={DATETIME_FORMAT_NO_SECOND}
                      ampm={true}
                      disablePast={true}
                      value={activity.endDate}
                      onChange={handleEndDateChange}
                      renderInput={(params) =>
                        <TextField
                          {...params}
                          error={!_.isNil(errors.endDate)}
                          helperText={!_.isNil(errors.endDate) ? errors.endDate : ' '}
                        />}
                    />
                  </LocalizationProvider>
                </S_FormControl>
              </Grid>
            </Grid>

            <S_FormControl>
              <TextField
                sx={{width:"672px"}}
                label="Description"
                name="description"
                multiline={true}
                minRows={3}
                maxRows={3}
                value={activity?.description || ''}
                onChange={handleDescriptionChange}
              />
            </S_FormControl>
          </Grid>

          {/** RIGHT AREA **/}
          <Grid item xs={2}>
            <fieldset style={{height: '94%'}}>
              <legend>Assignee</legend>
              Assign this activity to someone
            </fieldset>
          </Grid>
        </Grid>
      </form>
    </Box>
  )

}

export default ActivityMainForm;

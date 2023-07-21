import { Activity } from '../../../../store/model/Activity';
import * as _ from 'lodash';
import dayjs, { Dayjs } from 'dayjs';

export type ValidationErrors = {
  hasUpdate: boolean

  name?: string | null
  startDate?: string | null
  endDate?: string | null,
  status?: string | null,
  priority?: string | null
}

export const initValidationErrors: ValidationErrors = {
  hasUpdate: false,
  name: "name is required",
  status: "status is required",
  priority: "priority is required"
}

class Validator {

  errors: ValidationErrors
  activity: Activity

  constructor (activity: Activity, initialErrors: ValidationErrors) {
    this.errors = initialErrors;
    this.activity = activity;
  }

  validateName (value: string) {
    if (_.isNull(value)) {
      this.errors.name = "name is required";
    } else if (value.length < 2) {
      this.errors.name = "name is invalid";
    } else {
      delete this.errors.name;
    }

    this.setHasUpdate();
  }

  validateDescription (value: string) {
    this.setHasUpdate();
  }

  validateStartDate (startDate: Dayjs | null, endDate: Dayjs | null) {
    if (_.isNull(startDate)){
      this.errors.startDate = "start date is required";
    } else if (startDate <= dayjs(Date.now())) {
      this.errors.startDate = "start date must be a future date";
    } else if (!_.isNull(endDate) && endDate <= startDate) {
      this.errors.startDate = "start date must be earlier then end date";
    } else {
      delete this.errors.startDate;
      delete this.errors.endDate;
    }

    this.setHasUpdate();
  }

  validateEndDate (endDate: Dayjs | null, startDate: Dayjs | null) {
    if (!_.isNull(endDate) && !_.isNull(startDate) && endDate <= startDate) {
      this.errors.endDate = "end date must be later then start date";
    } else {
      delete this.errors.endDate;
      delete this.errors.startDate;
    }

    this.setHasUpdate();
  }

  validatePriority (value: number | unknown) {
    if (typeof value !== "number" || (value < 1)) {
      this.errors.priority = "priority is required";
    } else {
      delete this.errors.priority;
    }

    this.setHasUpdate();
  }

  validateStatus (value: string | unknown) {
    if (_.isNil(value)) {
      this.errors.status = "status is required";
    } else {
      delete this.errors.status;
    }

    this.setHasUpdate();
  }

  setHasUpdate () {
    this.errors.hasUpdate = true;
  }
}

export default Validator;

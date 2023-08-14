import { VehicleProfile } from '../../../../store/model/VehicleProfile';
import * as _ from 'lodash';

export type ValidationErrors = {
  hasUpdate: boolean

  name?: string | null
  make?: string | null
  model?: string | null
  modelYear?: string | null
  trimLevel?: string | null
  pricing?: {
    msrp?: string | null
  }
  engine?: {
    type?: string | null
    name?: string | null
    cylinder?: string | null
    displacement?: string | null
    fuelType?: string | null
    horsepower?: string | null
    horsepowerRpm?: string | null
    torque?: string | null
    torqueRpm?: string | null
    manufacturerEngineCode?: string | null
  },
  transmission?: {
    type?: string | null
    name?: string | null
    drivetrain?: string | null
    availability?: string | null
    automaticType?: string | null
    numberOfSpeeds?: string | null
  }
}

export const initValidationErrors: ValidationErrors = {
  hasUpdate: false,
  name: "name is required",
  make: "make is required",
  model: "model is required",
  modelYear: "model year is required",
  trimLevel: "trim level is required"
}

class VehicleFormValidator {

  errors: ValidationErrors
  vehicleProfile: VehicleProfile | null

  constructor (vehicleProfile:VehicleProfile | null, errors:ValidationErrors) {
    this.vehicleProfile = vehicleProfile;
    this.errors = errors;
  }

  validateName (value: string) {
    if (_.isEmpty(value)) {
      this.errors.name = "name is required";
    } else if (value.length < 2) {
      this.errors.name = "name is invalid";
    } else {
      delete this.errors.name;
    }

    this.setHasUpdate();
  }

  validateMake (value: string) {
    if (_.isEmpty(value)) {
      this.errors.make = "make is required";
    } else if (value.length < 2) {
      this.errors.make = "make is invalid";
    } else {
      delete this.errors.make;
    }

    this.setHasUpdate();
  }

  validateModel (value: string) {
    if (_.isEmpty(value)) {
      this.errors.model = "model is required";
    } else {
      delete this.errors.model;
    }

    this.setHasUpdate();
  }

  validateTrimLevel (value: string) {
    if (_.isEmpty(value)) {
      this.errors.trimLevel = "trim level is required";
    } else {
      delete this.errors.trimLevel;
    }

    this.setHasUpdate();
  }

  validateModelYear (value: number) {
    if (_.isNull(value)) {
      this.errors.modelYear = "model year is required";
    } else if (value < 1900) {
      this.errors.modelYear = "model year should be 1900 or later year";
    } else {
      delete this.errors.modelYear;
    }

    this.setHasUpdate();
  }

  validatePricingMSRP (value: number) {
    if (value < 0) {
      this.errors.pricing = { msrp:"msrp should be greater than or equal to 0" };
    } else {
      delete this.errors.pricing?.msrp;
    }
    this.cleanUpPricingError();
    this.setHasUpdate();
  }

  validateEngineType (value: string) {
    this.setHasUpdate();
  }

  validateEngineName (value: string) {
    this.setHasUpdate();
  }

  validateEngineCylinder (value: number) {
    if (value < 2) {
      this.errors.engine = { cylinder: "cylinder should be larger than 1"};
    } else {
      delete this.errors.engine?.cylinder;
    }
    this.cleanUpEngineError();
    this.setHasUpdate();
  }

  validateEngineDisplacement (value: number) {
    if (value <= 0) {
      this.errors.engine = { displacement: "displacement should be larger than 0"};
    } else {
      delete this.errors.engine?.displacement;
    }
    this.cleanUpEngineError();
    this.setHasUpdate();
  }

  validateEngineFuelType (value: string) {
    this.setHasUpdate();
  }

  validateEngineCode (value: string) {
    this.setHasUpdate();
  }

  validateEngineHorsepower (value: number) {
    if (value <= 0) {
      this.errors.engine = { horsepower: "horsepower should be larger than 0"};
    } else {
      delete this.errors.engine?.horsepower;
    }
    this.cleanUpEngineError();
    this.setHasUpdate();
  }

  validateEngineHorsepowerRpm (value: number) {
    if (value <= 0) {
      this.errors.engine = { horsepowerRpm: "horsepower RPM should be larger than 0"};
    } else {
      delete this.errors.engine?.horsepowerRpm;
    }
    this.cleanUpEngineError();
    this.setHasUpdate();
  }

  validateEngineTorque (value: number) {
    if (value <= 0) {
      this.errors.engine = { torque: "torque should be larger than 0"};
    } else {
      delete this.errors.engine?.torque;
    }
    this.cleanUpEngineError();
    this.setHasUpdate();
  }

  validateEngineTorqueRpm (value: number) {
    if (value <= 0) {
      this.errors.engine = { torqueRpm: "torque RPM should be larger than 0"};
    } else {
      delete this.errors.engine?.torqueRpm;
    }
    this.cleanUpEngineError();
    this.setHasUpdate();
  }

  validateTransmissionName (value: string) {
    this.setHasUpdate();
  }

  validateTransmissionType (value: string) {
    this.setHasUpdate();
  }

  validateTransmissionAutomaticType (value: string) {
    this.setHasUpdate();
  }

  validateTransmissionNumberOfSpeeds (value: number) {
    if (value <= 0) {
      this.errors.transmission = { numberOfSpeeds: "number of speed should be larger than 0"};
    } else {
      delete this.errors.transmission?.numberOfSpeeds;
    }
    this.cleanUpTransmissionError();
    this.setHasUpdate();
  }

  validateTransmissionDrivetrain (value: string) {
    this.setHasUpdate();
  }

  setHasUpdate () {
    this.errors.hasUpdate = true;
  }

  cleanUpPricingError () {
    if (!_.isNil(this.errors.pricing) && Object.values(this.errors.pricing).length == 0) {
      delete this.errors.pricing
    }
  }

  cleanUpEngineError () {
    if (!_.isNil(this.errors.engine) && Object.values(this.errors.engine).length == 0) {
      delete this.errors.engine
    }
  }

  cleanUpTransmissionError () {
    if (!_.isNil(this.errors.transmission) && Object.values(this.errors.transmission).length == 0) {
      delete this.errors.transmission
    }
  }

}

export default VehicleFormValidator;
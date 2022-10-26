import { parsePhoneNumber } from 'react-phone-number-input';
import { get } from 'lodash';
import { UserProfile } from './model/UserProfile';

interface ValidateErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  phone?: string
}

class Validator {
  errors:ValidateErrors
  userProfile:UserProfile

  constructor (userProfile:UserProfile, initialErrors:ValidateErrors) {
    this.errors = initialErrors;
    this.userProfile = userProfile;
  }

  validate(fieldValue:string, fieldName:string) {
    switch (fieldName) {
    case 'username':
      this.validateUsername(fieldValue, this.errors);
      break;
    case 'email':
      this.validateEmail(fieldValue, this.errors);
      break;
    case 'password':
      this.validatePassword(fieldValue, this.errors);
      break;
    case 'confirmPassword':
      this.validateConfirmPassword(this.userProfile.password, fieldValue, this.errors);
      break;
    case 'phone':
      this.validatePhoneNumber(fieldValue, this.errors);
      break;
    default:
    }
    return this.errors;
  }

  validateUsername (username: string, errors: ValidateErrors) {
    if (!username) {
      errors.username = 'Username is Required';
    } else if (username.length < 2) {
      errors.username = 'Minimum 2 characters';
    } else {
      delete errors.username;
    }
  }

  validatePhoneNumber (phone: string, errors: ValidateErrors) {
    const phoneObject = parsePhoneNumber(phone);
    if (phoneObject == null) {
      errors.phone = 'Invalid Phone Number';
    } else {
      delete errors.phone;
    }
  }

  validateEmail (email: string, errors: ValidateErrors) {
    if (!email) {
      errors.email = 'Email is Required';
    } else {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const result = re.test(String(email).toLowerCase());
      if (!result) {
        errors.email = 'Invalid Email address';
      } else {
        delete errors.email
      }
    }
  }

  validatePassword (pass: string | null, errors: ValidateErrors) {
    if (!pass) {
      errors.password = 'Password is Required';
    } else if (pass.length < 6) {
      errors.password = 'Minimum 6 characters.';
    } else if (!/(?=.*[A-Z])/.test(pass)) {
      errors.password = 'At least one upper case letter.';
    } else if (!/^(?=.*[@#$%&])/.test(pass)) {
      errors.password = 'At least one special character.';
    } else if (!/^(?=.*[0-9])/.test(pass)) {
      errors.password = 'At least one number.';
    } else {
      delete errors.password;
    }
  }

  validateConfirmPassword (password: string | undefined, confirmPass: string | undefined, errors: ValidateErrors) {
    if (!confirmPass) {
      errors.confirmPassword = 'Confirm Password is Required';
    } else if (password !== confirmPass) {
      errors.confirmPassword = 'Password does not match';
    } else {
      delete errors.confirmPassword
    }
  }

  getErrors():ValidateErrors {
    return this.errors;
  }
}

// ******************************
export function getCountryCode (phoneNumber: string) {
  return get(parsePhoneNumber(phoneNumber), 'country');
}

export default Validator;

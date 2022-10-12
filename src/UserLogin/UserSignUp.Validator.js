import { parsePhoneNumber } from 'react-phone-number-input';
import { get } from 'lodash';

export class Validator {
  constructor (values, fieldName) {
    const errors = {};

    switch (fieldName) {
    case 'username':
      this.validateUsername(values.username, errors);
      break;
    case 'email':
      this.validateEmail(values.email, errors);
      break;
    case 'password':
      this.validatePassword(values.password, errors);
      break;
    case 'confirmPassword':
      this.validateConfirmPassword(values.password, values.confirmPassword, errors);
      break;
    case 'phone':
      this.validatePhoneNumber(values.phone, errors);
      break;
    default:
    }
    return errors;
  }

  validateUsername (username, errors) {
    if (!username) {
      errors.username = 'Username is Required';
      return false;
    } else if (username.length < 2) {
      errors.username = 'Minimum 2 characters';
      return false;
    }
    return true;
  }

  validatePhoneNumber (phone, errors) {
    const phoneObject = parsePhoneNumber(phone);
    if (!phoneObject) {
      errors.phone = 'Invalid Phone Number';
      return false;
    }
    return true;
  }

  validateEmail (email, errors) {
    if (!email) {
      errors.email = 'Email is Required';
      return false;
    } else {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const result = re.test(String(email).toLowerCase());
      if (!result) {
        errors.email = 'Invalid Email address';
        return false;
      }
    }
    return true;
  }

  validatePassword (pass, errors) {
    if (!pass) {
      errors.password = 'Password is Required';
      return false;
    } else {
      if (!/(?=.*[A-Z])/.test(pass)) {
        errors.password = 'At least one upper case letter.';
        return false;
      }

      if (!/^(?=.*[@#$%&])/.test(pass)) {
        errors.password = 'At least one special character.';
        return false;
      }

      if (!/^(?=.*[0-9])/.test(pass)) {
        errors.password = 'At least one number.';
        return false;
      }

      if (pass.length < 6) {
        errors.password = 'Minimum 6 characters.';
        return false;
      }
    }

    return true;
  }

  validateConfirmPassword (password, confirmPass, errors) {
    if (!confirmPass) {
      errors.confirmPassword = 'Confirm Password is Required';
      return false;
    } else if (password !== confirmPass) {
      errors.confirmPassword = 'Password does not match';
      return false;
    }
    return true;
  }
}

// ******************************
export function getCountryCode (phoneNumber) {
  return get(parsePhoneNumber(phoneNumber), 'country');
}

export default Validator;

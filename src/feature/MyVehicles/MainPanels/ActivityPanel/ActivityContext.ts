import React, {createContext} from 'react';
import { initValidationErrors, ValidationErrors } from './ActivityMaintenance/ActivityMaintForm.Validator';

export type ContextValue = {
  errors: ValidationErrors
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
}

export const ErrorsContext = createContext<ContextValue>({
  errors: initValidationErrors,
  setErrors: (errors) => ({...errors})
});

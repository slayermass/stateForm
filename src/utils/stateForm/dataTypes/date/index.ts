import { isDate } from '../../outerDependencies';
import { StateFormValidatorIsSetType, StateFormValidatorPropertyType } from '../types';

export type StateFormDataTypeDateType = Date;
export type StateFormDataTypeFieldDateType = keyof typeof stateFormDataTypeDateValidators;
export type StateFormDataTypeDateSpecificProperties = Pick<typeof validators, 'minDate' | 'maxDate'> & {
  minDateMessage: string;
  maxDateMessage: string;
};

const validators: {
  isSet: StateFormValidatorIsSetType;
  minDate: StateFormValidatorPropertyType<Date>;
  maxDate: StateFormValidatorPropertyType<Date>;
} = {
  isSet: (value) => isDate(value),
  minDate: (value, minDate) => isDate(value) && value > new Date(minDate),
  maxDate: (value, maxDate) => isDate(value) && value < new Date(maxDate),
};

export const stateFormDataTypeDateValidators: {
  date: typeof validators;
} = {
  date: validators,
};

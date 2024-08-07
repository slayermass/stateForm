import { stateFormInnerValidators, StateFormPossibleValue } from '../setDataTypes';
import { StateFormFieldsType, StateFormInputOptionsType } from '../types';
import { isArray, isBoolean, SafeAnyType } from '../outerDependencies';

// import i18next from 'src/utils/i18n';
const i18next = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  t: (s: string, options: SafeAnyType) => s,
};

export const stateFormErrorsRequiredMessage = 'common.validation.required';
export const stateFormErrorsCommonInvalidMessage = 'common.validation.invalid';

export const formStateGenerateErrors = (
  value: StateFormPossibleValue,
  validationOptions: StateFormInputOptionsType,
  fieldType: StateFormFieldsType,
  name: string,
): string[] => {
  const errorLabel = validationOptions?.errorLabel || name;

  const errorsToSet: string[] = []; // the array for collecting errors

  if (process.env.NODE_ENV === 'development' && !stateFormInnerValidators[fieldType]?.isSet) {
    throw new Error(`Validator is not set for type "${fieldType}"`);
  }

  // "as SafeAnyType" = StateFormPossibleValue -> to the specific type of the validator
  const hasValidValue = !!stateFormInnerValidators[fieldType]?.isSet(value as SafeAnyType);

  if (!hasValidValue && validationOptions?.required) {
    return [validationOptions?.requiredMessage || i18next.t(stateFormErrorsRequiredMessage, { label: errorLabel })];
  }

  /** any other validators except isSet  */
  const innerValidatorsResponse = stateFormInnerValidators[fieldType]?.validate(
    // "as SafeAnyType" = StateFormPossibleValue -> to the specific type of the validator
    value as SafeAnyType,
    validationOptions,
    hasValidValue,
  );

  if (isArray(innerValidatorsResponse)) {
    return [i18next.t(innerValidatorsResponse[0], { label: errorLabel, ...innerValidatorsResponse[1] })];
  }

  if (!innerValidatorsResponse && isBoolean(innerValidatorsResponse)) {
    return [i18next.t(stateFormErrorsCommonInvalidMessage, { label: errorLabel })];
  }

  /** custom validate */
  if (validationOptions?.validate) {
    const validateResponse = validationOptions.validate(value);

    if (validateResponse === false) {
      errorsToSet.push(i18next.t('common.validation.validate', { label: errorLabel }));
    } else if (typeof validateResponse === 'string') {
      errorsToSet.push(validateResponse);
    }
  }

  return errorsToSet;
};

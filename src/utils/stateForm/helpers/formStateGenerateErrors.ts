import { isBoolean } from 'lodash';

import { stateFormDataTypeEmailValidators } from '../dataTypes/email';
import { stateFormDataTypeTextValidators } from '../dataTypes/text';
import { StateFormFieldsType, StateFormInputOptionsType, StateFormPossibleValue } from '../index';
import { SafeAnyType, isValidColor, isString } from '../outerDependencies';

// import i18next from 'src/utils/i18n';
const i18next = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  t: (s: string, options: SafeAnyType) => s,
};

// TODO temporary until all data types are ready
const validators: any = {
  ...stateFormDataTypeTextValidators,
  ...stateFormDataTypeEmailValidators,
};

export const stateFormErrorsRequiredMessage = 'common.validation.required';
export const stateFormErrorsMinLengthMessage = 'common.validation.minLength';
export const stateFormErrorsMaxLengthMessage = 'common.validation.maxLength';

export const formStateGenerateErrors = (
  value: StateFormPossibleValue,
  validationOptions: StateFormInputOptionsType,
  fieldType: StateFormFieldsType,
  name: string,
): string[] => {
  const errorLabel = validationOptions?.errorLabel || name;

  const errorsToSet = []; // the array for collecting errors

  const isTypeMasked = fieldType === 'masked';

  /* email valid pattern */
  if (fieldType === 'email') {
    const setErr = validators.email.pattern(value);

    if (isString(setErr)) {
      return [i18next.t(setErr, { label: errorLabel })];
    }

  }

  /** required */
  if (validationOptions?.required) {
    let setErr: boolean | string = false;

    if (validators[fieldType]?.required) {
      // dynamic check
      const response = validators[fieldType].required(value);

      setErr = isBoolean(response) ? !response : response;
    } else {
      switch (fieldType) {
        case 'masked': {
          /** if the value isn't fully set */
          if (!value || value.toString().includes('_')) {
            setErr = true;
          }
          break;
        }
        case 'number': {
          if (value !== 0 && !value) {
            setErr = true;
          }
          break;
        }
        case 'color': {
          if (!isValidColor(value as SafeAnyType)) {
            setErr = true;
          }
          break;
        }
        case 'tags': {
          if (!value || (value as string[])?.length === 0) {
            setErr = true;
          }
          break;
        }
        default: {
          if (!value) {
            setErr = true;
          }
        }
      }
    }

    if (setErr !== false) {
      /**
       * 1) inner validation message
       * 2) requiredMessage
       * 3) common required text
       */
      errorsToSet.push(
        isString(setErr)
          ? i18next.t(setErr, { label: errorLabel })
          : validationOptions.requiredMessage || i18next.t(stateFormErrorsRequiredMessage, { label: errorLabel }),
      );

      return errorsToSet;
    }
  }

  if (isTypeMasked && value?.toString().includes('_')) {
    /** if the value isn't fully set */
    errorsToSet.push(
      validationOptions?.requiredMessage || i18next.t('common.validation.maskedNotFull', { label: errorLabel }),
    );
  }

  /** minLength */
  if (validationOptions?.minLength) {
    let setErr = false;

    if (validators[fieldType]?.minLength) {
      setErr = !validators[fieldType].minLength(value, validationOptions.minLength);
    } else if ((value || '').toString().length < validationOptions.minLength) {
      setErr = true;
    }

    if (setErr) {
      errorsToSet.push(
        validationOptions.minLengthMessage ||
          i18next.t(stateFormErrorsMinLengthMessage, { label: errorLabel, length: validationOptions.minLength }),
      );
    }
  }

  /** maxLength */
  if (validationOptions?.maxLength) {
    let setErr = false;

    if (validators[fieldType]?.maxLength) {
      setErr = !validators[fieldType].maxLength(value, validationOptions.maxLength);
    } else if ((value || '').toString().length > validationOptions.maxLength) {
      setErr = true;
    }

    if (setErr) {
      errorsToSet.push(
        validationOptions.maxLengthMessage ||
          i18next.t(stateFormErrorsMaxLengthMessage, { label: errorLabel, length: validationOptions.maxLength }),
      );
    }
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

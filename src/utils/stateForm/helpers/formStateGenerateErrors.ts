import { StateFormFieldsType, StateFormInputOptionsType, StateFormPossibleValue } from '../index';
import { isValidEmail, SafeAnyType, isValidColor } from '../outerDependencies';

// import i18next from 'src/utils/i18n';
const i18next = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  t: (s: string, options: SafeAnyType) => s,
};

export const formStateGenerateErrors = (
  value: StateFormPossibleValue,
  validationOptions: StateFormInputOptionsType,
  fieldType: StateFormFieldsType,
  name: string,
): string[] => {
  const errorLabel = validationOptions?.errorLabel || name;

  const errorsToSet = []; // the array for collecting errors

  const isTypeMasked = fieldType === 'masked';

  /** required */
  if (validationOptions?.required) {
    let setErr = false;

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

    if (setErr) {
      errorsToSet.push(
        validationOptions.requiredMessage || i18next.t('common.validation.required', { label: errorLabel }),
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
    if ((value || '').toString().length < validationOptions.minLength) {
      errorsToSet.push(
        validationOptions.minLengthMessage ||
          i18next.t('common.validation.minLength', { label: errorLabel, length: validationOptions.minLength }),
      );
    }
  }

  /** email pattern */
  if (fieldType === 'email' && !isValidEmail(value?.toString() ?? '')) {
    /** always set an error if required or if not but has a value */
    if (validationOptions.required || (!validationOptions.required && value)) {
      errorsToSet.push(i18next.t('common.validation.emailInvalid', { label: errorLabel }));
    }
  }

  /** maxLength */
  if (validationOptions?.maxLength) {
    if ((value || '').toString().length > validationOptions.maxLength) {
      errorsToSet.push(
        validationOptions.maxLengthMessage ||
          i18next.t('common.validation.maxLength', { label: errorLabel, length: validationOptions.maxLength }),
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

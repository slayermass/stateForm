import { stateFormDataTypeDateValidators } from '../dataTypes/date';
import { stateFormDataTypeRichTextValidators } from '../dataTypes/richText';
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
  ...stateFormDataTypeRichTextValidators,
  ...stateFormDataTypeDateValidators,
};

export const stateFormErrorsRequiredMessage = 'common.validation.required';
export const stateFormErrorsCommonInvalidMessage = 'common.validation.invalid';
// only text?
export const stateFormErrorsMinLengthMessage = 'common.validation.minLength';
export const stateFormErrorsMaxLengthMessage = 'common.validation.maxLength';

export const formStateGenerateErrors = (
  value: StateFormPossibleValue,
  validationOptions: StateFormInputOptionsType,
  fieldType: StateFormFieldsType,
  name: string,
): string[] => {
  const errorLabel = validationOptions?.errorLabel || name;

  const errorsToSet: string[] = []; // the array for collecting errors

  const hasValidValue = !!validators[fieldType]?.isSet(value);

  if (!hasValidValue && validationOptions?.required) {
    let setErr = false;

    if (validators[fieldType]?.isSet) {
      setErr = true;
    } else {
      switch (fieldType) {
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
        default: {
          if (!value) {
            setErr = true;
          }
        }
      }
    }

    if (setErr) {
      return [validationOptions?.requiredMessage || i18next.t(stateFormErrorsRequiredMessage, { label: errorLabel })];
    }
  }

  /** check if the fields have valid values  */
  if (hasValidValue && validators[fieldType]?.isValidPattern) {
    const response = validators[fieldType].isValidPattern(value);

    if (isString(response)) {
      return [i18next.t(response, { label: errorLabel })];
    }
    if (!response) {
      return [validationOptions?.requiredMessage || i18next.t(stateFormErrorsRequiredMessage, { label: errorLabel })];
    }
  }

  /** below are optional validators */

  // dynamically go through validators ignoring 'isSet',
  // check if the validate property is set to form,
  // validate and set errors if needed
  Object.keys(validators[fieldType] || {}).forEach((key) => {
    // types?
    const validatorValue = (validationOptions as SafeAnyType)[key];

    if (validatorValue !== undefined) {
      const setErr = !validators[fieldType][key](value, validatorValue);

      if (setErr) {
        errorsToSet.push(
          (validationOptions as SafeAnyType)[`${key}Message`] ||
            i18next.t(stateFormErrorsCommonInvalidMessage, { label: errorLabel }),
        );
      }
    }
  });

  /**
   * minLength
   * @deprecated
   */
  // if (validationOptions?.minLength) {
  //   let setErr = false;
  //
  //   if (validators[fieldType]?.minLength) {
  //     setErr = !validators[fieldType].minLength(value, validationOptions.minLength);
  //   } else if ((value || '').toString().length < validationOptions.minLength) {
  //     setErr = true;
  //   }
  //
  //   if (setErr) {
  //     errorsToSet.push(
  //       validationOptions.minLengthMessage ||
  //         i18next.t(stateFormErrorsMinLengthMessage, { label: errorLabel, length: validationOptions.minLength }),
  //     );
  //   }
  // }

  /**
   * maxLength
   * @deprecated
   */
  // if (validationOptions?.maxLength) {
  //   let setErr = false;
  //
  //   if (validators[fieldType]?.maxLength) {
  //     setErr = !validators[fieldType].maxLength(value, validationOptions.maxLength);
  //   } else if ((value || '').toString().length > validationOptions.maxLength) {
  //     setErr = true;
  //   }
  //
  //   if (setErr) {
  //     errorsToSet.push(
  //       validationOptions.maxLengthMessage ||
  //         i18next.t(stateFormErrorsMaxLengthMessage, { label: errorLabel, length: validationOptions.maxLength }),
  //     );
  //   }
  // }

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

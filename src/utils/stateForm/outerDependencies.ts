// libraries
import merge from 'lodash/merge';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import set from 'lodash/set';
import isPlainObject from 'lodash/isPlainObject';
import has from 'lodash/has';
import equal from 'fast-deep-equal';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import unset from 'lodash/unset';
import isDate from 'lodash/isDate';
import isBoolean from 'lodash/isBoolean';
import { diff } from 'deep-object-diff';

// types
import { DeepPartial, ChildrenPropType, NullableUndefineable } from 'src/utils/types';
import { getUniqueId } from 'src/utils/getUniqueId';
import { SafeAnyType } from 'src/utils/safeAny';

// local
import { createArrayXLength } from 'src/utils/objects';
import { useMemoObject } from 'src/hooks/useMemoObject';
import { isValidEmail } from 'src/utils/email';
import { isValidColor } from 'src/utils/validators';
import { isBigInt } from 'src/utils/numbers';

export {
  getUniqueId,
  merge,
  get,
  isEmpty,
  isFunction,
  set,
  isPlainObject,
  has,
  equal,
  isString,
  isArray,
  isNumber,
  diff,
  unset,
  createArrayXLength,
  useMemoObject,
  isValidEmail,
  isValidColor,
  isDate,
  isBigInt,
  isBoolean,
};

export type { DeepPartial, SafeAnyType, ChildrenPropType, NullableUndefineable };

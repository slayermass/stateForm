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
import unset from 'lodash/unset';
import isDate from 'lodash/isDate';
import { diff } from 'deep-object-diff';

// types
import { DeepPartial, ChildrenPropType } from 'src/utils/types';
import { getUniqueId } from 'src/utils/getUniqueId';
import { SafeAnyType } from 'src/utils/safeAny';
import { NullableUndefineable } from 'src/utils/types';

// local
import { createArrayXLength } from 'src/utils/objects';
import { useMemoObject } from 'src/hooks/useMemoObject';
import { isValidEmail } from 'src/utils/email';
import { isValidColor } from 'src/utils/validators';

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
  diff,
  unset,
  createArrayXLength,
  useMemoObject,
  isValidEmail,
  isValidColor,
  isDate,
};

export type { DeepPartial, SafeAnyType, ChildrenPropType, NullableUndefineable };

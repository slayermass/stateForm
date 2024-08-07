import { useContext } from 'react';

import { StateFormUnknownFormType } from '../types';
import { StateFormReturnType } from '../index';
import { StateFormContext } from './index';
import { SafeAnyType } from '../outerDependencies';

export const useStateFormContext = <
  FormValues extends StateFormUnknownFormType = SafeAnyType,
>(): StateFormReturnType<FormValues> => useContext(StateFormContext) as StateFormReturnType<FormValues>;

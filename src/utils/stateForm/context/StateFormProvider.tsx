import { FC } from 'react';

import { StateFormReturnType } from '../index';
import { StateFormContext } from './index';
import { ChildrenPropType } from '../outerDependencies';

type Props = {
  formProps: StateFormReturnType;
  children: ChildrenPropType;
};

export const StateFormProvider: FC<Props> = ({ formProps, children }) => (
  <StateFormContext.Provider value={formProps}>{children}</StateFormContext.Provider>
);

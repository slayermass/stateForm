import { unset } from '../outerDependencies';
import { stateFormSubscriptions } from './common';

export const stateFormClearSubscriptions = (formId: string): boolean => unset(stateFormSubscriptions, formId);

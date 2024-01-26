import { SafeAnyType } from '../outerDependencies';

export type StateFormEventType = 'change' | 'error';

export type StateFormFieldNamePathType = [formId: string, eventType: StateFormEventType, fieldName: string];

export const stateFormSubscriptions: Record<
  string,
  { change: Record<string, SafeAnyType>; error: Record<string, SafeAnyType> }
> = {};

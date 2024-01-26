import { createContext } from 'react';
import { StateFormReturnType } from '../index';

export const StateFormContext = createContext<StateFormReturnType | null>(null);
StateFormContext.displayName = 'StateFormContext';

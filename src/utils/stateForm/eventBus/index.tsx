import set from 'lodash/set';
import unset from 'lodash/unset';
import get from 'lodash/get';

import { SafeAnyType } from 'src/utils/safeAny';
import { getUniqueId } from 'src/utils/getUniqueId';

export type EventBusFieldEventType = 'change' | 'error';

export type EventBusReturnType = {
  on: (
    fieldName: string,
    type: EventBusFieldEventType,
    callback: (value: SafeAnyType, name: string) => void,
    id?: string,
  ) => () => void;
  emit: (fieldName: string, type: EventBusFieldEventType, value: SafeAnyType) => void;
};

type TestHelpersType = {
  getEvents: () => Record<SafeAnyType, SafeAnyType>;
  testOn: (...args: Parameters<EventBusReturnType['on']>) => [string, ReturnType<EventBusReturnType['on']>];
};

export type EventBusReturnTestType = EventBusReturnType & TestHelpersType;

export const getEventBus: () => EventBusReturnType = () => {
  const events: Record<string, (value: SafeAnyType, name: string) => void> = {};

  return {
    on(fieldName, type, callback, id = getUniqueId()) {
      set(events, [`${fieldName}_${type}`, id], callback);

      return () => {
        unset(events, [`${fieldName}_${type}`, id]);

        if (!Object.values(get(events, `${fieldName}_${type}`, {})).length) {
          unset(events, [`${fieldName}_${type}`]);
        }
      };
    },
    emit(fieldName, type, value) {
      const callbacks = get(events, `${fieldName}_${type}`);

      if (callbacks) {
        Object.values(callbacks).forEach((callback) => callback(value, fieldName));
      }
    },

    ...(process.env.NODE_ENV === 'test'
      ? ({
          getEvents: () => events,
          testOn(fieldName, type, callback) {
            const id = getUniqueId();

            const unsub = this.on.call(null, fieldName, type, callback, id);

            return [id, unsub];
          },
        } as EventBusReturnTestType)
      : {}),
  };
};

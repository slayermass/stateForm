import { EventBusReturnTestType, getEventBus, EventBusFieldEventType } from 'src/utils/stateForm/eventBus';

describe('eventBus', () => {
  let eventBus = getEventBus() as EventBusReturnTestType;

  beforeEach(() => {
    eventBus = getEventBus() as EventBusReturnTestType;
  });

  const callback = jest.fn();
  let fieldName = '';
  let type: EventBusFieldEventType = 'change';
  let value = '';
  const getTests = () => {
    it('on', () => {
      const [id] = eventBus.testOn(fieldName, type, callback);

      expect(eventBus.getEvents()).toEqual({ [`${fieldName}_${type}`]: { [id]: callback } });
      expect(callback).not.toHaveBeenCalled();
    });

    it('emit', () => {
      const [id] = eventBus.testOn(fieldName, type, callback);

      eventBus.emit(fieldName, type, value);

      expect(eventBus.getEvents()).toEqual({ [`${fieldName}_${type}`]: { [id]: callback } });
      expect(callback).toHaveBeenCalledWith(value, fieldName);

      callback.mockClear();

      // not exists field event
      eventBus.emit('someField', type, 'someValue');

      expect(callback).not.toHaveBeenCalled();
    });

    it('clear', () => {
      const [id] = eventBus.testOn(fieldName, type, callback);

      expect(eventBus.getEvents()).toEqual({ [`${fieldName}_${type}`]: { [id]: callback } });

      eventBus.clear();

      expect(eventBus.getEvents()).toEqual({});
    });

    it('detach', () => {
      const [id, detach] = eventBus.testOn(fieldName, type, callback);

      expect(eventBus.getEvents()).toEqual({ [`${fieldName}_${type}`]: { [id]: callback } });

      detach();

      expect(eventBus.getEvents()).toEqual({});
    });

    it('multiple subscriptions for one field', () => {
      const [id, detach] = eventBus.testOn(fieldName, type, callback);
      const [id2] = eventBus.testOn(fieldName, type, callback);

      expect(eventBus.getEvents()).toEqual({
        [`${fieldName}_${type}`]: {
          [id]: callback,
          [id2]: callback,
        },
      });

      eventBus.emit(fieldName, type, value);

      expect(callback).toHaveBeenCalledWith(value, fieldName);
      expect(callback).toHaveBeenCalledTimes(2);

      detach();

      expect(eventBus.getEvents()).toEqual({
        [`${fieldName}_${type}`]: {
          [id2]: callback,
        },
      });
    });

    it('subscriptions for multiple field', () => {
      const fieldName2 = 'test2.lol.kek';
      const value2 = 100;
      const callback2 = jest.fn();

      const [id, detach] = eventBus.testOn(fieldName, type, callback);
      const [id2, detach2] = eventBus.testOn(fieldName2, type, callback2);

      expect(eventBus.getEvents()).toEqual({
        [`${fieldName}_${type}`]: { [id]: callback },
        [`${fieldName2}_${type}`]: { [id2]: callback2 },
      });

      eventBus.emit(fieldName, type, value);

      expect(callback).toHaveBeenCalledWith(value, fieldName);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();

      callback.mockClear();
      callback2.mockClear();

      // secondary field emit
      eventBus.emit(fieldName2, type, value2);

      expect(callback2).toHaveBeenCalledWith(value2, fieldName2);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback).not.toHaveBeenCalled();

      detach();

      expect(eventBus.getEvents()).toEqual({
        [`${fieldName2}_${type}`]: {
          [id2]: callback2,
        },
      });

      detach2();

      expect(eventBus.getEvents()).toEqual({});
    });
  };

  describe('change type', () => {
    beforeEach(() => {
      callback.mockClear();
      fieldName = 'test.change';
      type = 'change';
      value = 'value';
    });

    getTests();
  });

  describe('error type', () => {
    beforeEach(() => {
      callback.mockClear();
      fieldName = 'test.error';
      type = 'error';
      value = 'error message';
    });

    getTests();
  });
});

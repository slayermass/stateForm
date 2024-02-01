// can't clone bigInt, NaN, Infinity and -Infinity
// export const formStateInnerCloneDeep: <R>(value: R) => R = (value) => {
//   try {
//     return JSON.parse(JSON.stringify(value));
//   } catch (e) {
//     // eslint-disable-next-line no-console
//     console.error(e);
//     return value;
//   }
// };

import structuredClone from '@ungap/structured-clone';

export const formStateInnerCloneDeep: <R>(value: R) => R = (value) => structuredClone(value);

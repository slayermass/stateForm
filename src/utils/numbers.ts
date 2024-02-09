import { SafeAnyType } from './safeAny';

export const isBigInt = (value: SafeAnyType) => typeof value === 'bigint';
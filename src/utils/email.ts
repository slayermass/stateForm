import { EMAIL_PATTERN } from 'src/config';

export const isValidEmail = (str: string): boolean => EMAIL_PATTERN.test(str);

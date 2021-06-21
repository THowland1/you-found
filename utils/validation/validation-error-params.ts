import { ValidationErrorCode } from './validation-error-code';
import { VALIDATION_ERROR_MESSAGES } from './validation-error-messages';

export type ValidationErrorParams<TCode extends ValidationErrorCode> =
  Parameters<typeof VALIDATION_ERROR_MESSAGES[TCode]>;

import { ValidationErrorCode } from './validation-error-code';
import { VALIDATION_ERROR_MESSAGES } from './validation-error-messages';
import { ValidationErrorParams } from './validation-error-params';

export class ValidationError<TCode extends ValidationErrorCode> extends Error {
  constructor(code: TCode, ...params: ValidationErrorParams<TCode>) {
    super();
    this.code = code;
    this.message = this.formatErrorMessage(code, params);
  }
  code: ValidationErrorCode;

  private formatErrorMessage(
    code: TCode,
    params: ValidationErrorParams<TCode>
  ) {
    const fn = VALIDATION_ERROR_MESSAGES[code];

    // @ts-ignore This does work, its just too much Generics gymnastics for TS to handle
    return fn(...params);
  }
}

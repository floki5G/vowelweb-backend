import { IExtendableErrorConstructor } from '../../interfaces/errors';

class ExtendableError extends Error {
  is_relogin: boolean;

  code: string | undefined;

  constructor({ code, message, is_relogin }: IExtendableErrorConstructor) {
    if (new.target === ExtendableError) {
      throw new TypeError('Abstract class "ExtendableError" cannot be instantiated directly.');
    }

    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.is_relogin = is_relogin || false;
    this.code = code || undefined;

    // Set the prorotype explicitly
    Object.setPrototypeOf(this, ExtendableError.prototype);
  }
}

export default ExtendableError;

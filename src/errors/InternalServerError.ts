import { IExtendableErrorConstructor } from '../../interfaces/errors';
import ExtendableError from './ExtendableError';

// 500 Internal Server Error
class InternalServerError extends ExtendableError {
  constructor(props: IExtendableErrorConstructor) {
    super({
      message: props.message || 'Internal Server Error',
      code: props.code || '500',
      is_relogin: props.is_relogin || false
    });

    // Set the prorotype explicitly
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export default InternalServerError;

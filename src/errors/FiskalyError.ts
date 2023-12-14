import { IExtendableErrorConstructor } from '../../interfaces/errors';
import ExtendableError from './ExtendableError';

// 400 Bad Request
class FiskalyError extends ExtendableError {
  constructor(props: IExtendableErrorConstructor) {
    super({
      message: props.message || 'Forbidden',
      code: props.code || '403',
      is_relogin: props.is_relogin || false
    });

    // Set the prorotype explicitly
    Object.setPrototypeOf(this, FiskalyError.prototype);
  }
}

export default FiskalyError;

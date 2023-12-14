import { IExtendableErrorConstructor } from '../../interfaces/errors';
import ExtendableError from './ExtendableError';

// 401 Unauthorized
class Unauthorized extends ExtendableError {
  constructor(props: IExtendableErrorConstructor) {
    super({
      message: props.message || 'Unauthorized',
      code: props.code || '401',
      is_relogin: props.is_relogin || false
    });

    // Set the prorotype explicitly
    Object.setPrototypeOf(this, Unauthorized.prototype);
  }
}

export default Unauthorized;

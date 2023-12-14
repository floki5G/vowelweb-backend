import { IExtendableErrorConstructor } from '../../interfaces/errors';
import ExtendableError from './ExtendableError';

// 404 Not Found
class NotFound extends ExtendableError {
  constructor(props: IExtendableErrorConstructor) {
    super({
      message: props.message || 'Not Found',
      code: props.code || '404',
      is_relogin: props.is_relogin || false
    });

    // Set the prorotype explicitly
    Object.setPrototypeOf(this, NotFound.prototype);
  }
}

export default NotFound;

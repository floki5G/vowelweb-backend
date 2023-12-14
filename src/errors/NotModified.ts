import { IExtendableErrorConstructor } from '../../interfaces/errors';
import ExtendableError from './ExtendableError';

// ! 304 Not Modified
class NotModified extends ExtendableError {
  constructor(props: IExtendableErrorConstructor) {
    super({
      message: props.message || 'Not RequestModified',
      code: props.code || '304',
      is_relogin: props.is_relogin || false
    });

    // Set the prorotype explicitly
    Object.setPrototypeOf(this, NotModified.prototype);
  }
}

export default NotModified;

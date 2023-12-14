import { IExtendableErrorConstructor } from '../../interfaces/errors';
import ExtendableError from './ExtendableError';

// 422 Unprocessable Entity
class UnprocessableEntity extends ExtendableError {
  constructor(props: IExtendableErrorConstructor) {
    super({
      message: props.message || 'Unprocessable Entity',
      code: props.code || '422',
      is_relogin: props.is_relogin || false
    });

    // Set the prorotype explicitly
    Object.setPrototypeOf(this, UnprocessableEntity.prototype);
  }
}

export default UnprocessableEntity;

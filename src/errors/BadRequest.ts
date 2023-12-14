import { IExtendableErrorConstructor } from "../../interfaces/errors";
import ExtendableError from "./ExtendableError";

// ! 400 Bad Request
class BadRequest extends ExtendableError {
  constructor(props: IExtendableErrorConstructor) {
    super({
      message: props.message || "Bad Request",
      code: props.code || "400",
      is_relogin: props.is_relogin || false,
    });

    // Set the prorotype explicitly
    Object.setPrototypeOf(this, BadRequest.prototype);
  }
}

export default BadRequest;

import { Response } from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import BadRequest from './BadRequest';
import Forbidden from './Forbidden';
import NotFound from './NotFound';
import Unauthorized from './Unauthorized';
import UnprocessableEntity from './UnproccessableEntity';
import FiskalyError from './FiskalyError';
import NotModified from './NotModified';

export interface IResponseErrorObject {
  stack: string;
  message: string;
  name: string;
  code: string;
}

/**
 *@param {IResponseErrorObject} err Error Object
 * @param {Express.Response} res Object to send response to user
 * @returns {void} return correspond response to user
 */
const errorHandleManager = (err: IResponseErrorObject, res: Response) => {
  let error = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
  let message = err.message ?? getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
  let status_code = StatusCodes.INTERNAL_SERVER_ERROR;
  let is_relogin = false;

  // ! 304
  if (err instanceof NotModified) {
    error = getReasonPhrase(StatusCodes.NOT_MODIFIED);
    message = err.message;
    status_code = StatusCodes.NOT_MODIFIED;
  }

  // ! 400
  if (err instanceof BadRequest || err instanceof Joi.ValidationError || err instanceof FiskalyError) {
    error = getReasonPhrase(StatusCodes.BAD_REQUEST);
    message = err.message.split('"').join('');
    status_code = StatusCodes.BAD_REQUEST;
  }

  // ! 401
  if (err instanceof Unauthorized) {
    error = getReasonPhrase(StatusCodes.UNAUTHORIZED);
    message = err.message;
    status_code = StatusCodes.UNAUTHORIZED;
    is_relogin = err.is_relogin;
  }

  // ! 403
  if (err instanceof Forbidden) {
    error = getReasonPhrase(StatusCodes.FORBIDDEN);
    message = err.message;
    status_code = StatusCodes.FORBIDDEN;
    is_relogin = err.is_relogin;
  }

  // ! 404
  if (err instanceof NotFound) {
    error = getReasonPhrase(StatusCodes.NOT_FOUND);
    message = err.message;
    status_code = StatusCodes.NOT_FOUND;
  }

  // ! 429
  if (err instanceof UnprocessableEntity) {
    error = getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY);
    message = err.message;
    status_code = StatusCodes.UNPROCESSABLE_ENTITY;
  }

  // ! 500 and related errors
  if (status_code === 500) {
    switch (err.code) {
      case 'ER_TRUNCATED_WRONG_VALUE':
      case 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD': {
        error = getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY);
        message = 'Give proper input values.';
        status_code = StatusCodes.UNPROCESSABLE_ENTITY;

        break;
      }
      default:
    }

    // ? print any kind of unsuccessful response
    console.log('error ', err);
  } // ? print any kind of unsuccessful response
  else console.log({ code: status_code, message, error, trace: err?.stack, level: 'info' });

  const error_code = err.code || `${status_code}`;

  // ? Return response to front end.
  return res.status(status_code).json({
    status: 'error',
    error,
    message,
    is_relogin,
    error_code,
    status_code
  });
};

export default errorHandleManager;

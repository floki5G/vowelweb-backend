import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import errorHandleManager, { IResponseErrorObject } from '../errors/index';

/**
 * ? Base validation of validators
 * @param {Joi.ObjectSchema<any>} schema Schema of joi validator
 * @param {Express.Response} res Response object of Express
 * @param {Express.Next} next Nex function of middleware Epxress
 * @returns validation of route
 */
const requestSchemaValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
  schema: Joi.Schema,
  optional?: {
    is_query?: boolean;
    query_schema?: Joi.Schema;
    is_param?: boolean;
    param_shema?: Joi.Schema;
    callback?: () => Promise<void>;
  }
) => {
  try {
    if (optional?.is_query && optional?.query_schema) await optional?.query_schema.validateAsync(req.query);

    if (optional?.is_param && optional.param_shema) await optional?.param_shema.validateAsync(req.params);

    await schema.validateAsync(req.body);

    // ? additional check
    if (optional?.callback) await optional.callback();

    return next();
  } catch (err: unknown) {
    return errorHandleManager(err as IResponseErrorObject, res);
  }
};

export default requestSchemaValidator;

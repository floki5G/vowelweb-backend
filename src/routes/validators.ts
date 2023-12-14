import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import requestSchemaValidator from "../middlewares/validator";


// ? validate request body for post items

export const validatePostItems = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
    });
    requestSchemaValidator(req, res, next, schema);
}

// ? validate request body for update items

export const validateUpdateItems = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().optional(),
        price: Joi.number().optional(),
        description: Joi.string().optional(),
        category: Joi.string().optional(),
    });
    requestSchemaValidator(req, res, next, schema);
}

// ? validate request body for delete items

export const validateDeleteItems = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({});

    const param_shema = Joi.object({
        id: Joi.string().required(),
    });

    requestSchemaValidator(req, res, next, schema, {
        is_param: true,
        param_shema,
    });
}


// ? validate request body for get items by id

export const validateGetItemsById = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({});

    const param_shema = Joi.object({
        id: Joi.string().required(),
    });

    requestSchemaValidator(req, res, next, schema, {
        is_param: true,
        param_shema,
    });
}

// ? validate request body for get all items

export const validateGetAllItems = (req: Request, res: Response, next: NextFunction) => {
    // ? validate request body for get all items by page and limit from params
    const schema = Joi.object({});

    const param_shema = Joi.object({
        type: Joi.string().valid("all", "single",'multiple','ascending','descending').required(),
        offset: Joi.number().required(),
    });

    requestSchemaValidator(req, res, next, schema, {
        is_param: true,
        param_shema,
    });
}
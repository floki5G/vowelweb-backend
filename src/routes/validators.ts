import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import requestSchemaValidator from "../middlewares/validator";


export const categoryValidator = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const object = Joi.object({
        category_id: Joi.number().optional(),
        name: Joi.string().required(),
        is_active: Joi.boolean().required(),
        is_disabled: Joi.boolean().required(),
        is_new: Joi.boolean().required(),
    });
    await requestSchemaValidator(req, res, next, object);
};


export const productValidator = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const object = Joi.object({
        category_id: Joi.number().required(),
        product_id: Joi.number().optional(),
        name: Joi.string().required(),
        price: Joi.number().required(),
        is_active: Joi.boolean().required(),
        is_disabled: Joi.boolean().required(),
    });
    await requestSchemaValidator(req, res, next, object);
};

export const categoryProductValidator = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const object = Joi.object({
        id: Joi.number().optional(),
        category_id: Joi.number().required(),
        product_id: Joi.number().required(),
        is_active: Joi.boolean().required(),
        is_disabled: Joi.boolean().required(),
        is_new: Joi.boolean().required(),
    });
    await requestSchemaValidator(req, res, next, object);
} 

export const validateorder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const object = Joi.object({
        amount: Joi.number().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().required(),
        phone_no: Joi.string().required(),
        address_line: Joi.string().required(),
        shipping_address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipcode: Joi.string().required(),
    });
    await requestSchemaValidator(req, res, next, object);
}

export const validateCapturePayment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const object = Joi.object({
        orderCreationId: Joi.string().required(),
        razorpayPaymentId: Joi.string().required(),
        razorpayOrderId: Joi.string().required(),
        razorpaySignature: Joi.string().required(),
    });
    await requestSchemaValidator(req, res, next, object);
}
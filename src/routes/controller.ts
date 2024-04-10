import { NextFunction, Request, Response } from "express";
import pool from "../db/connect";
import { IResponseErrorObject } from "../errors";
import errorHandleManager from "../errors";
import { ICategory, ICategoryProduct, IProduct } from "./types";
const crypto = require("crypto");
import { v4 as uuidv4 } from "uuid";
import Razorpay from "razorpay";
import { date } from "joi";

/**
 * @description Controller for the routes
 * @file controller.ts
 * /v1/api/admin/category/upsert
 * @Method POST
 */
export const upsertCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category_id, name, is_active, is_disabled, is_new } =
      req.body as ICategory;
    // Use INSERT ... ON DUPLICATE KEY UPDATE query
    const [result] = await pool.query(
      `INSERT INTO category (category_id, name, is_active, is_disabled, is_new) 
             VALUES (?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             name = VALUES(name), 
             is_active = VALUES(is_active), 
             is_disabled = VALUES(is_disabled), 
             is_new = VALUES(is_new)`,
      [category_id, name, is_active, is_disabled, is_new]
    );

    if (result.insertId) {
      // Inserted new category
      return res.status(200).json({
        status: "success",
        data: {
          category_id: result.insertId,
          name,
          is_active,
          is_disabled,
          is_new,
        },
        message: "Category added successfully",
      });
    } else {
      // Updated existing category
      return res.status(200).json({
        status: "success",
        data: { category_id, name, is_active, is_disabled, is_new },
        message: "Category updated successfully",
      });
    }
  } catch (err) {
    const error = err as IResponseErrorObject;

    return errorHandleManager(error, res);
  }
};

/**
 * @description Controller for the routes
 * @file controller.ts
 * /v1/api/admin/product/upsert
 * @Method POST
 */
export const upsertProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product_id, name, price, is_active, is_disabled, category_id } =
      req.body as IProduct & { category_id: number };

    // ? if product_id is not provided, insert new product else update existing product based on product_id
    const [result] = await pool.query(
      `INSERT INTO product (product_id, name, price, is_active, is_disabled) 
             VALUES (?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             name = VALUES(name), 
             price = VALUES(price), 
             is_active = VALUES(is_active), 
             is_disabled = VALUES(is_disabled)
            `,
      [product_id, name, price, is_active, is_disabled]
    );

    if (result.insertId) {
      // Inserted new product_category
      await pool.query(
        `INSERT INTO product_category (product_id, category_id
            , is_disabled) VALUES (?, ?)`,
        [result.insertId, category_id]
      );
    } else {
      // Updated existing product_category
      await pool.query(
        `UPDATE product_category SET category_id = ? WHERE product_id = ?`,
        [category_id, product_id]
      );
    }

    res.status(200).json({
      status: "success",
      data: { product_id, name, price, is_active, is_disabled, category_id },
      message: "Product added successfully",
    });
  } catch (err) {
    const error = err as IResponseErrorObject;

    return errorHandleManager(error, res);
  }
};

/**
 * @description Controller for the routes
 * @file controller.ts
 * /v1/api/admin/product_category/upsert
 * @Method POST
 */
export const upsertCategoryProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, product_id, category_id, is_active, is_disabled } =
      req.body as ICategoryProduct;
    // Use INSERT ... ON DUPLICATE KEY UPDATE query
    const [result] = await pool.query(
      `INSERT INTO product_category (id, product_id, category_id, is_active, is_disabled) 
             VALUES (?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             product_id = VALUES(product_id), 
             category_id = VALUES(category_id), 
             is_active = VALUES(is_active), 
             is_disabled = VALUES(is_disabled)`,
      [id, product_id, category_id, is_active, is_disabled]
    );

    if (result.insertId) {
      // Inserted new product_category
      return res.status(200).json({
        status: "success",
        data: {
          id: result.insertId,
          product_id,
          category_id,
          is_active,
          is_disabled,
        },
        message: "Category Product added successfully",
      });
    } else {
      // Updated existing product_category
      return res.status(200).json({
        status: "success",
        data: { id, product_id, category_id, is_active, is_disabled },
        message: "Category Product updated successfully",
      });
    }
  } catch (err) {
    const error = err as IResponseErrorObject;

    return errorHandleManager(error, res);
  }
};

/**
 * @description Controller to get menu
 * @file controller.ts
 * /v1/api/admin/menu
 * @Method GET
 */
export const getMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [categories] = await pool.query(`SELECT * FROM category`);
    const [products] = await pool.query(`SELECT * FROM product`);
    const [categoryProducts] = await pool.query(
      `SELECT * FROM product_category`
    );

    // ? append products_id to categories
    const menu = categories.map((category: ICategory) => {
      const categoryProduct = categoryProducts.filter(
        (categoryProduct: ICategoryProduct) =>
          categoryProduct.category_id === category.category_id
      );
      const products_id = categoryProduct.map(
        (categoryProduct: ICategoryProduct) => {
          const product = products.find(
            (product: IProduct) =>
              product.product_id === categoryProduct.product_id
          );

          return product?.product_id;
        }
      );

      return {
        ...category,
        products_id,
      };
    });
    return res.status(200).json({
      status: "success",
      data: {
        categories: menu,
        products: products,
      },
      message: "Menu fetched successfully",
    });
  } catch (err) {
    const error = err as IResponseErrorObject;

    return errorHandleManager(error, res);
  }
};

/**
 * @description Controller to create payment intent
 * @file controller.ts
 * /v1/api/admin/pay
 * @Method POSTRESPMSG
 */
export const createOrderIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    amount,
    first_name,
    last_name,
    email,
    phone_no,
    shipping_address,
    address_line,
    city,
    state,
    zipcode,
  } = req.body;

  // Configure Paytm credentials
  try {
    const uuid = uuidv4();
    // initializing razorpay
    const razorpay = new Razorpay({
      key_id: "rzp_test_3tAiiSDYdPzpZy",
      key_secret: "PWMbASrYQ2UNnRPsQLjBxztM",
    });
    const receipt = uuidv4();

    // setting up options for razorpay order.
    const options = {
      amount,
      currency: "INR",
      receipt,
      payment_capture: 1,
    };
    try {
      const response = await razorpay.orders.create(options);

      if (response.id) {
        // ? insert into orders table
        const insert = await pool.query(
          `INSERT INTO orders (order_id, amount, currency, receipt, first_name, last_name, email, phone_no, shipping_address, address_line, city, state, zipcode,status) 
            VALUES (?,
                    ?, 
                    ?, 
                    ?, 
                    ?, 
                    ?, 
                    ?, 
                    ?, 
                    ?, 
                    ?, 
                    ?, 
                    ?, 
                    ?,?)`,
          [
            response.id,
            response.amount,
            response.currency,
            receipt,
            first_name,
            last_name,
            email,
            phone_no,
            shipping_address,
            address_line,
            city,
            state,
            zipcode,
            "PENDING",
          ]
        );
      }
      res.json({
        order_id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send("Not able to create order. Please try again!");
    }
  } catch (err) {
    const error = err as IResponseErrorObject;

    return errorHandleManager(error, res);
  }
};

/**
 * @description Controller to payment capture
 * @file controller.ts
 */
export const capturePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", "PWMbASrYQ2UNnRPsQLjBxztM");

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature) {
      return res.status(400).json({
        status: "failure",
        message: "Transaction not legit!",
      });
    } else {
      // ? update the order status and status_msg
      await pool.query(
        `UPDATE orders SET status = ?, status_msg = ? WHERE order_id = ?`,
        ["COMPLETED", "Payment Completed Successfully", razorpayOrderId]
      );
    }

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    // res.json({
    //     status: "success",
    //     msg: "success",
    //     orderId: razorpayOrderId,
    //     paymentId: razorpayPaymentId,
    // });

    res.status(200).json({
      status: "success",
      date: {
        order_id: razorpayOrderId,
        payment_id: razorpayPaymentId,
      },

      message: "Payment Completed Successfully",
    });
  } catch (err) {
    const error = err as IResponseErrorObject;
    return errorHandleManager(error, res);
  }
};


/**
 * @description Controller to get orders
 * @file controller.ts
 * /v1/api/admin/orders
 * @Method GET
 */
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        // ? get all completed orders
        const [orders] = await pool.query(`SELECT * FROM orders WHERE status = ?`, ["COMPLETED"]);
        return res.status(200).json({
        status: "success",
        data: orders,
        message: "Orders fetched successfully",
        });
    } catch (err) {
        const error = err as IResponseErrorObject;
    
        return errorHandleManager(error, res);
    }
    }
import { Router } from "express";
import { capturePayment, createOrderIntent, getMenu, getOrders, upsertCategory, upsertCategoryProduct, upsertProduct } from "./controller";
import { categoryProductValidator, categoryValidator, productValidator, validateCapturePayment, validateorder } from "./validators";
const adminRouter = Router();

/**
 * @description Router for the routes
 * @file index.ts
 * /v1/api/admin/category/upsert
 */

adminRouter.post("/category/upsert", categoryValidator, upsertCategory);
/**
 * @description Router for the routes
 * @file index.ts
 * /v1/api/admin/product/upsert
 * @Method POST
 */
adminRouter.post("/product/upsert", productValidator, upsertProduct);

/**
 * @description Router for the routes
 * @file index.ts
 * /v1/api/admin/category-product/upsert
 * @Method POST
 */
adminRouter.post("/category-product/upsert", categoryProductValidator, upsertCategoryProduct);


/**
 * @description Router for the routes
 * @file index.ts
 * /v1/api/admin/menu
 * @Method GET
 */
adminRouter.get("/menu", getMenu);


/**
 * 
 */
adminRouter.post('/order', validateorder, createOrderIntent)
adminRouter.post('/payment-capture', validateCapturePayment, capturePayment)
adminRouter.get('/orders', getOrders)

export default adminRouter;
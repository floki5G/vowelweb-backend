import { Router } from "express";
import { deleteItems, getAllItems, getItemsById, postItems, updateItems } from "./controller";
import { validateDeleteItems, validateGetAllItems, validateGetItemsById, validatePostItems, validateUpdateItems } from "./validators";
const adminRouter = Router();

adminRouter.get(
  "/items/:type/:offset", validateGetAllItems, getAllItems
);
adminRouter.delete(
  "/items/delete/:id", validateDeleteItems, deleteItems

);
adminRouter.post("/items/create", validatePostItems, postItems);

adminRouter.get("/items/:id", validateGetItemsById, getItemsById);

adminRouter.post("/items/update", validateUpdateItems, updateItems);
export default adminRouter;

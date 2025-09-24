import express from 'express';
import {getAllItems , getItem , addItem , putItem , deleteItem , getExpiredItem , getNewItemsWeek , getLowStockWeek} from "../controllers/inventoryController.js";
const router = express.Router();

router.get("/",getAllItems);
router.get("/items/:id", getItem);
router.post("/items", addItem);
router.put("/items/:id" , putItem);
router.delete("/items/:id", deleteItem);
router.get("/expired_items" , getExpiredItem);
router.get("/new_items_added" ,getNewItemsWeek);
router.get("/get_lowstock_items", getLowStockWeek)

export default router;

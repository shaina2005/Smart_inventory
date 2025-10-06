import express from "express";
import {
  getAllItems,
  getItem,
  addItem,
  putItem,
  deleteItem,
  getExpiredItem,
  getNewItemsWeek,
  getLowStockWeek,
  departmentCount
} from "../controllers/inventoryController.js";
const router = express.Router();


router.get("/expired_items", getExpiredItem);
router.get("/new_items_added", getNewItemsWeek);
router.get("/get_lowstock_items", getLowStockWeek);
router.get("/department_count" , departmentCount);

router.get("/", getAllItems);
router.get("/:id", getItem);
router.post("", addItem);
router.put("/:id", putItem);
router.delete("/:id", deleteItem);

export default router;

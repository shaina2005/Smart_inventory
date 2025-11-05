import express from "express";
import {
  getAllItems,
  getItem,
  addItem,
  putItem,
  useItemQuantity,
  deleteItem,
  getExpiredNotifications,
  getExpiredItem,
  getNewItemsWeek,
  getLowStockWeek,
  departmentCount,
  addBulkItems,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/expired_items", getExpiredItem);
router.get("/new_items_added", getNewItemsWeek);
router.get("/get_lowstock_items", getLowStockWeek);
router.get("/department_count", departmentCount);

router.post("/bulk", addBulkItems);
router.get("/", getAllItems);
router.get("/:id", getItem);
router.post("/", addItem);
router.put("/:id", putItem);
router.put("/use/:id", useItemQuantity); // use quantity
router.delete("/:id", deleteItem);
router.get("/expired/notifications", getExpiredNotifications); // expired items notifications

export default router;

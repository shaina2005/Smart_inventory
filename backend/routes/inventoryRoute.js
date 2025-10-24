import express from "express";
import {
  getAllItems,
  getItem,
  addItem,
  putItem,
  useItemQuantity,
  deleteItem,
  getExpiredNotifications,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/", getAllItems);
router.get("/:id", getItem);
router.post("/", addItem);
router.put("/:id", putItem);
router.put("/use/:id", useItemQuantity); // use quantity
router.delete("/:id", deleteItem);
router.get("/expired/notifications", getExpiredNotifications); // expired items notifications

export default router;

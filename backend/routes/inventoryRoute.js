import express from 'express';
import {getAllItems , getItem , addItem , putItem , deleteItem} from "../controllers/inventoryController.js";


const router = express.Router();
router.get("/",getAllItems);
router.get("/items/:id", getItem);
router.post("/items", addItem);
router.put("/items/:id" , putItem);
router.delete("/items/:id", deleteItem);

export default router;

import { createIndent , getAllIndents,deleteIndent } from "../controllers/IndentController.js";
import express from "express";
const router = express.Router();

router.get("/",getAllIndents);
router.post("/",createIndent);
router.delete("/:id", deleteIndent);

export default router;
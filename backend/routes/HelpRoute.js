import express from "express";
import {
  addHelpRequest,
  getHelpRequests,
} from "../controllers/HelpController.js";
const router = express.Router();

router.post("/", addHelpRequest);
router.get("/", getHelpRequests);

export default router;

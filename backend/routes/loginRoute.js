import express from 'express';
import { loginUSer } from '../controllers/loginController.js';
const router = express.Router();

router.post('/login', loginUSer)


export default router
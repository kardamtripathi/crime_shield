import express from "express"
import { getChatbotResponse} from "../controllers/chatbotController.js";
import {isAuthorized} from '../middlewares/auth.js'
const router = express.Router();
router.post('/', isAuthorized, getChatbotResponse);
export default router
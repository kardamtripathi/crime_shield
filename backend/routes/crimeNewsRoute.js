import express from "express"
import { getCrimeNews } from "../controllers/crimeNewsController.js";
import { isAuthorized } from "../middlewares/auth.js";
const router = express.Router();
router.get('/news', isAuthorized, getCrimeNews)
export default router
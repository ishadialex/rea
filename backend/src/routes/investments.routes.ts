import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getUserInvestments, createInvestment } from "../controllers/investments.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getUserInvestments);
router.post("/", createInvestment);

export default router;

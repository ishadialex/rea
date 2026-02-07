import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getTransactions, getTransaction } from "../controllers/transactions.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getTransactions);
router.get("/:id", getTransaction);

export default router;

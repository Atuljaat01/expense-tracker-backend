import { createExpense, getExpense } from "../controllers/expense.controller.js";
import express from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import subscriptioncheck from "../middleware/subscriptioncheck.js";


const router = express.Router();

router.route("/expenses").post(verifyJwt, subscriptioncheck, createExpense);
router.route("/get-expenses").get(verifyJwt, getExpense);



export default router;
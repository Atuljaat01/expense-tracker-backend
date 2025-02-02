import { createExpense } from "../controllers/expense.controller.js";
import express from "express";
import verifyJwt from "../middleware/auth.middleware.js";


const router = express.Router();

router.route("/expenses").post(verifyJwt, createExpense);



export default router;
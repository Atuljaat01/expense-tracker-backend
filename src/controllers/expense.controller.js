import { Expense } from "../models/expense.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asynchandler from "../utils/asynchandler.js";

const createExpense = asynchandler(async (req, res) => {
    try{
        const { title, amount, date, category } = req.body;
        if(!title || !amount || !date || !category){
            throw new ApiError(400, 'Title, amount, date and category are required');
        }
        const userId = req.user.userId;
        console.log(userId)
        const expense = await Expense.create({ title, amount, date, category, userId });
        if(!expense){
            throw new ApiError(400, 'Expense not created');
        }
        res
        .status(200)
        .json(new ApiResponse(200, expense, 'Expense created successfully'));
    }
    catch(error){
        throw new ApiError(500, error.message);
    }
});









export { createExpense };

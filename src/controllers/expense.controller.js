import { Expense } from "../models/expense.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asynchandler from "../utils/asynchandler.js";
import mongoose from "mongoose";

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

const getExpense = asynchandler(async (req, res) => {
    const { ObjectId } = mongoose.Types;
    const { category, startDate, endDate, minAmount, maxAmount } = req.body;
    if(minAmount && isNaN(minAmount)){
        throw new ApiError(400, 'Min amount must be a number');
    }
    if(maxAmount && isNaN(maxAmount)){
        throw new ApiError(400, 'Max amount must be a number');
    }
    if(startDate && isNaN(Date.parse(startDate))){
        throw new ApiError(400, 'Start date must be a valid date');
    }
    if(endDate && isNaN(Date.parse(endDate))){
        throw new ApiError(400, 'End date must be a valid date');
    }
    const pipeline = [];
    const matchFilter = { };
    const userId = req.user.userId;
    matchFilter.userId = new mongoose.Types.ObjectId(userId);
    if(category){
        matchFilter.category = category;
    }
    if(minAmount && maxAmount){
        matchFilter.amount = { $gte: minAmount, $lte: maxAmount };
    }
    else if(minAmount){
        matchFilter.amount = { $gte: minAmount };
    }
    else if(maxAmount){
        matchFilter.amount = { $lte: maxAmount };
    }
    if(startDate && endDate){
        matchFilter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    else if(startDate){
        matchFilter.date = { $gte: new Date(startDate) };
    }
    else if(endDate){
        matchFilter.date = { $lte: new Date(endDate) };
    }
    pipeline.push({ $match: matchFilter });
    const expenses = await Expense.aggregate(pipeline);

    res
    .status(200)
    .json(new ApiResponse(200, expenses, 'Expenses retrieved successfully'));
})
    









export { createExpense, getExpense };

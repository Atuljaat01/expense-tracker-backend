import { Expense } from "../models/expense.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asynchandler from "../utils/asynchandler.js";
import mongoose from "mongoose";

const subscriptioncheck = asynchandler(async (req, res, next) => {
    const startDate =  new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999);
    if (req.user.isSubscribed) {
        if(req.user.subscriptionExpiresAt < new Date()){
            throw new ApiError(400, 'Your subscription has expired');
        }
         if(req.user.subscriptionPlan === 'basic'){
            const countExpense = await Expense.countDocuments(
                {
                    userId: req.user._id,
                    date: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                }
            )
            if(countExpense > 20){
                throw new ApiError(400, 'You have exceeded the limit of 20 expenses for this month');
            }
            next();
        }
    }
    if(req.user.subscriptionPlan === 'premium'){
        next();
    }
    else{
        const countExpense = await Expense.countDocuments(
            {
                userId: req.user._id,
                date: {
                    $gte: startDate,
                    $lte: endDate,
                },
            }
        )
        if(countExpense > 5){
            throw new ApiError(400, 'You have exceeded the limit of 5 expenses for this month');
        } 
        next();
    }
});


export default subscriptioncheck;
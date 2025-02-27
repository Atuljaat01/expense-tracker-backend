import { Expense } from '../models/expense.model.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import asynchandler from '../utils/asynchandler.js';
import mongoose from 'mongoose';


const monthlyReport = asynchandler(async (req, res) => {
    try{
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        console.log(userId);
        // Step 1: Aggregate expenses for the current month
        const expenses = await Expense.aggregate([
            {
                $match: {
                    userId, // Filter by the current user
                    date: {
                        $gte: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1)), // Start of the current month (00:00:00 UTC)
                        $lt: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)), // End of the current month (last day, 23:59:59.999 UTC)
                    },
                },
            },
            {
                $group: {
                    _id: null, // We are not grouping by any field, so null groups all docs together
                    total: { $sum: '$amount' }, // Sum up all the expenses for the user
                },
            },
        ]);
        
const user = await User.findById(req.user.userId).select('-password');
if (!user) {
    throw new ApiError(400, 'User not found'); // Handle case where user doesn't exist
}

// Step 3: Calculate remaining budget if the user is subscribed
let remaining = 0;
if (user.isSubscribed) {
    if (typeof user.monthlyExpenseLimit === 'number') {
        remaining = user.monthlyExpenseLimit - expenses[0]?.total || 0; // Calculate remaining budget
    } else {
        // Handle case where monthlyExpenseLimit might not be set
        remaining = 0;
    }
}

// Step 4: Send the response with the monthly report data
res.status(200).json(new ApiResponse(200, { total: expenses[0]?.total || 0, remaining }, 'Monthly report'));

    }
    catch (error) {
        console.error('Error in monthlyReport:', error);
        throw new ApiError(500, 'Something went wrong', error);
    }
});




export default monthlyReport;




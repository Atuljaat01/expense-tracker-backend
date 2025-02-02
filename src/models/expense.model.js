import mongoose, { Schema} from "mongoose";

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
},
{
    timestamps: true,
}
);

export const Expense = mongoose.model("Expense", expenseSchema);
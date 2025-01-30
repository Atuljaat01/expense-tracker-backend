import mongoose, { userSchema} from "mongoose";

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
    isSubscribed: {
        type: Boolean,
        default: false,
    },
    subscriptionType: {
        type: String,
        enum: ["free", "basic", "premium"],
        default: "free",
    },
    subscriptionExpiresAt: {
        type: Date,
    },
});

export const Expense = mongoose.model("Expense", expenseSchema);
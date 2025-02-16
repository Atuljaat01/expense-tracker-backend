import mongoose, { Schema} from "mongoose";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    isSubscribed: {
        type: Boolean,
        default: false,
    },
    subscriptionPlan :{
        type: String,
        elum: ["free", "basic", "premium"],
        default: "free",
    },
    subscriptionExpiresAt: {
        type: Date,
    },
    duration:{
        type: String,
        enum: ["monthly", "yearly"],
    },
    
    monthlyExpenseLimit: {
        type: Number,
        default: 0,
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bycrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bycrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });
};








export const User = mongoose.model("User", userSchema);
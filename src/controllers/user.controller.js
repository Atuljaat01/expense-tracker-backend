import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asynchandler from '../utils/asynchandler.js';
import bcrypt from 'bcrypt'


const generateAccessAnsdRefreshTokens = async (userId) => {
    try{const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
    }catch (error) {
        throw new ApiError(500, "something went wrong", error);
    }

}

const signUp = asynchandler(async (req, res) => {
    try {
        console.log('Sign-up request received');
        const { username, email, password, fullName } = req.body;
        const existingUser = await User.findOne({$or :[{username}, {email}]});
        if (existingUser) {
            throw new ApiError(400, 'Username or email already exists');
        }
        const user = await User.create({ username, email, password, fullName });

        const createrUser = await User.findById(user._id).select('-password'); 
        // Exclude password from the response
        if (!createrUser) {
            throw new ApiError(400, 'User not created');
        }
        res.status(201).json(new ApiResponse(201, createrUser, 'User created successfully'));
    
    } catch (error) {
        console.error('Error in sign-up:', error);
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
        
    }
  
});


const signIn = asynchandler(async (req, res) => {
    try{
        const { email, password} = req.body;

        if (!email || !password){
            throw new ApiError(400, 'Email and password are required');
        }
        const user = await User.findOne({email});
        if(!user){
            throw new ApiError(400, 'user not found');
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            throw new ApiError(400, 'Invalid password');
        }
        const { refreshToken, accessToken } = await generateAccessAnsdRefreshTokens( user._id);

        const userLoggedIn = await User.findById(user._id).select('-password -refreshToken');
        if(!userLoggedIn){
            throw new ApiError(400, 'User not found');
        }
        const option = {
            httpOnly: true,
            secure: true
        };
        res
        .status(200)
        .cookie('refreshToken', refreshToken, option)
        .cookie('accessToken', accessToken, option)
        .json(new ApiResponse(200, 
            {userLoggedIn, accessToken, refreshToken},
             'User logged in successfully'));
    }
    catch(error){
        console.error('Error in sign-in:', error);
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
    }
});

const signOut = asynchandler(async (req, res) => {
    try{
        const user =  await User.findById(req.user.userId);
        if(!user){
            throw new ApiError(400, 'User not found');
        }
        user.refreshToken = '';
        await user.save({ validateBeforeSave: false });
        res
        .status(200)
        .clearCookie('refreshToken')
        .clearCookie('accessToken')
        .json(new ApiResponse(200, null, 'User logged out successfully'));
    } 
    catch(error){
        console.error('Error in sign-out:', error);
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
    }
});
const changePassword = asynchandler( async(req, res) =>{
    try {
        const { oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword){
        throw new ApiError( 401, "All fields are required")
    }
    const user = await User.findById(req.user.userId);
    if(!user){
        throw new ApiError(401, "user not find")
    }
    const isPasswordCorrect = await user.comparePassword(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(401, "Password is incorrect")
    }
    user.password = newPassword;
    await user.save();

    
    res
    .status(200)
    .json( new ApiResponse(200, "Password updated successfully"))
   
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "something went wrong", error);
    }
    
})
const updateUserProfile = asynchandler(async (req, res) => {
    const { fullName, email } = req.body;
    const user = await User.findByIdAndUpdate(req.user.userId,
        { fullName,
          email
        },
        { new: true }
    ).select('-password -refreshToken');
    if(!user){
        throw new ApiError(400, 'User not found');
    }
    res
    .status(200)
    .json(new ApiResponse(200, user, 'User profile updated successfully'));
});
const getUserProfile = asynchandler(async (req, res) => {
    const user = await User.findById(req.user.userId).select('-password -refreshToken');
    if(!user){
        throw new ApiError(400, 'User not found');
    }
    res
    .status(200)
    .json(new ApiResponse(200, user, 'User profile retrieved successfully'));
});
const deleteUser = asynchandler(async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.userId);
    if(!user){
        throw new ApiError(400, 'User not found');
    }
    res
    .status(200)
    .json(new ApiResponse(200, null, 'User deleted successfully'));
    } catch (error) {
        throw new ApiError(500, "something went wrong", error);
    }
    
});
const getUserSubscription = asynchandler(async (req, res) => {
    const user = await User.findById(req.user.userId).select('subscriptionPlan subscriptionExpiresAt');
    if(!user){
        throw new ApiError(400, 'User not found');
    }
    res
    .status(200)
    .json(new ApiResponse(200, user, 'User subscription retrieved successfully'));
});


export { signUp, signIn, signOut, changePassword, updateUserProfile, getUserProfile, deleteUser, getUserSubscription
 };


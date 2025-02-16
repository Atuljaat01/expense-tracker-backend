import asynchandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


const subscribe = asynchandler(async (req, res) => {
    try{
    const { plan, duration} = req.body;
    if(!['basic', 'premium'].includes(plan)){
        throw new ApiError(400, 'Invalid plan');
    }

let expiration = new Date();
if(duration === 'monthly'){
    expiration.setMonth(expiration.getMonth() + 1);
}
else if(duration === 'yearly'){
    expiration.setFullYear(expiration.getFullYear() + 1);
}
else{
    throw new ApiError(400, 'Invalid duration');
}

const user = await User.findById(req.user.userId).select('-password');
if(!user){
    throw new ApiError(400, 'User not found');
}
if(plan === 'basic' && user.subscriptionPlan === 'basic'){
    throw new ApiError(400, 'Already subscribed to basic plan');
}
if(plan === 'premium' && user.subscriptionPlan === 'premium'){
    throw new ApiError(400, 'Already subscribed to premium plan');
}

user.isSubscribed = true;
user.subscriptionPlan = plan;
user.subscriptionExpiresAt = expiration;
user.duration = duration;
await user.save()
res
.status(200)
.json(new ApiResponse(200, user, 'Subscribed successfully'));
} catch (error) {
    throw new ApiError(500,"something went wrong", error);
}});

const unsubscibe =  asynchandler(async(req,res) => {
    try{
       const user =  await User.findById(req.user.userId).select('-password')
         if(!user){
             throw new ApiError(400, 'User not found')
         }
       const subscribed = user.isSubscribed
         if(!subscribed){
              throw new ApiError(400, 'You are not subscribed')
         }
            user.isSubscribed = false
            user.subscriptionPlan = "free"
            user.subscriptionExpiresAt = null
            user.duration = null
            await user.save()

            res
            .status(200)
            .json(new ApiResponse(200, null, 'Unsubscribed successfully'))

    }catch{
        throw new ApiError(500, "something went wrong", error)
    }
});




export { subscribe, unsubscibe };
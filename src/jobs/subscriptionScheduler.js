import cron from 'node-cron';
import { User } from "../models/user.model.js";


cron.schedule('0 0 * * *', async() => {
    try{ const expiredUser = await User.find({
        isSubscribed: true,
        subscriptionExpiresAt: { $lt: new Date() },
    })

    expiredUser.forEach(async user => {
        user.isSubscribed = false;
        user.subscriptionPlan = "free";
        user.subscriptionExpiresAt = undefined;
        await user.save();
    });}
    catch(err){
        console.log(err);
    }
   

}); // Run every day at midnight
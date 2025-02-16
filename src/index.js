
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import {app} from './app.js'
dotenv.config({
    path: '.env'
})

// run jobs
import './jobs/subscriptionScheduler.js'



connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})










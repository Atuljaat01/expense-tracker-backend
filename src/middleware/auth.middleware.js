import { ApiError } from "../utils/ApiError.js";
import asychandler from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJwt = asychandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) {
       throw new ApiError("Unauthorized", 401);
       
    }
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decodedToken?.userId);
    if (!user) {
        throw new ApiError("User not found", 401);
        
    }
   

    req.user = decodedToken;
    next();

});


export default verifyJwt;
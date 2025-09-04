import { catchAsyncError } from "./catchAsyncError.middleware.js";
import  ErrorHandler from "./error.middleware.js"
import jwt from "jsonwebtoken";
import { Users } from "../models/user.model.js";

export const isAuthenticated = catchAsyncError( async (req,res,next) => {
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("User is not authenticated",400));
    }
    const decoded =  jwt.verify(token,process.env.JWT_SECRET_KEY);

    req.user  = await Users.findById(decoded.id);
    next();
})
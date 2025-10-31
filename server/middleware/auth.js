import User from "../models/User.js";
import jwt from "jsonwebtoken";


//middleware will be executed before execution of the controller functoins
export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.headers.token;
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findOne({decoded}).select("-password");
        if(!user)
        {
            return res.json({success:false,message:"user not found"});
        }
        req.user=user;
        next();
    }
    catch(error)
    {
        console.log(err.message);
        res.json({success:false,message:err.message});
    }
}
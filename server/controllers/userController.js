import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";
import cloudinary from "../lib/cloudinary";

//controller for signup
export const signup=async(req,res)=>{
    const {fullName,email,password,bio}=req.body;
    try{
        if(!fullName||!email||!password||!bio)
        {
            return res.json({succes:false,message:"Missing details"});
        }
        const user=User.findOne({email})
        if(user)
        {
           return res.json({succes:false,message:"Account already exists"}); 
        }
        const salt=await bcrypt.getSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=User.create({
            fullName,email,password:hashedPassword,bio
        });

        const token=generateToken(newUser._id);

        res.json({success:true,userData:newUser,token,message:"Account create successfully"});
    }
    catch(error)
    {
        console.log(error.message);
        res.json({success:false,message:error.message});

    }
}

//controller for login
export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password)
        {
            res.json({success:false,message:"Missing details"});
        }
        const userData=User.findOne({email});
        if(!email)
        {
            res.json({success:false,message:"Account doesn't exist"});
        }
        const isPassword=await bcrypt.compare(password,userData.password);
        if(!isPassword)
        {
            res.json({success:false,message:"Invalid Credentials"});
        }
        const token=generateToken(userData._id);
        res.json({success:true,userData,token,message:"login successful"});
    }
    catch(error)
    {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

export const checkAuth=(req,res)=>{
    return res.json({succes:true,user:req.user})
}

//controller to update user details
export const updateProfile=async(req,res)=>{
    try{
        const {profilepic,bio,fullName}=req.body;
        const userid=req.user._id;
        let updatedUser;
        if(!profilepic)
        {
            updatedUser=await User.findByIdAndUpdate(userid,{bio,fullName},{new:true});
        }
        else
        {
            const upload=await cloudinary.uploader.upload(profilepic);
            updatedUser=await User.findByIdAndUpdate(userid,{profilepic:upload.secure_url,bio,fullName},{new:true});
        } 
        res.json({success:true,user:updatedUser})
    }
    catch{
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}
 

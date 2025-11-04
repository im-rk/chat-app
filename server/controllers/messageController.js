import User from "../models/User";
import Message from "../models/Message";
import cloudinary from "../lib/cloudinary";
export const getUsersForSidebar=async(req,res)=>{
    try{
        const userId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password");

        //count no of unseen messages
        const unseenmessages={}
        const promises=filteredUsers.map(async (user)=>{
            const messages=await Message.find({senderId:user._id,receiverId:
                userId,seen:false
            })
            if(messages.length>0)
            {
                unseenmessages[user._id]=messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success:true,users:filteredUsers,unseenmessages});
    }
    catch(error)
    {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


//get all messages for selected user
export const getMessages=async(req,res)=>{
    try{
        const {id:selectedUserid}=req.params.id;
        const myid=req.user._id;
        
        const messages=await Message.find({
            $or:[ 
                {senderId:selectedUserid,receiverId:myid },
                {senderId:myid,receiverId:selectedUserid}
            ]
        })
        await Message.updateMany({senderId:selectedUserid,receiverId:myid},{seen:true})

        res.json({success:true,user:messages})
    }
    catch(error)
    {
        console.log(error)
        return res.json({success:false,message:error.message})
    }
}


//api to mark messages as seen using message id
export const markMessaageasSeen=async(req,res)=>{
    try{

        const {id}=req.params;
        await Message.findByIdAndUpdate(id,{seen:true});
        res.json({success:true});
    }
    catch(error)
    {
        console.log(error)
        return res.json({success:false,message:error.message})
    }
}

//send message to selected user using the generated token using bcrypt
export const sendMessage=async(req,res)=>{
    try{
        const {text,image}=req.body;
        const receiverId=req.params.id;
        let imageurl;
        if(image)
        {
            const uploadedResponse=cloudinary.uploader.upload(image);
            imageurl=uploadedResponse.secure_url
        }
        const newMessage=await Message.create({senderId:req.user._id,receiverId:receiverId,text:text,image:image})

    }
    catch(error)
    {
        console.log(error)
        return res.json({success:false,message:error.message})
    }
}

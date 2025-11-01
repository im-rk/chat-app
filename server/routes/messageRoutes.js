import express from "express";
import { getMessages, getUsersForSidebar, markMessaageasSeen } from "../controllers/messageController";
import { protectRoute } from "../middleware/auth";

const messageRouter=express.Router();

messageRouter.post("/users",protectRoute,getUsersForSidebar)
messageRouter.post("/:id",protectRoute,getMessages);
messageRouter.put("/mark/:id",protectRoute,markMessaageasSeen);

export default messageRouter;

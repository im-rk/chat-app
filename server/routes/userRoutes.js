import expres from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/userController";
import { protectRoute } from "../middleware/auth";

//using .Router() for defining routes in seprate files.
const userRouter=express.Router();

userRouter.post("/signup",signup);
userRouter.post("/login",login);
userRouter.put("/update-profile",protectRoute,updateProfile);
userRouter.get("/check",protectRoute,checkAuth)
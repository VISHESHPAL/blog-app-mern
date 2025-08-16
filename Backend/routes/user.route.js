import express  from 'express';
import { deleteAccount, login, logout, register } from '../controller/user.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const userRouter = express.Router();


userRouter.post("/register" , register);
userRouter.post("/login" , login);
userRouter.get("/logout" , logout)
userRouter.delete("/delete" , authUser , deleteAccount)

export default userRouter;
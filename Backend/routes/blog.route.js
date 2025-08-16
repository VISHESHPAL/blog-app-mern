import express from 'express';
import { createBlog } from '../controller/blog.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const blogRoute = express.Router();;

blogRoute.post("/create" ,authUser, createBlog)


export default blogRoute;
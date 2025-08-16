import express from 'express';
import { createBlog, deleteSingleBlog, getAllBlogs, getSingleBlog } from '../controller/blog.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const blogRoute = express.Router();;

blogRoute.post("/create" ,authUser, createBlog)
blogRoute.get("/getAll" ,authUser, getAllBlogs)
blogRoute.get("/getSingle/:id" ,authUser, getSingleBlog)
blogRoute.delete("/deleteSingle/:id" ,authUser, deleteSingleBlog)


export default blogRoute;
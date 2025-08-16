import express from 'express';
import dotenv from 'dotenv'
import connectDB from './db/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './routes/user.route.js';
import blogRoute from './routes/blog.route.js';

dotenv.config();

const app =  express();
app.use(cookieParser());
app.use(express.json())
app.use(cors())


app.use("/api/user" , userRouter)
app.use("/api/blog" , blogRoute)

app.get("/" , (req, res) =>{
     res.send("BACKEND IS WORKING ")
})

connectDB();
const port  = process.env.PORT
app.listen(port, () =>{
    console.log(`App is Listining on the Port ${port}`)
})
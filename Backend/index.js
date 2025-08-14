import express from 'express';
import dotenv from 'dotenv'
import connectDB from './db/db.js';
dotenv.config();

const app =  express();


app.get("/" , (req, res) =>{
     res.send("BACKEND IS WORKING ")
})

connectDB();
const port  = process.env.PORT
app.listen(port, () =>{
    console.log(`App is Listining on the Port ${port}`)
})
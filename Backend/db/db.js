import mongoose from "mongoose";

const connectDB = async () =>{
    try {

        await mongoose.connect(`${process.env.MONGO_URI}/blogApp`)
        console.log("DATABASE CONNECTED SUCCESSFULLY ...")
        
    } catch (error) {
        console.log(`Error in the connection of the database ` , error)
    }
}

export default connectDB;
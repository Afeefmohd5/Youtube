import mongoose from "mongoose";
import {DB_NAME} from './../constants.js';

const connectDB = async () => {
    try{
        const connectInstance = await mongoose.connect(`${process.env.MONGODB}/${DB_NAME}`)
        console.log(`\n MongoDB connected successfully!! DB Host : ${connectInstance.connection.host}`);
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1); 
    }
}

export default connectDB;
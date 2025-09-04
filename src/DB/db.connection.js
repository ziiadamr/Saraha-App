import mongoose from "mongoose";

const dbConnection = async()=>{
    try{
        await mongoose.connect(process.env.DB_URL_LOCAL);
        console.log("Connected to MongoDB");
    }catch(err){
        console.log("Failed to connect to MongoDB", err);
    }
}
export default dbConnection;
import mongoose from "mongoose";

const connectDb= async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL,{
            dbName: "crowdfunding"
        });
        console.log("Connected to Database");
    } catch (error) {
        console.log(error);
    }
};

export default connectDb;
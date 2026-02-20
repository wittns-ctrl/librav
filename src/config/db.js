import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const connectDB = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log('mongodb connected successfully');
    }catch(error){
    console.error("error message:",error.message)
    process.exit(1)
    }
}
export default connectDB
  
import mongoose from "mongoose";
import { DB_NAME } from "../constants/ConstantsVariable.js";

// Database connection function
const connectDB = async () => {
    try {
        // Connecting to MongoDB
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_NAME}?authSource=admin`
        );
        console.log(`MongoDB Connected || DB Host || ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Error: ", error);
        process.exit(1); // Exit the process with failure code
    }
};

// Exporting connectDB function
export default connectDB;

import dotenv from 'dotenv';

dotenv.config({
    path: './.env',
});

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileToCloudinary = async (localFilePath) => {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
        console.error("Invalid file path:", localFilePath);
        return null;
    }

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image",
        });
        fs.unlinkSync(localFilePath); // Remove local file after successful upload
        return response; // Return the uploaded file URL
    } catch (error) {
        console.error("Cloudinary upload error:", error.response || error);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath); // Clean up local file
        return null;
    }
};

export { uploadFileToCloudinary };

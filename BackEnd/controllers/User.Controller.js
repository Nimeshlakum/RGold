import { User } from "../models/User.Model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getById = (req, res) => {

    const { userId } = req.body

    const user = User.findById(userId)

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            user,
            "User Is Fetch Succesfully"
        ))
}

const getAllUser = async (req, res) => {

    try {
        // Fetch all users from the database
        const users = await User.find(); // Adjust query as needed for your DB setup

        // Return response with ApiResponse
        return res.status(200).json(
            new ApiResponse(200, users, "All User Detail")
        );
    } catch (error) {
        // Handle errors
        next(new ApiError(500, "Failed to fetch users")); // Pass the error to error-handling middleware
    }
}

export {
    getById,
    getAllUser
}
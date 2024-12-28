import { ApiError } from "../utils/ApiError.js";

const checkAdmin = async (req, res, next) => {
    try {
        if (!req.user?.isAdmin) {
            // If not admin, throw an ApiError
            throw new ApiError(403, "Not Admin"); // Assuming ApiError accepts status code and message
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};

export { checkAdmin }

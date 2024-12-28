import { Review } from "../models/Review.Model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createReview = async (req, res, next) => {
    try {
        const { product, rating, comment } = req.body;
        const user = req.user._id;

        // Check if the user has already reviewed the product
        const existingReview = await Review.findOne({ user, product });
        if (existingReview) {
            return res.status(400).json(new ApiResponse(400, null, "You have already reviewed this product."));
        }

        // Create a new review
        const review = await Review.create({ user, product, rating, comment });
        return res.status(201).json(new ApiResponse(201, review, "Review created successfully."));
    } catch (error) {
        next(new ApiError(500, null, "Error while creating review. Please try again later."));
    }
};

const getReviewsByProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;

        // Fetch all reviews for a product
        const reviews = await Review.find({ product: productId })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully."));
    } catch (error) {
        next(new ApiError(500, null, "Error while fetching reviews. Please try again later."));
    }
};

const updateReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        // Update the review by ID
        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { rating, comment },
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return res.status(404).json(new ApiResponse(404, null, "Review not found."));
        }

        return res.status(200).json(new ApiResponse(200, updatedReview, "Review updated successfully."));
    } catch (error) {
        next(new ApiError(500, null, "Error while updating review. Please try again later."));
    }
};

const deleteReview = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Delete the review by ID
        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return res.status(404).json(new ApiResponse(404, null, "Review not found."));
        }

        return res.status(200).json(new ApiResponse(200, null, "Review deleted successfully."));
    } catch (error) {
        next(new ApiError(500, null, "Error while deleting review. Please try again later."));
    }
};

export { createReview, getReviewsByProduct, updateReview, deleteReview };

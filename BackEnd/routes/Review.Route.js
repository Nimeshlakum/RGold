import express from "express";
import { verifyJWT } from "../middlewares/Auth.Middelware.js";
import {
    createReview,
    getReviewsByProduct,
    updateReview,
    deleteReview,
} from "../controllers/Review.Controller.js";

const router = express.Router();

// Create a new review
router.route("/").get(verifyJWT, createReview);

// Get all reviews for a specific product
router.route("/product/:productId").get(getReviewsByProduct);

// Update a review by ID
router.route("/:id").patch(verifyJWT, updateReview);

// Delete a review by ID
router.route("/:id").delete(verifyJWT, deleteReview);

export default router;

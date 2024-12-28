import express from "express";
import { verifyJWT } from "../middlewares/Auth.Middelware.js";
import { create, getByUserId, getSpecificId, updateById, deleteById } from "../controllers/WishList.Controller.js";

const router = express.Router();

// Create a wishlist entry
router.route("/").post(verifyJWT, create);

// Get all wishlist items for the authenticated user
router.route("/").get(verifyJWT, getByUserId);

// Get a specific wishlist item by its ID
router.route("/:id").get(verifyJWT, getSpecificId)

// Update a wishlist item by its ID
router.route("/:id").patch(verifyJWT, updateById);

// Delete a wishlist item by its ID
router.route("/:id").delete(verifyJWT, deleteById);

export default router;

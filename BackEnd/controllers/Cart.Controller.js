import { Cart } from "../models/Cart.Model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const create = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        // Check if the cart entry already exists
        const existingCart = await Cart.findOne({ user: userId, product: productId });
        if (existingCart) {
            return res.status(400).json(new ApiResponse(400, null, "Product already in Cart"));
        }

        // Create new cart entry
        const cartItem = await Cart.create({ user: userId, product: productId, quantity });

        return res.status(201).json(new ApiResponse(201, cartItem, "Cart item created successfully"));
    } catch (error) {
        next(new ApiError(500, null, "Error while creating cart item. Please try again later."));
    }
};

const getByUserId = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Retrieve all cart items for the user
        const cartItems = await Cart.find({ user: userId })
            .populate("product", "name price")
            .sort({ createdAt: -1 });

        return res.status(200).json(new ApiResponse(200, cartItems, "Cart items retrieved successfully"));
    } catch (error) {
        next(new ApiError(500, null, "Error while retrieving cart items. Please try again later."));
    }
};

const getSpecificId = async (req, res, next) => {
    try {
        const cartItem = await Cart.findById(req.params.id)
            .populate("user", "name email")
            .populate("product", "name price");

        if (!cartItem) {
            return res.status(404).json(new ApiResponse(404, null, "Cart item not found"));
        }

        return res.status(200).json(new ApiResponse(200, cartItem, "Cart item retrieved successfully"));
    } catch (error) {
        next(new ApiError(500, null, "Error while retrieving specific cart item. Please try again later."));
    }
};

const updateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedCart = await Cart.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedCart) {
            return res.status(404).json(new ApiResponse(404, null, "Cart item not found"));
        }

        return res.status(200).json(new ApiResponse(200, updatedCart, "Cart item updated successfully"));
    } catch (error) {
        next(new ApiError(500, null, "Error while updating cart item. Please try again later."));
    }
};

const deleteById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedCart = await Cart.findByIdAndDelete(id);
        if (!deletedCart) {
            return res.status(404).json(new ApiResponse(404, null, "Cart item not found"));
        }

        return res.status(200).json(new ApiResponse(200, null, "Cart item deleted successfully"));
    } catch (error) {
        next(new ApiError(500, null, "Error while deleting cart item. Please try again later."));
    }
};

export { create, getByUserId, getSpecificId, updateById, deleteById };

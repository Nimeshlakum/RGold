import { Wishlist } from "../models/WishList.Model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const create = async (req, res, next) => {
    try {
        const { productId, note } = req.body;
        const userId = req.user._id;

        // Check if the wishlist entry already exists
        const existingWishlist = await Wishlist.findOne({ user: userId, product: productId });
        if (existingWishlist) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }

        // Create new wishlist entry
        const wishlistItem = await Wishlist.create({ user: userId, product: productId, note });

        return res.status(201).json(new ApiResponse(200, wishlistItem, "Creted succesfully"));
    } catch (error) {
        throw new ApiError(403, {}, "error while crete wishLsit plz try again later")
        next(error);
    }
};

const getByUserId = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Retrieve all wishlist items for the user
        const wishlistItems = await Wishlist.find({ user: userId })
            .populate("product", "name price")
            .sort({ createdAt: -1 }); // Optional: sort by creation date

        return res.status(201).json(new ApiResponse(200, wishlistItems, "get succesfully"));
    } catch (error) {
        throw new ApiError(403, {}, "error while get wishLsit plz try again later")
        next(error);
    }
};

const getSpecificId = async (req, res, next) => {

    try {
        const wishlistItem = await Wishlist.findById(req.params.id)
            .populate("user", "name email") // Populate user fields (optional)
            .populate("product", "name price"); // Populate product fields (optional)

        if (!wishlistItem) {
            return res.status(404).json({ message: "Wishlist item not found" });
        }

        return res.status(201).json(new ApiResponse(200, wishlistItem, "get specific succesfully"));
    } catch (error) {
        throw new ApiError(403, {}, "error while get specific wishLsit plz try again later")
        next(error);
    }
}


const updateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedWishlist = await Wishlist.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedWishlist) {
            return res.status(404).json({ message: "Wishlist item not found" });
        }

        return res.status(201).json(new ApiResponse(200, updatedWishlist, "update succesfully"));
    } catch (error) {
        throw new ApiError(403, {}, "error while update wishLsit plz try again later")
        next(error);
    }
};

const deleteById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedWishlist = await Wishlist.findByIdAndDelete(id);
        if (!deletedWishlist) {
            return res.status(404).json({ message: "Wishlist item not found" });
        }

        return res.status(201).json(new ApiResponse(200, {}, "deleted succesfully"));
    } catch (error) {
        throw new ApiError(403, {}, "error while delete wishLsit plz try again later")
        next(error);
    }
};

export {
    create,
    getByUserId,
    getSpecificId,
    updateById,
    deleteById
}
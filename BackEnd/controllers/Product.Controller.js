import { Product } from "../models/Product.Model.js";
import { Category } from "../models/Category.Model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileToCloudinary } from "../utils/Cloudinary.js";

const create = async (req, res, next) => {
    try {
        const { title, description, price, discount, category, stockQuantity } = req.body;

        // Validate input fields
        if ([title, description, price, category, stockQuantity].some((field) => !field || field.trim() === "")) {
            return next(new ApiError(400, "All fields are required"));
        }

        const parsedPrice = Number(price);
        const parsedStockQuantity = Number(stockQuantity);
        const parsedDiscount = Number(discount) || 0;

        if (isNaN(parsedPrice) || isNaN(parsedStockQuantity) || parsedPrice < 0 || parsedStockQuantity < 0) {
            return next(new ApiError(400, "Price and stockQuantity must be valid positive numbers"));
        }

        // Fetch the category by name to get its _id
        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            return next(new ApiError(404, `Category '${category}' not found`));
        }

        const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
        if (!thumbnailLocalPath) {
            return next(new ApiError(400, "Thumbnail file is required"));
        }

        const thumbnailResponse = await uploadFileToCloudinary(thumbnailLocalPath);
        if (!thumbnailResponse) {
            return next(new ApiError(500, "Error uploading thumbnail to Cloudinary"));
        }

        const product = await Product.create({
            title,
            description,
            price: parsedPrice,
            discount: parsedDiscount,
            category: categoryDoc._id, // Use the _id from the fetched category
            stockQuantity: parsedStockQuantity,
            thumbnail: thumbnailResponse.secure_url,
        });

        const createdProduct = await Product.findById(product._id).populate("category");

        return res.status(201).json(new ApiResponse(201, createdProduct, "Product created successfully"));
    } catch (error) {
        console.error(error);
        next(new ApiError(500, "Error adding product, please try again later"));
    }
};


const getAll = async (req, res, next) => {
    try {
        const allProducts = await Product.find();
        return res.status(200).json(
            new ApiResponse(200, allProducts, "Products fetched successfully")
        );
    } catch (error) {
        next(new ApiError(500, "Error fetching products, please try again later"));
    }
};

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        return res.status(200).json(
            new ApiResponse(200, product, "Product fetched successfully")
        );
    } catch (error) {
        next(new ApiError(500, "Error fetching product, please try again later"));
    }
};

const updateById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new ApiError(406, {}, "id needed for update product")
        }


        const { title, description, price, discount, category, stockQuantity } = req.body;

        const updateData = {};

        // Validate and update fields if they exist in the request body
        if (title) updateData.title = title.trim();
        if (description) updateData.description = description.trim();

        if (price !== undefined) {
            const parsedPrice = parseFloat(price);
            if (isNaN(parsedPrice) || parsedPrice < 0) {
                return next(new ApiError(400, "Price must be a valid positive number"));
            }
            updateData.price = parsedPrice;
        }

        if (discount !== undefined) {
            const parsedDiscount = parseFloat(discount);
            if (isNaN(parsedDiscount) || parsedDiscount < 0) {
                return next(new ApiError(400, "Discount must be a valid positive number"));
            }
            updateData.discount = parsedDiscount;
        }

        if (stockQuantity !== undefined) {
            const parsedStockQuantity = parseInt(stockQuantity, 10);
            if (isNaN(parsedStockQuantity) || parsedStockQuantity < 0) {
                return next(new ApiError(400, "Stock quantity must be a valid positive number"));
            }
            updateData.stockQuantity = parsedStockQuantity;
        }

        // Handle category update if provided
        if (category) {
            const categoryDoc = await Category.findOne({ name: category });
            if (!categoryDoc) {
                return next(new ApiError(404, `Category '${category}' not found`));
            }
            updateData.category = categoryDoc._id; // Use ObjectId of the category
        }

        // Ensure there is something to update
        if (Object.keys(updateData).length === 0) {
            return next(new ApiError(400, "No valid fields provided for update"));
        }

        // Perform the update
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduct) {
            return next(new ApiError(404, "Product not found for update"));
        }

        res.status(200).json(
            new ApiResponse(200, updatedProduct, "Product updated successfully")
        );
    } catch (error) {
        next(new ApiError(500, "Error updating product, please try again later"));
    }
};

const deleteById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new ApiError(40, {}, "id need to delete product")
        }
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return next(new ApiError(404, "Product not found for deletion"));
        }

        res.status(200).json(
            new ApiResponse(200, deletedProduct, "Product deleted successfully")
        );
    } catch (error) {
        next(new ApiError(500, "Error deleting product, please try again later"));
    }
};

const undeleteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const restoredProduct = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

        if (!restoredProduct) {
            return next(new ApiError(404, "Product not found for restoration"));
        }

        res.status(200).json(
            new ApiResponse(200, restoredProduct, "Product restored successfully")
        );
    } catch (error) {
        next(new ApiError(500, "Error restoring product, please try again later"));
    }
};

export {
    create,
    getAll,
    getById,
    updateById,
    deleteById,
    undeleteById,
};

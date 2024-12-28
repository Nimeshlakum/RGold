import { Category } from "../models/Category.Model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getAll = async (req, res, next) => {

    try {
        const result = await Category.find({})
        res.status(200).json(new ApiResponse(200, result, "Catogary Fetch Succesfully"))
    } catch (error) {
        console.log(error);
        res.status(500).json(new ApiError(
            400,
            {},
            "Error fetching categories"
        ))
    }
}

const create = async (req, res, next) => {
    try {
        const { name } = req.body;

        // Validate input fields
        if (!name) {
            return next(new ApiError(400, "Category name is required"));
        }


        // Check if category already exists
        const existCategoryName = await Category.findOne({ name });
        if (existCategoryName) {
            throw new ApiError(403, "Category already exists");
        }

        // Create a new category
        const category = await Category.create({ name });
        if (!category) {
            throw new ApiError(500, "Error while creating category");
        }

        // Send successful response
        return res.status(200).json(
            new ApiResponse(200, category, "Category created successfully")
        );
    } catch (error) {

        return res.status(500).json(
            new ApiError(500, {}, "Internal server error while creating category")
        );
    }
};

export {
    getAll,
    create
}
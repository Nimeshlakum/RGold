import mongoose, { Schema } from "mongoose"

const categorySchema = new Schema({

    name: {
        type: String,
        require: true
    }
})

export const Category = mongoose.model("Category", categorySchema)
// Importing necessary modules
import dotenv from 'dotenv';
import express from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import connectDB from './db/DataBaseConnect.js';
import cookieParser from "cookie-parser";
import userRouter from './routes/User.Route.js';
import authRouter from './routes/Auth.Route.js';
import cartRouter from './routes/Cart.Route.js';
import categoryRouter from './routes/Category.Route.js';
import productRouter from './routes/Product.Route.js';
import reviewRouter from './routes/Review.Route.js';
import wishListRouter from './routes/WishList.Route.js';

dotenv.config({
    path: './.env',
});

// Express app Intance 
const app = express();

// Cors Config
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Connect to the database
connectDB();

// Set up middleware 
app.use(express.json({ limit: "24kb" }));
app.use(express.urlencoded({ extended: true, limit: "24kb" }));
app.use(express.static("assets"))
app.use(cookieParser())

// Set the server port
const PORT = process.env.PORT || 8000;

// Define a simple route
app.use("/api/v1/user", userRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/product", productRouter)
app.use("/api/v1/review", reviewRouter)
app.use("/api/v1/wishlist", wishListRouter)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});

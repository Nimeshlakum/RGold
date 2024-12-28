import { User } from "../models/User.Model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Handler Function
const genarateAccessAndRefreseToken = async (userid) => {
    try {
        const user = await User.findById(userid)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.RefreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "somthing went wrong while genrating access token")
    }
}

// Register User
const registerUser = async (req, res, next) => {

    const { username, email, password, isAdmin } = req.body;

    // Validate required fields
    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existUser) {
        throw new ApiError(409, "User with this username or email already exists");
    }

    // Create the user
    const user = await User.create({
        username,
        email,
        password, // Note: password should be hashed via schema pre-save hook
        isAdmin
    });

    // Return user data without sensitive fields (password, refreshToken)
    const createUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(201, createUser, "User created successfully")
    );

};

// Login User
const loginUser = async (req, res, next) => {

    const { email, password } = req.body;

    // Validate required fields
    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Email and password are required");
    }

    // // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // // Validate password (using the method you defined in the user schema)
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid password");
    }

    // calling Handeler Funtion
    const { accessToken, refreseToken } = await genarateAccessAndRefreseToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -RefreshToken")

    const options = {
        httponly: true,
        secure: true
    }

    // Send response with token
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreseToken", refreseToken, options)
        .json(
            new ApiResponse(200, "Login Successfully")
        )


};

const logoutUser = async (req, res, next) => {


    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                RefreseToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httponly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreseToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out"))

}

const RefreseAccesstoken = async (req, res, next) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.RefreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

}

const changeCurrentPassword = async (req, res, next) => {

    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)


    const isPassCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPassCorrect) {
        throw new ApiError(401, "Incorrect Password")
    }

    user.password = newPassword
    user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, {}, "password change succesfully"))
}

const getCurrentUser = async (req, res, next) => {

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"))
}

const updateAccountDetails = async (req, res, next) => {

    const { username, email } = req.body

    if (!username || !email) {
        throw new ApiError(401, "Detail Is Reqired")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username: username,
                email: email
            }
        },
        { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            user,
            "Account detail updated Succesfully"))
}
export {
    registerUser,
    loginUser,
    logoutUser,
    RefreseAccesstoken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
};



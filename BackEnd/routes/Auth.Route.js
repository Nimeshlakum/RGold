import express from "express";
import { verifyJWT } from "../middlewares/Auth.Middelware.js"
import { registerUser, loginUser, logoutUser, changeCurrentPassword, getCurrentUser, updateAccountDetails } from "../controllers/Auth.Controller.js"

const router = express.Router();

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/change-Password").patch(verifyJWT, changeCurrentPassword)
router.route("/update-Account").patch(verifyJWT, updateAccountDetails)

export default router

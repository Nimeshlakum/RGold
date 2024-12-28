import express from "express";
import { verifyJWT } from "../middlewares/Auth.Middelware.js";
import { checkAdmin } from "../middlewares/Admin.Middelware.js";
import { getById, getAllUser } from "../controllers/User.Controller.js";

const router = express.Router();

router.route("/:id").get(verifyJWT, getById)
router.route("/").get(verifyJWT, checkAdmin, getAllUser)

export default router

import express from "express";
import { getAll, create } from "../controllers/Category.Controller.js";

const router = express.Router();

router.route("/").get(getAll)
router.route("/").post(create)

export default router

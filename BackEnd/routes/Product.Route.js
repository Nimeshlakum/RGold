import express from "express";
import { upload } from "../middlewares/Multer.Middelware.js";
import { create, getAll, getById, updateById, undeleteById, deleteById } from "../controllers/Product.Controller.js";

const router = express.Router();

router.route("/").post(
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1,
        }
    ]),
    create)

router.route("/").get(getAll)
router.route("/:id").get(getById)
router.route("/:id").patch(updateById)
router.route("/undelete/:id").patch(undeleteById)
router.route("/:id").delete(deleteById)


export default router

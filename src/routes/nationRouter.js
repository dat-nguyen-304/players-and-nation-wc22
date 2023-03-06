var express = require("express");
import { getAllNations, addNation, deleteNation, updateNationPage, updateNation, getNation } from "../controllers/nations";
import { uploadNation } from "../middlewares/saveImage";
import { verifyToken } from "../middlewares/authorize";
const router = express.Router();
router.route("/")
    .get(verifyToken, getAllNations)
    .post(uploadNation.single('image'), addNation);
router.route("/:id")
    .delete(deleteNation)
    .put(uploadNation.single('image'), updateNation)
    .get(verifyToken, getNation)
router.route("/update-nation/:id")
    .get(verifyToken, updateNationPage);

module.exports = router;


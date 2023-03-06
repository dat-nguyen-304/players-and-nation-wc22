var express = require("express");
import { getAllPlayers, addPlayer, updatePlayerPage, updatePlayer, deletePlayer, getPlayer } from "../controllers/players";
import { verifyToken } from "../middlewares/authorize";
import { uploadPlayer } from "../middlewares/saveImage";


let router = express.Router();

router.route("/")
    .get(verifyToken, getAllPlayers)
    .post(uploadPlayer.single('image'), addPlayer);
router.route("/:id")
    .delete(deletePlayer)
    .get(verifyToken, getPlayer)
    .put(uploadPlayer.single('image'), updatePlayer)
router.route("/update-player/:id")
    .get(verifyToken, updatePlayerPage);

module.exports = router;

var express = require("express");
import { getAllPlayersAjax } from "../controllers/players";
import { getAllNationsAjax } from "../controllers/nations";
import { createForgotPasswordLink } from "../controllers/accounts";

import { verifyToken } from "../middlewares/authorize";
import { uploadPlayer } from "../middlewares/saveImage";

let router = express.Router();

router.route("/players")
    .get(verifyToken, getAllPlayersAjax);
router.route("/nations")
    .get(verifyToken, getAllNationsAjax);
router.route("/forgot-password")
    .post(createForgotPasswordLink);

module.exports = router;

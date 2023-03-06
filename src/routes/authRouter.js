var express = require("express");
import { register, login, logout } from "../controllers/authController";

var router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login)
router.route("/logout").get(logout);

module.exports = router;
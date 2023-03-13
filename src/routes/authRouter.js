var express = require("express");
import { register, login, logout, resetPassword } from "../controllers/authController";

var router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login)
router.route("/logout").get(logout);
router.route("/reset-password").post(resetPassword);

module.exports = router;
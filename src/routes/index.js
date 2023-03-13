var express = require("express");
import { verifyToken } from "../middlewares/authorize";
import { getCaptains } from "../controllers/players";
import { getProfile, updateProfile, getAccounts } from "../controllers/accounts";
import { aboutUs, changePassword, loginPage, registerPage, forgotPasswordPage, checkEmailPage, resetPasswordPage, resetPassword } from "../controllers/authController";

import { uploadUser } from "../middlewares/saveImage";

var router = express.Router();

router.get("/", verifyToken, getCaptains);
router.get("/accounts", verifyToken, getAccounts);
router.route("/profile")
    .get(verifyToken, getProfile)
    .put(verifyToken, uploadUser.single('image'), updateProfile);
router.route("/change-password").put(verifyToken, changePassword)

router.get("/about-us", verifyToken, aboutUs);

router.get("/login-page", verifyToken, loginPage);

router.get("/register-page", verifyToken, registerPage);

router.get("/forgot-password-page", verifyToken, forgotPasswordPage);

router.get("/check-email", verifyToken, checkEmailPage);

// router.route("/reset-password/:token").get(resetPassword);

router.route("/reset-password/:token").get(resetPasswordPage);

module.exports = router;

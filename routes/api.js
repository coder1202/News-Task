const express = require("express");
const router = express.Router();

const userController = require("../controllers/web/user");

const { userSignupValidationRules } = require('../middleware/validator/web/signup')
const { userLoginValidationRules } = require('../middleware/validator/web/login')
const { authMiddleware } = require('../middleware/validator/web/auth')


router.get("/", authMiddleware, userController.index);
router.get("/login", userController.login);
router.get("/signup", userController.signup);
router.post("/addUser", userSignupValidationRules, userController.addUser);
router.post("/loginUser", userLoginValidationRules, userController.loginUser);
router.get("/logout", userController.logout);

module.exports = router;

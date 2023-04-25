const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Define storage for the images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
    //   cb(null, `${file.originalname}`);
    const originalName = file.originalname;
    const extension = path.extname(originalName);

    // Remove special characters and spaces from the original name
    const cleanedName = originalName.replace(/[^\w\s]/gi, '').replace(/ /g, '');

    cb(null, `${cleanedName}-${Date.now()}${extension}`);
    }
  });
  
  // Create upload middleware using Multer
  const upload = multer({ storage: storage });

const userController = require("../controllers/web/user");
const newsController = require("../controllers/web/news");

const { userSignupValidationRules } = require('../middleware/validator/web/signup')
const { userLoginValidationRules } = require('../middleware/validator/web/login')
const { authMiddleware } = require('../middleware/validator/web/auth')


router.get("/", authMiddleware, userController.index);
router.get("/login", userController.login);
router.get("/signup", userController.signup);
router.get("/my-news", authMiddleware, newsController.myNews);
router.get("/edit-news/:newsId", authMiddleware, newsController.editNews);
router.get("/view-news/:newsId", authMiddleware, newsController.viewNews);
router.get("/add-news", authMiddleware, newsController.addNews);
router.post("/addNewsPost", authMiddleware, upload.array('images'),newsController.addNewsPost);
router.post("/addUser", userSignupValidationRules, userController.addUser);
router.post("/loginUser", userLoginValidationRules, userController.loginUser);
router.get("/logout", userController.logout);

module.exports = router;

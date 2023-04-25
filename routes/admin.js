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


const adminController = require("../controllers/admin/admin");
const newsController = require("../controllers/admin/news");
const { authMiddleware } = require('../middleware/validator/admin/auth')

router.get("/", authMiddleware, adminController.index);
router.get("/login", adminController.login);
router.post("/loginAdmin", adminController.loginAdmin);
router.get("/logout", authMiddleware, adminController.logout);
router.get("/getNews", authMiddleware, newsController.getNews);
router.get("/add_news", authMiddleware, newsController.addNews);
router.get("/edit_news/:newsId", authMiddleware, newsController.editNews);
router.get("/view_news/:newsId", authMiddleware, newsController.viewNews);
router.post("/addNewsPost", authMiddleware,  upload.array('images'), newsController.addNewsPost);
router.post("/newsDelete", authMiddleware, newsController.newsDelete);

module.exports = router;

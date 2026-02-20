// routes/upload.routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadImage } = require("../controllers/image.controller");
const { isAuth, authorizeRoles } = require("../middlewares/auth.middleware");

// memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.post("/uploadImage", isAuth, authorizeRoles("ADMIN"), upload.any(), uploadImage);

module.exports = router;


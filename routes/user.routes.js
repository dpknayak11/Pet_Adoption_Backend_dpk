// routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { isAuth, authorizeRoles } = require("../middlewares/auth.middleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.put("/update/:id", isAuth, userController.updateUser);

router.get("/profile", isAuth, userController.getProfile);
router.get("/all", isAuth, authorizeRoles("ADMIN"), userController.getAllUser);
router.put(
  "/fcm-token",
  isAuth,
  authorizeRoles("USER"),
  userController.updateFcmToken,
);


module.exports = router;

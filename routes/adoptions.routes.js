// routes/user.routes.js
const express = require("express");
const router = express.Router();
const adoptionsController = require("../controllers/adoptions.controller");
const { isAuth, authorizeRoles } = require("../middlewares/auth.middleware");

router.get("/", isAuth, adoptionsController.getAllAdoptions);
router.get("/:id", isAuth, adoptionsController.getSingleAdoption);

router.post("/create", isAuth, adoptionsController.createAdoptions);
router.put("/update/:id", isAuth, adoptionsController.updateAdoptions);
router.delete(
  "/delete/:id",
  isAuth,
  authorizeRoles("ADMIN"),
  adoptionsController.deleteAdoptions,
);

module.exports = router;

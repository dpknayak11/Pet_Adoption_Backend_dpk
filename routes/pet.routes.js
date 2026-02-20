// routes/user.routes.js
const express = require("express");
const router = express.Router();
const petController = require("../controllers/pet.controller");
const { isAuth, authorizeRoles } = require("../middlewares/auth.middleware");

// PUBLIC ROUTES
router.get("/", petController.getAllPetPublic);
router.get("/:id", petController.getSinglePet);

// ADMIN ROUTES
router.post("/create", isAuth, authorizeRoles("ADMIN"), petController.createPet);
router.get("/admin", isAuth, authorizeRoles("ADMIN"), petController.getAllPetAdmin);
router.put("/update/:id", isAuth, authorizeRoles("ADMIN"), petController.updatePet);
router.delete("/delete/:id", isAuth, authorizeRoles("ADMIN"), petController.deletePet);

module.exports = router;

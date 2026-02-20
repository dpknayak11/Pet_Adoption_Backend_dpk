// controllers/pet.controller.js
const joi = require("joi");
const petService = require("../services/pet.service");

// Create Pet
let createPet = async (req, res) => {
  try {
    // Joi validation for Pet
    const schema = joi.object({
      name: joi.string().required(),
      species: joi.string().required(),
      breed: joi.string().required(),
      age: joi.number().min(0).required(),
      gender: joi.string().valid("Male", "Female").required(),
      weight: joi.number().min(0).required(),
      color: joi.string().required(),
      image: joi.string().uri().required(),
      description: joi.string().allow(""),
      traits: joi.array().items(joi.string()).optional(),
      vaccinated: joi.boolean().optional(),
      adopted: joi.boolean().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }

    const resData = await petService.savePet(req.body);

    if (!resData.success) {
      return res.status(500).json({
        error: true,
        message: "Error creating pet",
      });
    }

    return res.status(201).json({
      error: false,
      message: "Pet created successfully",
      data: resData.data,
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: err.message || "Server Error",
    });
  }
};

// Get All Pets Public with filter + search + pagination
let getAllPetPublic = async (req, res) => {
  try {
    const { gender, species, search, page = 1, limit = 10 } = req.query;

    let filter = {}; // public only available

    if (gender) filter.gender = gender;
    if (species) filter.species = species;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { species: { $regex: search, $options: "i" } },
        { breed: { $regex: search, $options: "i" } },
        { color: { $regex: search, $options: "i" } },
        { gender: { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const result = await petService.getAllPet(filter, skip, limitNumber);

    if (!result.success) {
      return res.status(404).json({
        error: true,
        message: "Pets not found",
      });
    }

    // Important for Redux flow
    return res.status(200).json({
      pets: result.data,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(result.total / limitNumber),
        totalPets: result.total,
      },
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Server Error",
    });
  }
};


// Get single pet by ID
let getSinglePet = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await petService.findPetByOne({ _id: id });
    if (!pet.success) {
      return res.status(404).json({
        error: true,
        message: "Pet not found",
      });
    }
    return res.status(200).json({
      error: false,
      message: "Pet fetched successfully",
      data: pet.data,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Server Error",
    });
  }
};

let getAllPetAdmin = async (req, res) => {
  try {
    const { gender, species, search, page = 1, limit = 10 } = req.query;
    let filter = {};
    if (gender) filter.gender = gender;
    if (species) filter.species = species;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { species: { $regex: search, $options: "i" } },
        { breed: { $regex: search, $options: "i" } },
        { color: { $regex: search, $options: "i" } },
        { gender: { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const petsList = await petService.getAllPet(filter, skip, limitNumber);

    if (!petsList.success) {
      return res.status(404).json({
        error: true,
        message: "Pets not found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Pets fetched successfully",
      data: petsList.data,
      page: pageNumber,
      limit: limitNumber,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Server Error",
    });
  }
};

// Update pet
let updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const schema = joi.object({
      name: joi.string().optional(),
      species: joi.string().optional(),
      breed: joi.string().optional(),
      age: joi.number().min(0).optional(),
      gender: joi.string().valid("Male", "Female").optional(),
      weight: joi.number().min(0).optional(),
      color: joi.string().optional(),
      image: joi.string().uri().optional(),
      description: joi.string().allow("").optional(),
      traits: joi.array().items(joi.string()).optional(),
      vaccinated: joi.boolean().optional(),
      adopted: joi.boolean().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }
    const updatedPet = await petService.updatePet(id, req.body);
    if (!updatedPet.success) {
      return res.status(404).json({
        error: true,
        message: "Pet not found or not updated",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Pet updated successfully",
      data: updatedPet.data,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Server Error",
    });
  }
};
// Delete pet
let deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPet = await petService.deletePet(id);
    if (!deletedPet.success) {
      return res.status(404).json({
        error: true,
        message: "Pet not found or not deleted",
      });
    }
    return res.status(200).json({
      error: false,
      message: "Pet deleted successfully",
      data: deletedPet.data,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Server Error",
    });
  }
};

module.exports = {
  // public routes
  getAllPetPublic,
  getSinglePet,
  // admin only routes
  createPet,
  getAllPetAdmin,
  updatePet,
  deletePet,
};

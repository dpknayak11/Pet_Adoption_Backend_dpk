const joi = require("joi");
const moment = require("moment-timezone");
const adoptionsService = require("../services/adoptions.service");
const sendNotification = require("../utils/sendNotification");

// Create Adoption user only
let createAdoptions = async (req, res) => {
  try {
    const schema = joi.object({
      petId: joi.string().required(),
      note: joi.string().allow("").optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }
    const adoptionData = {
      userId: req.user.id,
      petId: req.body.petId,
      note: req.body.note,
      status: "PENDING",
    };
    const existing = await adoptionsService.getAdoptionsByOne({
      userId: req.user.id,
      petId: req.body.petId,
    });
    if (existing.success) {
      return res.status(404).json({
        error: true,
        message: "Adoption request already exists",
      });
    }

    const result = await adoptionsService.createAdoptions(adoptionData);
    if (!result.success) {
      return res.status(400).json({
        error: true,
        message: result.message || "Adoption request failed",
      });
    }
    return res.status(201).json({
      error: false,
      message: "Adoption request submitted",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Server Error",
    });
  }
};

// 🔹 Update Adoption (Admin Only)
const updateAdoptions = async (req, res) => {
  try {

    // 🔐 Role Check
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: true,
        message: "Access denied. Admin only.",
      });
    }

    // 🔹 Validation Schema
    const schema = joi.object({
      status: joi
        .string()
        .valid("PENDING", "APPROVED", "REJECTED")
        .required(),
      notes: joi.string().allow("").optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }

    // 🔹 Add Approved Date
    if (req.body.status === "APPROVED") {
      req.body.approvedDate = moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");
    }

    // 🔹 Update Adoption
    const result = await adoptionsService.updateAdoptions(
      req.params.id,
      req.body
    );

    if (!result?.success) {
      return res.status(404).json({
        error: true,
        message: "Adoption not found",
      });
    }

    const adoption = result.data;

    // 🔔 Send Notification (Only if token exists)
    if (adoption?.user?.fcmToken) {
      await sendNotification({
        fcmToken: adoption?.user?.fcmToken,
        title: "Adoption Request Updated 🐾",
        body: `Your adoption request for ${adoption.pet?.name || "Pet"} has been ${adoption?.status || "PENDING"}.`,
      });
    }

    return res.status(200).json({
      error: false,
      message: "Adoption updated successfully",
      data: adoption,
    });

  } catch (error) {
    console.error("Update Adoption Error:", error);

    return res.status(500).json({
      error: true,
      message: error.message || "Server Error",
    });
  }
};

// Delete Adoption Admin Only
let deleteAdoptions = async (req, res) => {
  try {
    const schema = joi.object({
      id: joi.string().required(),
    });
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }
    const result = await adoptionsService.deleteAdoptions(req.params.id);
    if (!result.success) {
      return res.status(404).json({
        error: true,
        message: "Adoption not found",
      });
    }
    return res.status(200).json({
      error: false,
      message: "Adoption deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// get all Adoptions
let getAllAdoptions = async (req, res) => {
  try {
    const { role } = req.user;
    let filter = {};
    // If normal USER only their adoptions
    if (role === "USER") {
      filter.userId = req.user._id;
    }
    const result = await adoptionsService.getAllAdoptions(filter);
    if (!result.success) {
      return res.status(404).json({
        error: true,
        message: "No adoptions found",
      });
    }
    return res.status(200).json({
      error: false,
      message: "Adoptions fetched successfully",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// get single Adoption
let getSingleAdoption = async (req, res) => {
  try {
    const { role } = req.user;
    let filter = { _id: req.params.id };
    // If USER → can only access their own adoption
    if (role === "USER") {
      filter.userId = req.user._id;
    }
    const result = await adoptionsService.getAdoptionsByOne(filter);
    if (!result.success) {
      return res.status(404).json({
        error: true,
        message: "Adoption not found",
      });
    }
    return res.status(200).json({
      error: false,
      message: "Adoption fetched successfully",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  createAdoptions,
  updateAdoptions,
  deleteAdoptions,
  getAllAdoptions,
  getSingleAdoption,
};

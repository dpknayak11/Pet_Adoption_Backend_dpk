const joi = require("joi");
const bcrypt = require("bcryptjs");
const userService = require("../services/user.service");
const { generateToken } = require("../middlewares/auth.middleware");

// REGISTER USER
const registerUser = async (req, res) => {
  const schema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    phone: joi.string().allow("", null),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: true,
      message: error.details[0].message,
    });
  }
  try {
    let { email } = req.body;
    // Check existing email
    const existUser = await userService.getUserByOne({ email: email });
    if (existUser.success) {
      return res.status(409).json({
        error: true,
        message: "User already exists",
      });
    }
    // Force role USER if not provided
    req.body.role = "USER";
    const result = await userService.saveUser(req.body);
    if (!result.success) {
      return res.status(500).json({
        error: true,
        message: "User creation failed",
      });
    }

    const token = await generateToken(result.data);

    return res.status(201).json({
      error: false,
      message: "User created successfully",
      data: {
        user: result.data,
        token: token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

// GET ALL USERS (ADMIN ONLY)
const getAllUser = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: true,
        message: "Not authorized",
      });
    }
    const usersList = await userService.getAllUser({});
    return res.status(200).json({
      error: false,
      data: usersList.data,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: true,
      message: error.details[0].message,
    });
  }
  try {
    let value = req.body;
    // Select password manually
    const user = await userService.getUserByOne({
      email: value.email,
    });
    if (!user.success) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      value.password,
      user.data.password,
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: true,
        message: "Invalid credentials",
      });
    }
    const token = await generateToken(user.data);
    return res.status(200).json({
      error: false,
      message: "Login successful",
      data: {
        token,
        user: user.data,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  const schema = joi.object({
    id: joi.string().required(),
    name: joi.string().optional(),
    email: joi.string().email().optional(),
    password: joi.string().min(6).optional(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: true,
      message: error.details[0].message,
    });
  }
  try {
    const { id, ...updateData } = value;
    // Check user exists
    const existingUser = await userService.getUserById(id);
    if (!existingUser.success) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
    // Email uniqueness check (only if email changing)
    if (updateData.email && updateData.email !== existingUser.data.email) {
      const emailExists = await userService.getUserByOne({
        email: updateData.email,
      });
      if (emailExists.success) {
        return res.status(409).json({
          error: true,
          message: "Email already exists",
        });
      }
    }

    // Hash password if updating
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    const result = await userService.updateUser(id, updateData);
    return res.status(200).json({
      error: false,
      message: "User updated successfully",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

// create getProfile
const getProfile = async (req, res) => {
  try {
    const profile = await userService.getUserById(req.user._id);
    if (profile.success === false) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
    return res.status(200).json({
      error: false,
      message: "Profile fetched successfully",
      data: profile.data,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

// update fcmTokenUpdate only user
const updateFcmToken = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fcmToken } = req.body;
    if (!fcmToken) {
      return res.status(400).json({
        error: true,
        message: "FCM token is required",
      });
    }
    const updatedUser = await userService.updateUser(userId, { fcmToken });
    if (!updatedUser.success) {
      return res.status(500).json({
        error: true,
        message: "Failed to update FCM token",
      });
    }
    return res.status(200).json({
      error: false,
      message: "FCM token updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  registerUser,
  getAllUser,
  loginUser,
  updateUser,
  getProfile,
  updateFcmToken,
};

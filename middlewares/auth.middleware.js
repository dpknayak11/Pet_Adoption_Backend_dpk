// middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const userService = require("../services/user.service");
const JWT_SECRET = process.env.JWT_SECRET || "change_me_dev_secret";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
};

const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: true,
      message: "Access denied. No token provided.",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        error: true,
        message: "Invalid token payload",
        data: null,
      });
    }

    // call user service
    const userData = await userService.getUserById(decoded.userId);

    if (!userData.success) {
      return res.status(401).json({
        error: true,
        message: "User not found or unauthorized",
        data: null,
      });
    }

    // set user
    req.user = userData.data;
    next();
  } catch (error) {
    let message = "Unauthorized";
    if (error.name === "TokenExpiredError") {
      message = "Token expired";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token";
    }

    return res.status(401).json({
      error: true,
      message: message,
      data: null,
    });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: true,
        message: "You are not authorized to access this resource",
      });
    }
    next();
  };
};
module.exports = { generateToken, isAuth, authorizeRoles };

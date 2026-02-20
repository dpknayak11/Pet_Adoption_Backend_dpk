require("dotenv").config();
const admin = require("../models/User");
const mongoose = require("mongoose");

const MONGODB_URI = process.env.DB_STRING;

// create admin by script file
const createAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    const adminData = {
      name: "adminUser",
      role: "ADMIN",
      email: "admin123@gmail.com",
      password: "admin123",
    };
    const adminUser = new admin(adminData);
    await adminUser.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
};
createAdmin();
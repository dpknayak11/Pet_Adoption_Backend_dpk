const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const getTimestamp = require("../utils/addTimeStamp");

const USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.USER,
  },
  fcmToken: {
    type: String,
    trim: true,
  },
  // ✅ Single FCM Token Field
  fcmToken: {
    type: String,
    trim: true,
  },
  ...getTimestamp(),
});

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
module.exports = mongoose.model("User", userSchema);

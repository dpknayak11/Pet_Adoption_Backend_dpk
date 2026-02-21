// seedPets.js

require("dotenv").config();
const mongoose = require("mongoose");
const Pet = require("../models/Pet");
const petData = require("../petData.json");

const MONGODB_URI = process.env.DB_STRING; // .env me hona chahiye

const seedPets = async () => {
  try {
    // 🔥 Connect DB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected");

    if (!Array.isArray(petData)) {
      throw new Error("petData.json must contain an array");
    }

    // Optional: delete old data
    await Pet.deleteMany();
    const insertedPets = await Pet.insertMany(petData);

    console.log("✅ Data Inserted Successfully");
    console.log("Total:", insertedPets.length);

    process.exit(0);

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedPets();
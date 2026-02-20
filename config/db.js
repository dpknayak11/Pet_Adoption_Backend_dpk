// Mongo connection

const mongoose = require('mongoose');
require("dotenv").config();

const MONGODB_URI = process.env.DB_STRING;

const connectDB = async () => {
    try {
      await mongoose.connect(MONGODB_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
      
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  };

  module.exports = connectDB;
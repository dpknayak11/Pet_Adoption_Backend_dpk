const mongoose = require("mongoose");
const getTimestamp = require("../utils/addTimeStamp");

const PET_GENDERS = {
  MALE: "Male",
  FEMALE: "Female",
};

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  species: {
    type: String,
    required: true,
    trim: true,
  },
  breed: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  gender: {
    type: String,
    enum: Object.values(PET_GENDERS),
    required: true,
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
  },
  color: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  traits: [
    {
      type: String,
      trim: true,
    },
  ],
  vaccinated: {
    type: Boolean,
    default: false,
  },
  adopted: {
    type: Boolean,
    default: false,
  },
  ...getTimestamp(),
});

module.exports = mongoose.model("Pet", petSchema);

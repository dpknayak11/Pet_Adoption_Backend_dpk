const mongoose = require("mongoose");
const getTimestamp = require("../utils/addTimeStamp");
const moment = require("moment-timezone");

const ADOPTIONS_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};
const adoptionsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet",
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ADOPTIONS_STATUS),
    default: ADOPTIONS_STATUS.PENDING,
  },
  approvedDate: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    trim: true,
  },
  ...getTimestamp(),
});

module.exports = mongoose.model("Adoptions", adoptionsSchema);

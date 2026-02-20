// timestamp using moment
const moment = require("moment-timezone");

// write inside date, month, year, creatAt, createdTiem

function getTimestamp() {
  return {
    isDisable: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Number,
      default: () => moment().tz("Asia/Kolkata").startOf("day").valueOf(),
    },
    month: {
    type: Number,
    default: () => moment().tz("Asia/Kolkata").startOf("month").valueOf(),
    },
    year: {
        type: Number,
        default: () => moment().tz("Asia/Kolkata").startOf("year").valueOf(),
    },
    createdAt: {
      type: Number,
      default: () => moment().tz("Asia/Kolkata").valueOf(),
    },
    createdTime:{
        type: String,
        default: () => moment().tz("Asia/Kolkata").format("HH:mm:ss"),
    }
  };
}
module.exports = getTimestamp;

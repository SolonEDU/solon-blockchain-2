const mongoose = require("mongoose");

const ClubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  president: {
    type: String,
    required: true
  },
  copresident: {
    type: String,
    required: true
  },
  faculty: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Club = mongoose.model("Club", ClubSchema);

module.exports = Club;
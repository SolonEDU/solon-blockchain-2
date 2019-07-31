const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timespan: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Proposal = mongoose.model("Proposal", ProposalSchema);

module.exports = Proposal;
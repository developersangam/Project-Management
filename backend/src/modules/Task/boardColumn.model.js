const mongoose = require("mongoose");

const boardColumnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },

    position: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("BoardColumn", boardColumnSchema);
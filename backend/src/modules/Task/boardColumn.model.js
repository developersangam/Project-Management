const mongoose = require("mongoose");

const boardColumnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
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
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

boardColumnSchema.index(
  { projectId: 1, name: 1 },
  { unique: true }
);

boardColumnSchema.index(
  { projectId: 1, position: 1 },
  { unique: true }
);

module.exports = mongoose.model("BoardColumn", boardColumnSchema);
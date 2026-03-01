const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional future-proofing
    module: {
      type: String,
      enum: ["PROJECT", "TASK"],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
permissionSchema.index({ key: 1 });

module.exports = mongoose.model("Permission", permissionSchema);

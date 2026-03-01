const mongoose = require("mongoose");

const projectRoleSchema = new mongoose.Schema(
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

    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
        required: true,
      },
    ],

    level: {
      type: Number,
      required: [true, "Role level is required"],
      min: [1, "Level must be at least 1"],
      max: [10, "Level cannot exceed 10"],
    },

    isSystem: {
      type: Boolean,
      default: true, // system roles (ADMIN, MANAGER, MEMBER)
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ProjectRole", projectRoleSchema);

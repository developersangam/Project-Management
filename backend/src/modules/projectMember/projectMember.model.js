const mongoose = require("mongoose");

const projectMemberSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    role: {
      type: String,
      enum: ["PROJECT_MANAGER", "DEVELOPER", "TESTER", "VIEWER"],
      default: "DEVELOPER"
    },

    status: {
      type: String,
      enum: ["ACTIVE", "REMOVED"],
      default: "ACTIVE"
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("ProjectMember", projectMemberSchema);
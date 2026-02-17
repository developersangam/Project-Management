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
      enum: ["MANAGER", "CONTRIBUTOR", "VIEWER"],
      default: "CONTRIBUTOR"
    },

    status: {
      type: String,
      enum: ["ACTIVE", "REMOVED"],
      default: "ACTIVE"
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true }
);
projectMemberSchema.index({ userId: 1 });
projectMemberSchema.index({ projectId: 1, status: 1 });
projectMemberSchema.index(
  { projectId: 1, userId: 1 },
  { unique: true }
);

module.exports = mongoose.model("ProjectMember", projectMemberSchema);
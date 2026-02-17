const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    description: {
      type: String,
      trim: true,
      default: ""
    },

    visibility: {
      type: String,
      enum: ["PRIVATE", "ORG_PUBLIC"],
      default: "PRIVATE"
    },

    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED", "DELETED"],
      default: "ACTIVE"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// 🔐 Indexes
projectSchema.index(
  { organizationId: 1, slug: 1 },
  { unique: true }
);
projectSchema.index({ organizationId: 1, status: 1 });

module.exports = mongoose.model("Project", projectSchema);

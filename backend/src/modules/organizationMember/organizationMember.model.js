const mongoose = require("mongoose");

const organizationMemberSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "MEMBER"],
      default: "MEMBER"
    },

    status: {
      type: String,
      enum: ["ACTIVE", "REMOVED"],
      default: "ACTIVE"
    },

    joinedAt: {
      type: Date,
      default: Date.now
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    removedAt: {
      type: Date,
      default: null
    },
    
    removedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);
organizationMemberSchema.index({ organizationId: 1 });
organizationMemberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("OrganizationMember", organizationMemberSchema);
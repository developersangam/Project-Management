const mongoose = require("mongoose");

const organizationInviteSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "MEMBER", "PROJECT_MANAGER"],
      default: "MEMBER",
      required: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "EXPIRED", "REVOKED"],
      default: "PENDING",
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    revokedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    
    revokedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

organizationInviteSchema.index({ organizationId: 1, status: 1 });
organizationInviteSchema.index({ organizationId: 1, email: 1 });
organizationInviteSchema.index({ expiresAt: 1 });

module.exports = mongoose.model("OrganizationInvite", organizationInviteSchema);

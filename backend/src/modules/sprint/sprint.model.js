const mongoose = require("mongoose");
const sprintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    goal: {
      type: String,
      default: "",
    },

    startDate: Date,
    endDate: Date,

    status: {
      type: String,
      enum: ["PLANNED", "ACTIVE", "COMPLETED"],
      default: "PLANNED",
    },
  },
  {
    timestamps: true,
  },
);

sprintSchema.index({
  projectId: 1,
  status: 1
});

sprintSchema.index({
  organizationId: 1
});

module.exports = mongoose.model("Sprint", sprintSchema);

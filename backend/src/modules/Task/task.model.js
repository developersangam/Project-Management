const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    description: { type: String, default: "" },

    sprintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sprint",
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

    columnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoardColumn",
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: Object.values(TASK_PRIORITY),
      default: "MEDIUM",
    },

    position: {
      type: Number,
      required: true,
      index: true,
    },

    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dueDate: Date,

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

taskSchema.index({ projectId: 1, createdAt: -1 });
taskSchema.index({ projectId: 1, createdAt: -1, _id: -1 });
taskSchema.index({ assigneeId: 1, status: 1 });
taskSchema.index({ organizationId: 1 });
taskSchema.index({
  projectId: 1,
  status: 1,
  position: 1,
});

module.exports = mongoose.model("Task", taskSchema);

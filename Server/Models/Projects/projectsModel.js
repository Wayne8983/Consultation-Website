const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Not Paid", "Submitted", "Received"],
      default: "Not Paid",
    },
    paymentReference: { type: String, trim: true, default: "" },
    paymentNote: { type: String, trim: true, default: "" },
    paidAt: { type: Date, default: null },
    paymentConfirmedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const projectSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Completed", "Paused", "Cancelled"],
      default: "Active",
    },

    startDate: {
      type: Date,
      required: true,
    },

    deadline: {
      type: Date,
    },

    completedDate: {
      type: Date,
    },

    budget: {
      type: Number,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    notes: {
      type: String,
    },

    milestones: {
      type: [milestoneSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    title: {
      type: String,
      required: [true, "A document title is required"],
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "uploadedByModel",
    },
    uploadedByModel: {
      type: String,
      required: true,
      enum: ["Admin", "Client"],
    },
  },
  {
    timestamps: true,
  }
);

const Documents = mongoose.model("Documents", documentSchema);

module.exports = Documents;
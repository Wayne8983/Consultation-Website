const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Documents = require("../../Models/Documents/Documents.model");
const Client = require("../../Models/Clients/Client.model");

const getAdminDocuments = async (req, res) => {
  try {
    const documents = await Documents.find({})
      .populate("client", "name email")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getClientDocuments = async (req, res) => {
  try {
    const documents = await Documents.find({
      client: req.user.id,
    })
      .populate("client", "name email")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const uploadAdminDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client id",
      });
    }

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Document title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required",
      });
    }

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const document = await Documents.create({
      client: id,
      title,
      content,
      fileUrl: `/uploads/documents/${req.file.filename}`,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
      uploadedByModel: "Admin",
    });

    const populatedDocument = await Documents.findById(document._id)
      .populate("client", "name email")
      .populate("uploadedBy", "name email");

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: populatedDocument,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

const uploadClientDocument = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Document title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required",
      });
    }

    const document = await Documents.create({
      client: req.user.id,
      title,
      content,
      fileUrl: `/uploads/documents/${req.file.filename}`,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
      uploadedByModel: "Client",
    });

    const populatedDocument = await Documents.findById(document._id)
      .populate("client", "name email")
      .populate("uploadedBy", "name email");

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: populatedDocument,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

const deleteAdminDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Documents.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const filePath = path.join(__dirname, "../../", document.fileUrl);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await document.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteClientDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Documents.findOne({
      _id: id,
      client: req.user.id,
      uploadedBy: req.user.id,
      uploadedByModel: "Client",
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found or you cannot delete it",
      });
    }

    const filePath = path.join(__dirname, "../../", document.fileUrl);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await document.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAdminDocuments,
  getClientDocuments,
  uploadAdminDocument,
  uploadClientDocument,
  deleteAdminDocument,
  deleteClientDocument,
};
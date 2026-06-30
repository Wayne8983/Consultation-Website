const Consultations = require("../../Models/Consultations/Consultation.model");
const Client = require("../../Models/Clients/Client.model");
const Admin = require("../../Models/Admin/Admin.model");
const generateStrongPassword = require("../../Services/generateRandomPassword");
const { HashPassword, ConfirmHash } = require("../../Utils/HashPassword");
const mongoose = require("mongoose");
const Project = require("../../Models/Projects/projectsModel");
const Meeting = require("../../Models/Meetings/Meeting.model");
const Documents = require("../../Models/Documents/Documents.model");
const {
  sendConsultationApprovedEmail,
  sendConsultationRejectedEmail,
} = require("../../Services/mailService");

const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultations.find({});

    return res.status(200).json({
      success: true,
      count: consultations.length,
      consultations,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.please try again later!",
    });
  }
};

const getOneConsultation = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Consultation not found!",
      });
    }

    const consultation = await Consultations.findById(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Invalid consultation",
      });
    }

    return res.status(200).json({
      success: true,
      consultation,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.please try again later",
    });
  }
};

const approveConsultation = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Invalid client!",
      });
    }

    const consultation = await Consultations.findById(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Invalid consultation or consultation does not exist!",
      });
    }

    if (consultation.status === "Approved") {
      return res.status(400).json({
        success: false,
        message: "consultation is already approved",
      });
    }

    const client = await Client.findOne({ email: consultation.email });

    if (client) {
      return res.status(409).json({
        success: false,
        message: "This consultation cannot be approved because a client account already exists",
      });
    }

    const password = generateStrongPassword();
    const hash = await HashPassword(password);

    await Client.create({
      name: consultation.name,
      email: consultation.email,
      password: hash,
      phone: consultation.phone,
      company: consultation.company,
      consultationId: consultation._id,
      status: "Active",
    });

    await sendConsultationApprovedEmail({
      to: consultation.email,
      name: consultation.name,
      email: consultation.email,
      temporaryPassword: password,
    });

    consultation.status = "Approved";
    consultation.reviewedAt = new Date();
    await consultation.save();

    return res.status(200).json({
      success: true,
      message: "Consultation approved and client account created successfully.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server error.Please try again later.",
    });
  }
};

const allClients = async (req, res) => {
  try {
    const clients = await Client.find({}).select("-password");

    return res.status(200).json({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.Please try again later",
    });
  }
};

const oneClient = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Invalid client!",
      });
    }

    const client = await Client.findById(id).select("-password -mustChangePassword");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Invalid client",
      });
    }

    return res.status(200).json({
      success: true,
      client,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server error please try again later",
    });
  }
};

const rejected = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation!",
      });
    }

    const consultation = await Consultations.findById(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    if (consultation.status === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Already approved consultations cannot be rejected",
      });
    }

    if (consultation.status === "Rejected") {
      return res.status(400).json({
        success: false,
        message: "Consultation already rejected",
      });
    }

    consultation.status = "Rejected";
    consultation.reviewedAt = new Date();
    await consultation.save();

    await sendConsultationRejectedEmail({
      to: consultation.email,
      name: consultation.name,
    });

    return res.status(200).json({
      success: true,
      message: "consultation request was successfully rejected",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error please try again later",
    });
  }
};

const pendingConsultations = async (req, res) => {
  try {
    const pending = await Consultations.find({ status: "Pending" });

    return res.status(200).json({
      success: true,
      count: pending.length,
      pending,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server erro please tru again later",
    });
  }
};

const adminDashboard = async (req, res) => {
  try {
    const clients = await Client.countDocuments({});
    const consultations = await Consultations.countDocuments({});
    const Projects = await Project.countDocuments({});

    const pendingConsultations = await Consultations.countDocuments({
      status: "Pending",
    });

    const rejectedConsultations = await Consultations.countDocuments({
      status: "Rejected",
    });

    const approvedConsultations = await Consultations.countDocuments({
      status: "Approved",
    });

    const recentConsultations = await Consultations.find({})
      .sort({ updatedAt: -1 })
      .limit(3)
      .select("name email status projectType createdAt updatedAt");

    const recentClients = await Client.find({})
      .sort({ updatedAt: -1 })
      .limit(3)
      .select("name email status company createdAt updatedAt");

    const recentProjects = await Project.find({})
      .sort({ updatedAt: -1 })
      .limit(3)
      .populate("client", "name email")
      .select("title status progress client createdAt updatedAt");

    const recentMeetings = await Meeting.find({})
      .sort({ updatedAt: -1 })
      .limit(3)
      .populate("client", "name email")
      .select("title status meetingDate client createdAt updatedAt");

    const recentDocuments = await Documents.find({})
      .sort({ updatedAt: -1 })
      .limit(3)
      .populate("client", "name email")
      .populate("uploadedBy", "name email")
      .select("title originalName uploadedByModel client uploadedBy createdAt updatedAt");

    const recentActivities = [
      ...recentConsultations.map((item) => ({
        id: item._id,
        type: "consultation",
        title: `${item.name} submitted a consultation`,
        detail: `${item.projectType || "Consultation"} is ${item.status}.`,
        date: item.updatedAt || item.createdAt,
      })),

      ...recentClients.map((item) => ({
        id: item._id,
        type: "client",
        title: `${item.name} client account`,
        detail: `${item.email} is currently ${item.status}.`,
        date: item.updatedAt || item.createdAt,
      })),

      ...recentProjects.map((item) => ({
        id: item._id,
        type: "project",
        title: item.title,
        detail: `${item.client?.name || "Client"} project is ${item.status || "Active"} at ${item.progress || 0}%.`,
        date: item.updatedAt || item.createdAt,
      })),

      ...recentMeetings.map((item) => ({
        id: item._id,
        type: "meeting",
        title: item.title,
        detail: `${item.client?.name || "Client"} meeting is ${item.status}.`,
        date: item.updatedAt || item.createdAt,
      })),

      ...recentDocuments.map((item) => ({
        id: item._id,
        type: "document",
        title: item.title,
        detail: `${item.uploadedByModel === "Admin" ? "Admin shared" : "Client uploaded"} ${item.originalName}.`,
        date: item.updatedAt || item.createdAt,
      })),
    ]
      .filter((activity) => activity.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      stats: {
        Projects,
        clients,
        consultations,
        pendingConsultations,
        approvedConsultations,
        rejectedConsultations,
      },
      recentActivities,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.please try again later",
    });
  }
};


const changeAdminPassword = async (req, res) => {
  try {
    const id = req.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin!",
      });
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all password fields",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }

    const isMatch = await ConfirmHash(oldPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid old password",
      });
    }

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPassword.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
      });
    }

    const samePassword = await ConfirmHash(newPassword, admin.password);

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the old password",
      });
    }

    admin.password = await HashPassword(newPassword);
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin password updated successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};




module.exports = {
  getAllConsultations,
  approveConsultation,
  changeAdminPassword,
  allClients,
  oneClient,
  rejected,
  pendingConsultations,
  adminDashboard,
  getOneConsultation,
};
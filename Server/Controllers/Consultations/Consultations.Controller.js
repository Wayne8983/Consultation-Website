const Consultation = require("../../Models/Consultations/Consultation.model");
const {
  normalizeEmail,
  stripUnsafeInput,
  validateText,
} = require("../../Utils/validation");

const bookConsultation = async (req, res) => {
  try {
    const nameResult = validateText({
      value: req.body.name,
      field: "Name",
      min: 2,
      max: 80,
    });

    const descriptionResult = validateText({
      value: req.body.description,
      field: "Project description",
      min: 20,
      max: 1000,
    });

    const email = normalizeEmail(req.body.email);
    const phone = stripUnsafeInput(req.body.phone);
    const company = stripUnsafeInput(req.body.company).slice(0, 120) || null;
    const projectType = stripUnsafeInput(req.body.projectType).slice(0, 80);
    const preferredContactMethod = stripUnsafeInput(
      req.body.preferredContactMethod
    ).toLowerCase();

    const validContactMethods = ["email", "phone", "whatsapp", "any"];

    if (
      nameResult.error ||
      descriptionResult.error ||
      !email ||
      !phone ||
      !projectType ||
      !preferredContactMethod
    ) {
      return res.status(400).json({
        success: false,
        message:
          nameResult.error ||
          descriptionResult.error ||
          "Please fill in all the required fields",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (!/^\+?[0-9\s().-]{7,20}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number",
      });
    }

    if (!validContactMethods.includes(preferredContactMethod)) {
      return res.status(400).json({
        success: false,
        message: "Please choose a valid contact method",
      });
    }

    const existingConsultation = await Consultation.findOne({
      $or: [{ email: { $eq: email } }, { phone: { $eq: phone } }],
    });

    if (existingConsultation) {
      const duplicateField =
        existingConsultation.email === email ? "email" : "phone number";

      return res.status(409).json({
        success: false,
        message: `A consultation request with this ${duplicateField} already exists`,
      });
    }

    await Consultation.create({
      name: nameResult.value,
      email,
      phone,
      company,
      projectType,
      description: descriptionResult.value,
      preferredContactMethod,
    });

    return res.status(201).json({
      success: true,
      message: "Consultation request sent successfully",
    });
  } catch (err) {
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern || {})[0] || "field";

      return res.status(409).json({
        success: false,
        message: `A consultation request with this ${duplicateField} already exists`,
      });
    }

    if (err.name === "ValidationError") {
      const formattedErrors = {};

      Object.keys(err.errors).forEach((key) => {
        formattedErrors[key] = err.errors[key].message;
      });

      return res.status(400).json({
        success: false,
        errors: formattedErrors,
      });
    }

    console.log("Consultation booking error", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later",
    });
  }
};

module.exports = bookConsultation;
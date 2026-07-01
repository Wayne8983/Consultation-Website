const Contact = require("../../Models/ContactMessage/ContactMessage");
const { sendContactMessageReceivedEmail } = require("../../Services/mailService");
const { normalizeEmail, validateText } = require("../../Utils/validation");

const contactMessage = async (req, res) => {
  try {
    const nameResult = validateText({
      value: req.body.name,
      field: "Name",
      min: 2,
      max: 80,
    });

    const messageResult = validateText({
      value: req.body.message,
      field: "Message",
      min: 10,
      max: 1000,
    });

    const email = normalizeEmail(req.body.email);

    if (nameResult.error || messageResult.error || !email) {
      return res.status(400).json({
        success: false,
        message: nameResult.error || messageResult.error || "Email is required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    await Contact.create({
      name: nameResult.value,
      email,
      message: messageResult.value,
    });

    await sendContactMessageReceivedEmail({
      to: email,
      name: nameResult.value,
    });

    return res.status(201).json({
      success: true,
      message: "Contact message sent successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server error. Please try again later",
    });
  }
};

const allContactMessages = async (req, res) => {
  try {
    const allMessages = await Contact.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      allMessages,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error please try again later",
    });
  }
};

module.exports = { contactMessage, allContactMessages };
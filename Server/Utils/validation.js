const validator = require("validator");

const stripUnsafeInput = (value) => {
  if (typeof value !== "string") return "";

  return validator
    .stripLow(value.replace(/<[^>]*>/g, ""), true)
    .trim();
};

const normalizeEmail = (value) => {
  const email = stripUnsafeInput(value).toLowerCase();
  return validator.normalizeEmail(email) || email;
};

const validateText = ({ value, field, min = 1, max, required = true }) => {
  const cleaned = stripUnsafeInput(value);

  if (required && !cleaned) {
    return { error: `${field} is required` };
  }

  if (cleaned && cleaned.length < min) {
    return { error: `${field} must be at least ${min} characters` };
  }

  if (max && cleaned.length > max) {
    return { error: `${field} cannot exceed ${max} characters` };
  }

  return { value: cleaned };
};

module.exports = {
  normalizeEmail,
  stripUnsafeInput,
  validateText,
};
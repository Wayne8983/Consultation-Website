const sanitizeKey = (key) => {
  return key.replace(/\$/g, "").replace(/\./g, "");
};

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return sanitizeObject(value);
  }

  if (typeof value === "string") {
    return value.replace(/\0/g, "").trim();
  }

  return value;
};

const sanitizeObject = (object) => {
  Object.keys(object).forEach((key) => {
    const cleanKey = sanitizeKey(key);
    const cleanValue = sanitizeValue(object[key]);

    if (cleanKey !== key) {
      delete object[key];
    }

    object[cleanKey] = cleanValue;
  });

  return object;
};

const sanitizeRequest = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    sanitizeObject(req.body);
  }

  if (req.params && typeof req.params === "object") {
    sanitizeObject(req.params);
  }

  if (req.query && typeof req.query === "object") {
    sanitizeObject(req.query);
  }

  next();
};

module.exports = sanitizeRequest;
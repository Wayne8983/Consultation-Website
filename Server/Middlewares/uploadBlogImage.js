const multer = require("multer");

const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const uploadBlogImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only PNG, JPG, JPEG and WEBP images are allowed"));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = uploadBlogImage;
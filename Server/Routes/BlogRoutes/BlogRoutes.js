const express = require("express");
const authenticate = require("../../Middlewares/AuthMiddleware");
const Authorize = require("../../Middlewares/Authorize");
const uploadBlogImage = require("../../Middlewares/uploadBlogImage");

const {
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
} = require("../../Controllers/BlogController/BlogController");

const router = express.Router();

router.get("/blogs/public", getPublishedBlogs);
router.get("/blogs/:id", getSingleBlog);

router.post(
  "/blogs",
  authenticate,
  Authorize("admin"),
  uploadBlogImage.single("coverImage"),
  createBlog
);

router.get("/blogs", authenticate, Authorize("admin"), getAllBlogs);

router.patch(
  "/blogs/:id",
  authenticate,
  Authorize("admin"),
  uploadBlogImage.single("coverImage"),
  updateBlog
);

router.delete("/blogs/:id", authenticate, Authorize("admin"), deleteBlog);

module.exports = router;
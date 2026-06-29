const express = require("express");
const authenticate = require("../../Middlewares/AuthMiddleware");
const Authorize = require("../../Middlewares/Authorize");

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

router.post("/blogs", authenticate, Authorize("admin"), createBlog);
router.get("/blogs", authenticate, Authorize("admin"), getAllBlogs);
router.patch("/blogs/:id", authenticate, Authorize("admin"), updateBlog);
router.delete("/blogs/:id", authenticate, Authorize("admin"), deleteBlog);

module.exports = router;
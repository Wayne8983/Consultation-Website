const mongoose = require("mongoose");
const Blog = require("../../Models/Blog/blog.model");
const { uploadImageBuffer, deleteImage } = require("../../Config/cloudinary");

const normalizeTags = (tags) => {
  if (!tags) return [];

  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const createBlog = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      coverImage,
      category,
      status,
      seoTitle,
      seoDescription,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required!",
      });
    }

    let uploadedImage = null;

    if (req.file) {
      uploadedImage = await uploadImageBuffer(req.file.buffer, "blogs");
    }

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      coverImage: uploadedImage?.secure_url || coverImage || "",
      coverImagePublicId: uploadedImage?.public_id || "",
      category,
      tags: normalizeTags(req.body.tags),
      status,
      seoTitle,
      seoDescription,
      author: req.user.id,
    });

    const populatedBlog = await Blog.findById(blog._id).populate(
      "author",
      "name email"
    );

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: populatedBlog,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A blog with this slug already exists",
      });
    }

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      status: "Published",
      published: true,
    })
      .populate("author", "name email")
      .sort({ publishedAt: -1 });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { slug: id };

    const blog = await Blog.findOne(query).populate("author", "name email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.views += 1;
    await blog.save();

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (req.file) {
      if (blog.coverImagePublicId) {
        await deleteImage(blog.coverImagePublicId);
      }

      const uploadedImage = await uploadImageBuffer(req.file.buffer, "blogs");
      blog.coverImage = uploadedImage.secure_url;
      blog.coverImagePublicId = uploadedImage.public_id;
    }

    const allowedFields = [
      "title",
      "slug",
      "excerpt",
      "content",
      "category",
      "status",
      "seoTitle",
      "seoDescription",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        blog[field] = req.body[field];
      }
    });

    if (req.body.tags !== undefined) {
      blog.tags = normalizeTags(req.body.tags);
    }

    await blog.save();

    const updatedBlog = await Blog.findById(blog._id).populate(
      "author",
      "name email"
    );

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A blog with this slug already exists",
      });
    }

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.coverImagePublicId) {
      await deleteImage(blog.coverImagePublicId);
    }

    await blog.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
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
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
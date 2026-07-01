const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [120, "Title cannot be more than 120 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    excerpt: {
      type: String,
      trim: true,
      maxlength: [250, "Excerpt cannot be more than 250 characters"],
    },

    content: {
      type: String,
      required: [true, "Blog content is required"],
    },

    coverImage: {
      type: String,
      default: "",
    },
    coverImagePublicId: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      trim: true,
      default: "General",
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },

    published: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    readingTime: {
      type: Number,
      default: 1,
    },

    views: {
      type: Number,
      default: 0,
    },

    seoTitle: {
      type: String,
      trim: true,
      maxlength: [160, "SEO title cannot be more than 160 characters"],
    },

    seoDescription: {
      type: String,
      trim: true,
      maxlength: [250, "SEO description cannot be more than 250 characters"],
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre("validate", function () {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  if (this.content) {
    const words = this.content.trim().split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(words / 200));
  }

  if (this.status === "Published") {
    this.published = true;
    this.publishedAt = this.publishedAt || new Date();
  } else {
    this.published = false;
    this.publishedAt = null;
  }
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
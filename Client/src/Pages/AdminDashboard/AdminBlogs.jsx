import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiEdit3,
  FiEye,
  FiFileText,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import api from "../../Service/axios";
import { DashboardSkeleton } from "../Skeleton/Skeleton";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  coverImageFile: null,
  category: "General",
  tags: "",
  status: "Draft",
  seoTitle: "",
  seoDescription: "",
};

const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.status === 401) return "You are not logged in or your session expired.";
  if (err.response?.status === 403) return "This account is not allowed to manage blogs.";
  if (err.code === "ERR_NETWORK") return "Cannot connect to the backend. Make sure the server is running.";
  return "Something went wrong while loading blogs.";
};

const formatDate = (dateValue) => {
  if (!dateValue) return "Not published";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchBlogs = async () => {
    try {
      setPageError("");

      const res = await api.get("/blog/blogs");
      const data = res.data?.blogs;

      if (Array.isArray(data)) {
        setBlogs(data);
      } else {
        setBlogs([]);
        setPageError("Backend response did not include a blogs array.");
      }
    } catch (err) {
      console.log(err);
      setBlogs([]);
      setPageError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadBlogs = async () => {
      try {
        setPageError("");

        const res = await api.get("/blog/blogs");
        const data = res.data?.blogs;

        if (cancelled) return;

        if (Array.isArray(data)) {
          setBlogs(data);
        } else {
          setBlogs([]);
          setPageError("Backend response did not include a blogs array.");
        }
      } catch (err) {
        if (cancelled) return;

        console.log(err);
        setBlogs([]);
        setPageError(getErrorMessage(err));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBlogs();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredBlogs = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return blogs;

    return blogs.filter((blog) =>
      [blog.title, blog.category, blog.status, blog.excerpt, ...(blog.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [search, blogs]);

  const openCreateModal = () => {
    setSelectedBlog(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      coverImage: blog.coverImage || "",
      coverImageFile: null,
      category: blog.category || "General",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      status: blog.status || "Draft",
      seoTitle: blog.seoTitle || "",
      seoDescription: blog.seoDescription || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.title.trim() || !form.content.trim()) {
      setFormError("Title and content are required.");
      return;
    }

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("excerpt", form.excerpt);
    formData.append("content", form.content);
    formData.append("category", form.category);
    formData.append("status", form.status);
    formData.append("seoTitle", form.seoTitle);
    formData.append("seoDescription", form.seoDescription);

    const tags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    tags.forEach((tag) => formData.append("tags", tag));

    if (form.coverImageFile) {
      formData.append("coverImage", form.coverImageFile);
    }

    try {
      setActionLoading(true);

      if (selectedBlog) {
        await api.patch(`/blog/blogs/${selectedBlog._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/blog/blogs", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchBlogs();
      closeModal();
    } catch (err) {
      console.log(err);
      setFormError(err.response?.data?.message || "Failed to save blog.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteBlog = async () => {
    if (!deleteTarget?._id) return;

    try {
      setActionLoading(true);

      await api.delete(`/blog/blogs/${deleteTarget._id}`);
      await fetchBlogs();

      setDeleteTarget(null);
    } catch (err) {
      console.log(err);
      setPageError(err.response?.data?.message || "Failed to delete blog.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  const publishedCount = blogs.filter((blog) => blog.status === "Published").length;
  const draftCount = blogs.filter((blog) => blog.status === "Draft").length;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-red-900/20 bg-black/40 backdrop-blur-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,.08)]">
        <div className="absolute -top-28 -right-20 h-72 w-72 rounded-full bg-red-700/10 blur-[100px]" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-red-400 text-xs uppercase tracking-[0.35em] mb-3">
              Content Studio
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Blogs
            </h1>

            <p className="text-gray-400 mt-3 max-w-2xl">
              Create, edit and publish insights that appear on the public Insights page.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-red-600/15 border border-red-500/30 px-5 py-4 text-red-300 hover:bg-red-600/25 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,.12)]"
          >
            <FiPlus />
            New Blog
          </button>
        </div>
      </section>

      {pageError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 flex gap-3 text-red-200">
          <FiAlertTriangle className="mt-1 shrink-0" />

          <div>
            <p className="font-medium">Could not load blogs</p>
            <p className="text-sm text-red-200/80 mt-1">{pageError}</p>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard label="Total Blogs" value={blogs.length} icon={<FiFileText />} />
        <StatCard label="Published" value={publishedCount} icon={<FiCheckCircle />} />
        <StatCard label="Drafts" value={draftCount} icon={<FiEdit3 />} />
      </section>

      <section className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Blog Library
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage all drafts and published articles.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-red-900/20 px-4 py-3 lg:w-80">
            <FiSearch className="text-red-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs..."
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          {!pageError && filteredBlogs.length === 0 ? (
            <p className="text-gray-400">No blogs found.</p>
          ) : (
            filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-5 hover:bg-red-600/[0.06] hover:border-red-500/30 transition-all"
              >
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 overflow-hidden">
                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FiFileText size={22} />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-white font-semibold text-lg">
                          {blog.title}
                        </h3>

                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            blog.status === "Published"
                              ? "bg-green-500/15 text-green-400"
                              : blog.status === "Archived"
                              ? "bg-gray-500/15 text-gray-400"
                              : "bg-yellow-500/15 text-yellow-400"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </div>

                      <p className="text-gray-500 text-sm mt-1">
                        {blog.category || "General"} |{" "}
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </p>

                      <p className="text-gray-400 mt-3 max-w-3xl">
                        {blog.excerpt || "No excerpt added."}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {(blog.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full bg-red-600/10 text-red-300 text-xs border border-red-500/20"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => window.open("/insights", "_blank")}
                      className="h-11 w-11 rounded-xl bg-white/[0.04] border border-red-900/20 text-gray-300 hover:bg-red-600/10 hover:text-white flex items-center justify-center"
                      title="View insights page"
                    >
                      <FiEye />
                    </button>

                    <button
                      onClick={() => openEditModal(blog)}
                      className="h-11 w-11 rounded-xl bg-white/[0.04] border border-red-900/20 text-gray-300 hover:bg-red-600/10 hover:text-white flex items-center justify-center"
                      title="Edit blog"
                    >
                      <FiEdit3 />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(blog)}
                      disabled={actionLoading}
                      className="h-11 w-11 rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600/20 flex items-center justify-center disabled:opacity-50"
                      title="Delete blog"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {showModal && (
        <Modal title={selectedBlog ? "Edit Blog" : "Create Blog"} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={form.title}
              onChange={(value) => setForm({ ...form, title: value })}
              required
            />

            <Input
              label="Excerpt"
              value={form.excerpt}
              onChange={(value) => setForm({ ...form, excerpt: value })}
            />

            <Textarea
              label="Content"
              rows="8"
              value={form.content}
              onChange={(value) => setForm({ ...form, content: value })}
              required
            />

            <div className="grid md:grid-cols-2 gap-4">
              <ImageInput form={form} setForm={setForm} />

              <Input
                label="Category"
                value={form.category}
                onChange={(value) => setForm({ ...form, category: value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Tags"
                placeholder="strategy, growth, leadership"
                value={form.tags}
                onChange={(value) => setForm({ ...form, tags: value })}
              />

              <label className="block">
                <span className="text-sm text-gray-400">Status</span>

                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-red-900/20 bg-[#111] px-4 py-3 text-white outline-none focus:border-red-500/40"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </select>
              </label>
            </div>

            <Input
              label="SEO Title"
              value={form.seoTitle}
              onChange={(value) => setForm({ ...form, seoTitle: value })}
            />

            <Textarea
              label="SEO Description"
              rows="3"
              value={form.seoDescription}
              onChange={(value) => setForm({ ...form, seoDescription: value })}
            />

            {formError && (
              <p className="rounded-xl border border-red-500/20 bg-red-600/10 px-4 py-3 text-sm text-red-300">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {actionLoading ? "Saving..." : selectedBlog ? "Update Blog" : "Save Blog"}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete Blog" onClose={() => setDeleteTarget(null)}>
          <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5">
            <p className="text-white font-medium">
              Are you sure you want to delete this blog?
            </p>

            <p className="text-gray-400 text-sm mt-2">
              "{deleteTarget.title}" will be permanently removed.
            </p>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-gray-300 hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              onClick={deleteBlog}
              disabled={actionLoading}
              className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:opacity-60"
            >
              {actionLoading ? "Deleting..." : "Delete Blog"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const ImageInput = ({ form, setForm }) => {
  const previewUrl = form.coverImageFile
    ? URL.createObjectURL(form.coverImageFile)
    : form.coverImage;

  return (
    <label className="block">
      <span className="text-sm text-gray-400">Cover Image</span>

      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={(e) =>
          setForm({
            ...form,
            coverImageFile: e.target.files?.[0] || null,
          })
        }
        className="mt-2 w-full rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 text-white outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-white hover:file:bg-red-700"
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Blog cover preview"
          className="mt-3 h-32 w-full rounded-xl object-cover border border-red-900/20"
        />
      )}
    </label>
  );
};

const StatCard = ({ label, value, icon }) => {
  return (
    <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] backdrop-blur-xl p-5 hover:border-red-500/30 hover:bg-red-600/[0.06] transition-all">
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
          {icon}
        </div>

        <span className="text-xs text-gray-500 uppercase tracking-widest">
          Blogs
        </span>
      </div>

      <h2 className="text-3xl font-bold text-white mt-5">{value}</h2>

      <p className="text-gray-400 text-sm mt-1">{label}</p>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder = "", required = false }) => {
  return (
    <label className="block">
      <span className="text-sm text-gray-400">{label}</span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-500/40"
      />
    </label>
  );
};

const Textarea = ({ label, value, onChange, rows = "4", required = false }) => {
  return (
    <label className="block">
      <span className="text-sm text-gray-400">{label}</span>

      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-2 w-full resize-none rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-500/40"
      />
    </label>
  );
};

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-red-900/20 bg-[#080808] p-6 shadow-[0_0_45px_rgba(220,38,38,.16)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600/10"
          >
            <FiX />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AdminBlogs;
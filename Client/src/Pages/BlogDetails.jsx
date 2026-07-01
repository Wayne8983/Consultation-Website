import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiAlertTriangle, FiArrowLeft, FiClock, FiFileText, FiUser } from "react-icons/fi";
import api from "../Service/axios";

const formatDate = (dateValue) => {
  if (!dateValue) return "Recently";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Recently";

  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadBlog = async () => {
      try {
        const res = await api.get(`/blog/blogs/${id}`);

        if (cancelled) return;

        setBlog(res.data?.blog || null);
      } catch (err) {
        if (cancelled) return;

        setPageError(err.response?.data?.message || "Could not load this article.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBlog();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b10] pt-40 px-6">
        <div className="max-w-4xl mx-auto h-96 rounded-[28px] border border-red-900/20 bg-white/[0.04] animate-pulse" />
      </main>
    );
  }

  if (pageError || !blog) {
    return (
      <main className="min-h-screen bg-[#0b0b10] pt-40 px-6">
        <div className="max-w-4xl mx-auto rounded-2xl border border-red-500/20 bg-red-600/10 p-5 flex gap-3 text-red-200">
          <FiAlertTriangle className="mt-1 shrink-0" />
          <div>
            <p className="font-medium">Article unavailable</p>
            <p className="text-sm text-red-200/80 mt-1">{pageError}</p>
            <Link to="/insights" className="inline-flex items-center gap-2 mt-4 text-red-300">
              <FiArrowLeft />
              Back to insights
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b10] pt-36 pb-24">
      <article className="max-w-4xl mx-auto px-6">
        <Link
          to="/insights"
          className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 mb-8"
        >
          <FiArrowLeft />
          Back to insights
        </Link>

        <p className="text-red-400 text-sm uppercase tracking-[0.3em]">
          {blog.category || "Insight"}
        </p>

        <h1 className="mt-5 text-4xl md:text-6xl font-bold text-white">
          {blog.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <FiUser className="text-red-400" />
            {blog.author?.name || "DanTech"}
          </span>

          <span className="inline-flex items-center gap-2">
            <FiClock className="text-red-400" />
            {blog.readingTime || 1} min read
          </span>

          <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
        </div>

        <div className="mt-10 overflow-hidden rounded-[28px] border border-red-900/20 bg-white/[0.04]">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="h-[420px] w-full object-cover"
            />
          ) : (
            <div className="h-[320px] flex items-center justify-center bg-red-600/10 text-red-400">
              <FiFileText size={48} />
            </div>
          )}
        </div>

        {blog.excerpt && (
          <p className="mt-10 text-xl text-slate-300 leading-relaxed">
            {blog.excerpt}
          </p>
        )}

        <div className="mt-10 whitespace-pre-line text-slate-400 leading-8">
          {blog.content}
        </div>

        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-red-500/20 bg-red-600/10 px-3 py-1 text-sm text-red-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </main>
  );
};

export default BlogDetails;
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle,
  FiArrowRight,
  FiClock,
  FiFileText,
  FiSearch,
  FiTag,
  FiUser,
} from "react-icons/fi";
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

const Insights = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/blog/blogs/public")
      .then((res) => {
        if (cancelled) return;

        const data = res.data?.blogs;

        if (Array.isArray(data)) {
          setBlogs(data);
        } else {
          setBlogs([]);
          setPageError("No published insights are available yet.");
        }
      })
      .catch((err) => {
        if (cancelled) return;

        console.log(err);
        setBlogs([]);
        setPageError("Could not load insights right now.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredBlogs = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return blogs;

    return blogs.filter((blog) =>
      [blog.title, blog.excerpt, blog.category, ...(blog.tags || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [search, blogs]);

  const featured = filteredBlogs[0];
  const articles = filteredBlogs.slice(1);

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0b10]">
      <section className="relative overflow-hidden pt-40 pb-24">
        <div className="absolute -top-56 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-red-700/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-red-900/10 blur-[140px]" />

        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-red-400">
            Insights
          </span>

          <h1 className="mt-6 text-5xl font-bold text-white md:text-7xl">
            Ideas That Drive <span className="text-red-400">Growth</span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg text-slate-400">
            Explore our latest thinking on strategy, leadership, innovation and
            organizational growth.
          </p>

          <div className="mx-auto mt-10 flex max-w-xl items-center gap-3 rounded-2xl border border-red-900/20 bg-white/[0.04] px-5 py-4 backdrop-blur-xl">
            <FiSearch className="text-red-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search insights..."
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </div>
      </section>

      {pageError && (
        <section className="mx-auto max-w-7xl px-6 pb-8">
          <div className="flex gap-3 rounded-2xl border border-red-500/20 bg-red-600/10 p-5 text-red-200">
            <FiAlertTriangle className="mt-1 shrink-0" />

            <div>
              <p className="font-medium">Insights unavailable</p>
              <p className="mt-1 text-sm text-red-200/80">{pageError}</p>
            </div>
          </div>
        </section>
      )}

      {loading ? (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-[28px] border border-red-900/20 bg-white/[0.04]"
              />
            ))}
          </div>
        </section>
      ) : (
        <>
          {featured && (
            <section className="pb-16">
              <div className="mx-auto max-w-7xl px-6">
                <article className="grid overflow-hidden rounded-[28px] border border-red-900/20 bg-white/[0.04] shadow-[0_0_40px_rgba(220,38,38,.08)] backdrop-blur-xl lg:grid-cols-2">
                  <div className="min-h-[360px] bg-black/40">
                    {featured.coverImage ? (
                      <img
                        src={featured.coverImage}
                        alt={featured.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-red-600/10 text-red-400">
                        <FiFileText size={48} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center p-8 md:p-10">
                    <span className="text-sm uppercase tracking-[0.25em] text-red-400">
                      Featured Insight
                    </span>

                    <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                      {featured.title}
                    </h2>

                    <p className="mt-5 leading-relaxed text-slate-400">
                      {featured.excerpt ||
                        featured.seoDescription ||
                        "Read the latest insight from our consulting team."}
                    </p>

                    <InsightMeta blog={featured} />

                    <Link
                      to={`/insights/${featured.slug || featured._id}`}
                      className="mt-8 inline-flex w-fit items-center gap-3 rounded-2xl border border-red-500/30 bg-red-600/15 px-5 py-4 text-red-300 transition-all hover:bg-red-600/25 hover:text-white"
                    >
                      Read Article
                      <FiArrowRight />
                    </Link>
                  </div>
                </article>
              </div>
            </section>
          )}

          <section className="pb-24">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-10 flex items-end justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-red-400">
                    Latest Articles
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                    Fresh Thinking
                  </h2>
                </div>

                <p className="hidden text-slate-500 md:block">
                  {filteredBlogs.length} published insight
                  {filteredBlogs.length === 1 ? "" : "s"}
                </p>
              </div>

              {filteredBlogs.length === 0 ? (
                <div className="rounded-[28px] border border-red-900/20 bg-white/[0.04] p-10 text-center">
                  <FiFileText className="mx-auto text-red-400" size={36} />

                  <h3 className="mt-5 text-xl font-semibold text-white">
                    No insights found
                  </h3>

                  <p className="mt-2 text-slate-400">
                    Published blogs will appear here once they match your
                    search.
                  </p>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((blog) => (
                    <article
                      key={blog._id}
                      className="group overflow-hidden rounded-[28px] border border-red-900/20 bg-white/[0.04] backdrop-blur-xl transition-all hover:border-red-500/30 hover:bg-red-600/[0.06]"
                    >
                      <div className="h-56 overflow-hidden bg-black/40">
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-red-600/10 text-red-400">
                            <FiFileText size={36} />
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <span className="inline-flex items-center gap-2 text-sm text-red-400">
                          <FiTag />
                          {blog.category || "General"}
                        </span>

                        <h3 className="mt-4 text-2xl font-semibold text-white">
                          {blog.title}
                        </h3>

                        <p className="mt-4 leading-relaxed text-slate-400">
                          {blog.excerpt ||
                            blog.seoDescription ||
                            "Read more from the consulting team."}
                        </p>

                        <InsightMeta blog={blog} />

                        <Link
                          to={`/insights/${blog.slug || blog._id}`}
                          className="mt-6 inline-flex items-center gap-2 text-red-400 transition-all hover:text-red-300"
                        >
                          Read Article
                          <FiArrowRight />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

const InsightMeta = ({ blog }) => {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
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
  );
};

export default Insights;
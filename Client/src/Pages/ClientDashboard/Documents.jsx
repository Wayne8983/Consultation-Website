import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiDownload,
  FiFileText,
  FiFolder,
  FiRefreshCw,
  FiSend,
  FiTrash2,
  FiUploadCloud,
  FiUser,
} from "react-icons/fi";
import api from "../../Service/axios";
import { getUser } from "../../Utils/auth";
import { DashboardSkeleton } from "../Skeleton/Skeleton";

const BackendURL = import.meta.env.VITE_BackendURL;

const emptyForm = {
  title: "",
  content: "",
  file: null,
};

const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.status === 401) return "You are not logged in or your session expired.";
  if (err.response?.status === 403) return "This account is not allowed to view documents.";
  if (err.code === "ERR_NETWORK") return "Cannot connect to the backend. Make sure the server is running.";
  return "Something went wrong while loading documents.";
};

const formatDate = (dateValue) => {
  if (!dateValue) return "No date";
  return new Date(dateValue).toLocaleString();
};

const formatSize = (size) => {
  if (!size) return "Unknown size";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getDownloadUrl = (fileUrl) => {
  if (!fileUrl) return "#";
  return `${BackendURL}${fileUrl}`;
};

const Documents = () => {
  const currentUser = getUser();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/client/documents")
      .then((res) => {
        if (cancelled) return;

        setDocuments(
          Array.isArray(res.data?.documents) ? res.data.documents : []
        );
      })
      .catch((err) => {
        if (cancelled) return;

        console.log(err);
        setPageError(getErrorMessage(err));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const fetchDocuments = async ({ showSpinner = false } = {}) => {
    try {
      if (showSpinner) setRefreshing(true);
      setPageError("");

      const res = await api.get("/client/documents");
      setDocuments(Array.isArray(res.data?.documents) ? res.data.documents : []);
    } catch (err) {
      console.log(err);
      setPageError(getErrorMessage(err));
    } finally {
      setRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    const fromAdmin = documents.filter(
      (document) => document.uploadedByModel === "Admin"
    ).length;

    const fromClient = documents.filter(
      (document) => document.uploadedByModel === "Client"
    ).length;

    return {
      total: documents.length,
      fromAdmin,
      fromClient,
      latest: documents[0]?.createdAt ? formatDate(documents[0].createdAt) : "None",
    };
  }, [documents]);

  const uploadDocument = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.title.trim()) {
      setFormError("Enter a document title.");
      return;
    }

    if (!form.file) {
      setFormError("Choose a file to upload.");
      return;
    }

    try {
      setActionLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("document", form.file);

      await api.post("/client/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm(emptyForm);
      await fetchDocuments();
    } catch (err) {
      console.log(err);
      setFormError(err.response?.data?.message || "Failed to upload document.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      setActionLoading(true);
      await api.delete(`/client/documents/${documentId}`);
      await fetchDocuments();
    } catch (err) {
      console.log(err);
      setPageError(err.response?.data?.message || "Failed to delete document.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-red-900/20 bg-black/40 p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,.08)]">
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-red-400 text-xs uppercase tracking-[0.35em] mb-3">
              Document Center
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Documents
            </h1>

            <p className="text-gray-400 mt-3 max-w-2xl">
              Receive files from the consulting team and upload anything they need from you.
            </p>
          </div>

          <button
            onClick={() => fetchDocuments({ showSpinner: true })}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-gray-300 hover:bg-white/10 disabled:opacity-60"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </section>

      {pageError && (
        <section className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 flex gap-3 text-red-200">
          <FiAlertTriangle className="mt-1 shrink-0" />
          <p>{pageError}</p>
        </section>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total Documents" value={stats.total} icon={<FiFileText />} />
        <StatCard label="From Team" value={stats.fromAdmin} icon={<FiSend />} />
        <StatCard label="Your Uploads" value={stats.fromClient} icon={<FiUploadCloud />} />
        <StatCard label="Latest Activity" value={stats.latest} icon={<FiFolder />} compact />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-[28px] border border-red-900/20 bg-black/35 p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Shared Documents
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Files exchanged between you and the consulting team
              </p>
            </div>

            <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <FiFileText />
            </div>
          </div>

          <div className="space-y-4">
            {!pageError && documents.length === 0 ? (
              <p className="text-gray-400">
                No documents shared yet.
              </p>
            ) : (
              documents.map((document) => {
                const canDelete =
                  document.uploadedByModel === "Client" &&
                  document.uploadedBy?._id === currentUser?.id;

                return (
                  <DocumentCard
                    key={document._id}
                    document={document}
                    canDelete={canDelete}
                    actionLoading={actionLoading}
                    onDelete={() => deleteDocument(document._id)}
                  />
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-red-900/20 bg-black/35 p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Upload
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Share a file with the admin team
              </p>
            </div>

            <FiUploadCloud className="text-red-400" />
          </div>

          <form onSubmit={uploadDocument} className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-400">Document Title</span>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-2 w-full rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-red-500/40"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-400">Short Note</span>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows="4"
                className="mt-2 w-full resize-none rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-red-500/40"
                placeholder="Optional context for the team"
              />
            </label>

            <label className="block rounded-2xl border border-dashed border-red-500/30 bg-red-600/10 p-5 cursor-pointer hover:bg-red-600/15">
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setForm({ ...form, file: e.target.files?.[0] || null })
                }
                required
              />

              <div className="text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <FiUploadCloud size={24} />
                </div>

                <p className="text-white font-medium mt-5">
                  {form.file ? form.file.name : "Choose a file"}
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  PDF, Word, Excel, PNG or JPG up to 10MB
                </p>
              </div>
            </label>

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
              {actionLoading ? "Uploading..." : "Upload Document"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

const DocumentCard = ({ document, canDelete, actionLoading, onDelete }) => {
  return (
    <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-5 hover:bg-red-600/[0.06] hover:border-red-500/30 transition-all">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <FiFileText />
          </div>

          <div>
            <h3 className="text-white font-semibold">
              {document.title}
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              {document.content || "No note added."}
            </p>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <FiUser className="text-red-400" />
                {document.uploadedByModel === "Admin" ? "Consulting Team" : "You"}
              </span>

              <span>
                {document.originalName}
              </span>

              <span>
                {formatSize(document.size)}
              </span>

              <span>
                {formatDate(document.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              document.uploadedByModel === "Admin"
                ? "bg-green-500/15 text-green-400"
                : "bg-red-500/15 text-red-300"
            }`}
          >
            {document.uploadedByModel === "Admin" ? "From team" : "Your upload"}
          </span>

          <a
            href={getDownloadUrl(document.fileUrl)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <FiDownload />
            Open
          </a>

          {canDelete && (
            <button
              onClick={onDelete}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600/10 border border-red-500/20 px-4 py-3 text-red-300 hover:bg-red-600/20 disabled:opacity-60"
            >
              <FiTrash2 />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, compact = false }) => (
  <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-5">
    <div className="flex items-center justify-between">
      <div className="h-12 w-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
        {icon}
      </div>

      <span className="text-xs text-gray-500 uppercase tracking-widest">
        Files
      </span>
    </div>

    <h2 className={`${compact ? "text-base" : "text-3xl"} font-bold text-white mt-5`}>
      {value}
    </h2>

    <p className="text-gray-400 text-sm mt-1">
      {label}
    </p>
  </div>
);

export default Documents;
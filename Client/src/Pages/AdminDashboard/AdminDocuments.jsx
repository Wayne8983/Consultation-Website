import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiDownload,
  FiFileText,
  FiFolder,
  FiMail,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiTrash2,
  FiUploadCloud,
  FiUser,
  FiX,
} from "react-icons/fi";
import api from "../../Service/axios";
import { DashboardSkeleton } from "../Skeleton/Skeleton";

const BackendURL = import.meta.env.VITE_BackendURL;

const emptyForm = {
  client: "",
  title: "",
  content: "",
  file: null,
};

const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.status === 401) return "You are not logged in or your session expired.";
  if (err.response?.status === 403) return "This account is not allowed to manage documents.";
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

const AdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let cancelled = false;

    Promise.all([api.get("/admin/documents"), api.get("/admin/clients")])
      .then(([documentsRes, clientsRes]) => {
        if (cancelled) return;

        setDocuments(
          Array.isArray(documentsRes.data?.documents)
            ? documentsRes.data.documents
            : []
        );

        setClients(
          Array.isArray(clientsRes.data?.clients)
            ? clientsRes.data.clients
            : []
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

      const res = await api.get("/admin/documents");
      setDocuments(Array.isArray(res.data?.documents) ? res.data.documents : []);
    } catch (err) {
      console.log(err);
      setPageError(getErrorMessage(err));
    } finally {
      setRefreshing(false);
    }
  };

  const filteredDocuments = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return documents;

    return documents.filter((document) => {
      const text = [
        document.title,
        document.content,
        document.originalName,
        document.client?.name,
        document.client?.email,
        document.uploadedBy?.name,
        document.uploadedBy?.email,
        document.uploadedByModel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(value);
    });
  }, [documents, searchTerm]);

  const stats = useMemo(() => {
    const adminUploads = documents.filter(
      (document) => document.uploadedByModel === "Admin"
    ).length;

    const clientUploads = documents.filter(
      (document) => document.uploadedByModel === "Client"
    ).length;

    return {
      total: documents.length,
      adminUploads,
      clientUploads,
      clients: new Set(documents.map((document) => document.client?._id)).size,
    };
  }, [documents]);

  const closeUpload = () => {
    setShowUpload(false);
    setForm(emptyForm);
    setFormError("");
  };

  const uploadDocument = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.client) {
      setFormError("Choose a client.");
      return;
    }

    if (!form.title.trim()) {
      setFormError("Enter a document title.");
      return;
    }

    if (!form.file) {
      setFormError("Choose a document file.");
      return;
    }

    try {
      setActionLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("document", form.file);

      await api.post(`/admin/clients/${form.client}/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchDocuments();
      closeUpload();
    } catch (err) {
      console.log(err);
      setFormError(err.response?.data?.message || "Failed to upload document.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteDocument = async () => {
    if (!deleteTarget?._id) return;

    try {
      setActionLoading(true);
      await api.delete(`/admin/documents/${deleteTarget._id}`);
      await fetchDocuments();
      setDeleteTarget(null);
    } catch (err) {
      console.log(err);
      setPageError(err.response?.data?.message || "Failed to delete document.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-red-900/20 bg-black/40 p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,.08)]">
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-red-400 text-xs uppercase tracking-[0.35em]">
              Document Exchange
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">
              Documents
            </h1>

            <p className="text-gray-400 mt-3 max-w-2xl">
              Share files with clients, review incoming uploads and keep project records in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => fetchDocuments({ showSpinner: true })}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-gray-300 hover:bg-white/10 disabled:opacity-60"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              <FiPlus />
              Share Document
            </button>
          </div>
        </div>
      </section>

      {pageError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 flex gap-3 text-red-200">
          <FiAlertTriangle className="mt-1 shrink-0" />
          <p>{pageError}</p>
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total Files" value={stats.total} icon={<FiFileText />} />
        <StatCard label="Sent By Admin" value={stats.adminUploads} icon={<FiSend />} />
        <StatCard label="Client Uploads" value={stats.clientUploads} icon={<FiUploadCloud />} />
        <StatCard label="Clients With Files" value={stats.clients} icon={<FiFolder />} />
      </section>

      <section className="rounded-[28px] border border-red-900/20 bg-black/35 overflow-hidden">
        <div className="p-6 border-b border-red-900/20 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Shared Library
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredDocuments.length} visible document{filteredDocuments.length === 1 ? "" : "s"}
            </p>
          </div>

          <label className="relative block w-full xl:max-w-sm">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documents, clients, uploaders..."
              className="w-full rounded-2xl border border-red-900/20 bg-white/[0.04] py-3 pl-11 pr-4 text-white outline-none focus:border-red-500/40"
            />
          </label>
        </div>

        <div className="divide-y divide-red-900/20">
          {!pageError && filteredDocuments.length === 0 ? (
            <p className="p-6 text-gray-400">
              No documents found.
            </p>
          ) : (
            filteredDocuments.map((document) => (
              <DocumentRow
                key={document._id}
                document={document}
                onDelete={() => setDeleteTarget(document)}
              />
            ))
          )}
        </div>
      </section>

      {showUpload && (
        <Modal title="Share Document With Client" onClose={closeUpload}>
          <form onSubmit={uploadDocument} className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-400">Client</span>
              <select
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                className="mt-2 w-full rounded-xl border border-red-900/20 bg-[#111] px-4 py-3 text-white outline-none focus:border-red-500/40"
                required
              >
                <option value="">Choose client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name} - {client.email}
                  </option>
                ))}
              </select>
            </label>

            <Input
              label="Document Title"
              value={form.title}
              onChange={(value) => setForm({ ...form, title: value })}
            />

            <Textarea
              label="Short Note"
              value={form.content}
              onChange={(value) => setForm({ ...form, content: value })}
            />

            <label className="block rounded-2xl border border-dashed border-red-500/30 bg-red-600/10 p-5 cursor-pointer hover:bg-red-600/15">
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setForm({ ...form, file: e.target.files?.[0] || null })
                }
                required
              />

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <FiUploadCloud />
                </div>

                <div>
                  <p className="text-white font-medium">
                    {form.file ? form.file.name : "Choose file"}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    PDF, Word, Excel, PNG or JPG up to 10MB
                  </p>
                </div>
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
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete Document" onClose={() => setDeleteTarget(null)}>
          <div className="space-y-5">
            <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5">
              <p className="text-white font-medium">
                Delete {deleteTarget.title}?
              </p>

              <p className="text-gray-400 text-sm mt-2">
                This removes the document record and its uploaded file.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-gray-300 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={deleteDocument}
                disabled={actionLoading}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const DocumentRow = ({ document, onDelete }) => {
  return (
    <div className="p-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 hover:bg-red-600/[0.04]">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
          <FiFileText />
        </div>

        <div>
          <h3 className="text-white font-semibold">
            {document.title}
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            {document.content || "No note added."}
          </p>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <FiUser className="text-red-400" />
              {document.client?.name || "No client"}
            </span>

            <span className="flex items-center gap-2">
              <FiMail className="text-red-400" />
              {document.client?.email || "No email"}
            </span>

            <span>
              {document.originalName} | {formatSize(document.size)}
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
              ? "bg-red-500/15 text-red-300"
              : "bg-green-500/15 text-green-400"
          }`}
        >
          {document.uploadedByModel === "Admin" ? "Sent by admin" : "From client"}
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

        <button
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600/10 border border-red-500/20 px-4 py-3 text-red-300 hover:bg-red-600/20"
        >
          <FiTrash2 />
          Delete
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-5">
    <div className="flex items-center justify-between">
      <div className="h-12 w-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
        {icon}
      </div>
      <span className="text-xs text-gray-500 uppercase tracking-widest">Files</span>
    </div>

    <h2 className="text-3xl font-bold text-white mt-5">{value}</h2>
    <p className="text-gray-400 text-sm mt-1">{label}</p>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
    <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-red-900/20 bg-[#080808] p-6 shadow-[0_0_45px_rgba(220,38,38,.16)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white"
        >
          <FiX />
        </button>
      </div>

      {children}
    </div>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <label className="block">
    <span className="text-sm text-gray-400">{label}</span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 w-full rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-red-500/40"
      required
    />
  </label>
);

const Textarea = ({ label, value, onChange }) => (
  <label className="block">
    <span className="text-sm text-gray-400">{label}</span>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows="4"
      className="mt-2 w-full resize-none rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-red-500/40"
    />
  </label>
);

export default AdminDocuments;
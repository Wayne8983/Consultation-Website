import {
  FiAlertTriangle,
  FiDownload,
  FiFileText,
  FiFolder,
  FiLock,
  FiUploadCloud,
} from "react-icons/fi";

const documents = [
  {
    title: "Project Proposal",
    type: "PDF",
    status: "Available",
    date: "Pending backend",
  },
  {
    title: "Service Agreement",
    type: "PDF",
    status: "Pending",
    date: "Pending backend",
  },
  {
    title: "Project Brief",
    type: "DOCX",
    status: "Available",
    date: "Pending backend",
  },
];

const Documents = () => {
  const availableDocuments = documents.filter(
    (document) => document.status === "Available"
  ).length;

  const pendingDocuments = documents.filter(
    (document) => document.status === "Pending"
  ).length;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-red-900/20 bg-black/40 backdrop-blur-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,.08)]">
        <div className="absolute -top-28 -right-20 h-72 w-72 rounded-full bg-red-700/10 blur-[100px]" />

        <div className="relative">
          <p className="text-red-400 text-xs uppercase tracking-[0.35em] mb-3">
            Document Center
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Documents
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl">
            View project files, agreements, briefs and shared documents once document management is enabled.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5 flex gap-3 text-yellow-200">
        <FiAlertTriangle className="mt-1 shrink-0" />

        <div>
          <p className="font-medium">
            Backend coming later
          </p>

          <p className="text-sm text-yellow-100/80 mt-1">
            This page is ready visually. We will connect uploads, downloads and document history after the documents backend is built.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Total Documents"
          value={documents.length}
          icon={<FiFileText />}
        />

        <StatCard
          label="Available"
          value={availableDocuments}
          icon={<FiFolder />}
        />

        <StatCard
          label="Pending"
          value={pendingDocuments}
          icon={<FiUploadCloud />}
        />

        <StatCard
          label="Secure Access"
          value="On"
          icon={<FiLock />}
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Shared Documents
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Files shared by the consulting team
              </p>
            </div>

            <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <FiFileText />
            </div>
          </div>

          <div className="space-y-4">
            {documents.map((document) => (
              <div
                key={document.title}
                className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-5 hover:bg-red-600/[0.06] hover:border-red-500/30 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                      <FiFileText />
                    </div>

                    <div>
                      <h3 className="text-white font-semibold">
                        {document.title}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        {document.type} | {document.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        document.status === "Available"
                          ? "bg-green-500/15 text-green-400"
                          : "bg-yellow-500/15 text-yellow-400"
                      }`}
                    >
                      {document.status}
                    </span>

                    <button
                      disabled
                      className="px-4 py-3 rounded-xl bg-white/[0.04] border border-red-900/20 text-gray-500 cursor-not-allowed"
                      title="Download will be enabled after backend is added"
                    >
                      <FiDownload />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Uploads
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Client upload area
              </p>
            </div>

            <FiUploadCloud className="text-red-400" />
          </div>

          <div className="rounded-2xl border border-dashed border-red-500/25 bg-red-600/10 p-6 text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <FiUploadCloud size={24} />
            </div>

            <p className="text-white font-medium mt-5">
              Uploads disabled for now
            </p>

            <p className="text-gray-500 text-sm mt-2">
              We will enable client uploads after creating the document backend and storage flow.
            </p>

            <button
              disabled
              className="mt-5 w-full rounded-xl bg-red-600/40 px-4 py-3 font-semibold text-white/50 cursor-not-allowed"
            >
              Upload Document
            </button>
          </div>
        </div>
      </section>
    </div>
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
          Files
        </span>
      </div>

      <h2 className="text-3xl font-bold text-white mt-5">
        {value}
      </h2>

      <p className="text-gray-400 text-sm mt-1">
        {label}
      </p>
    </div>
  );
};

export default Documents;
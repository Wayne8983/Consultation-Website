const Documents = () => {
  const documents = [
    {
      name: "Project Proposal.pdf",
      type: "PDF",
      size: "2.4 MB",
      date: "12 Jun 2026",
    },
    {
      name: "Signed Contract.pdf",
      type: "PDF",
      size: "1.1 MB",
      date: "15 Jun 2026",
    },
    {
      name: "Wireframes.fig",
      type: "FIGMA",
      size: "5.6 MB",
      date: "20 Jun 2026",
    },
    {
      name: "Brand Guidelines.pdf",
      type: "PDF",
      size: "3.8 MB",
      date: "25 Jun 2026",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Documents
        </h1>

        <p className="text-slate-400 mt-1">
          Access project files, contracts and deliverables.
        </p>
      </div>

      {/* Storage Card */}
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-gradient-to-br
          from-cyan-500/20
          via-[#111827]
          to-[#0B1020]
          p-8
        "
      >
        <div
          className="
            absolute
            right-0
            top-0
            h-52
            w-52
            rounded-full
            bg-cyan-500/20
            blur-3xl
          "
        />

        <div className="relative z-10">
          <p className="text-cyan-300 uppercase tracking-widest text-sm">
            Cloud Storage
          </p>

          <h2 className="text-5xl font-bold text-white mt-3">
            12.9 GB
          </h2>

          <p className="text-slate-400 mt-3">
            Available project storage and shared resources.
          </p>
        </div>
      </div>

      {/* Documents Grid */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-5
        "
      >
        {documents.map((doc, index) => (
          <div
            key={index}
            className="
              rounded-3xl
              border border-white/10
              bg-white/[0.03]
              backdrop-blur-xl
              p-6
              hover:border-cyan-500/30
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            <div className="flex justify-between items-start">

              <div>

                <div className="text-4xl mb-4">
                  📄
                </div>

                <h2 className="text-white font-semibold">
                  {doc.name}
                </h2>

                <div className="flex gap-3 mt-3">

                  <span
                    className="
                      px-2 py-1
                      rounded-lg
                      bg-cyan-500/10
                      text-cyan-400
                      text-xs
                    "
                  >
                    {doc.type}
                  </span>

                  <span
                    className="
                      px-2 py-1
                      rounded-lg
                      bg-white/5
                      text-slate-400
                      text-xs
                    "
                  >
                    {doc.size}
                  </span>

                </div>

              </div>

            </div>

            <div
              className="
                mt-6
                pt-4
                border-t
                border-white/5
                flex
                justify-between
                items-center
              "
            >
              <span className="text-slate-500 text-sm">
                {doc.date}
              </span>

              <button
                className="
                  px-4 py-2
                  rounded-xl
                  bg-cyan-500/10
                  text-cyan-400
                  hover:bg-cyan-500/20
                  transition
                  cursor-pointer
                "
              >
                Download
              </button>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Documents;
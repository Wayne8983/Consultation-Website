const ConsultModal = ({
  consultation,
  modalType,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!consultation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-2xl rounded-3xl bg-[#0F172A] border border-white/10 p-8">

        <h2 className="text-2xl font-bold text-white mb-6">

          {modalType === "view" && "Consultation Details"}
          {modalType === "approve" && "Approve Consultation"}
          {modalType === "reject" && "Reject Consultation"}

        </h2>

        {modalType === "view" ? (
          <div className="grid md:grid-cols-2 gap-5 text-slate-300">

            <div>
              <p className="text-slate-500">Name</p>
              <p>{consultation.name}</p>
            </div>

            <div>
              <p className="text-slate-500">Email</p>
              <p>{consultation.email}</p>
            </div>

            <div>
              <p className="text-slate-500">Phone</p>
              <p>{consultation.phone}</p>
            </div>

            <div>
              <p className="text-slate-500">Company</p>
              <p>{consultation.company || "N/A"}</p>
            </div>

            <div>
              <p className="text-slate-500">Project Type</p>
              <p>{consultation.projectType}</p>
            </div>

            <div>
              <p className="text-slate-500">Contact Method</p>
              <p>{consultation.preferredContactMethod}</p>
            </div>

            <div>
              <p className="text-slate-500">Status</p>
              <p>{consultation.status}</p>
            </div>

            <div>
              <p className="text-slate-500">Submitted</p>
              <p>
                {new Date(
                  consultation.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-slate-500">Description</p>

              <div className="mt-2 p-4 rounded-xl bg-white/5">
                {consultation.description}
              </div>
            </div>

          </div>
        ) : (
          <p className="text-slate-300">
            Are you sure you want to
            <span className="font-semibold mx-2">
              {modalType}
            </span>
            this consultation request?
          </p>
        )}

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="
              px-5 py-2
              rounded-xl
              border border-white/10
              bg-white/5
              text-white
            "
          >
            Cancel
          </button>

          {modalType === "approve" && (
            <button
              onClick={() =>
                onApprove(consultation._id)
              }
              className="
                px-5 py-2
                rounded-xl
                bg-green-600
                hover:bg-green-700
                text-white
              "
            >
              Approve
            </button>
          )}

          {modalType === "reject" && (
            <button
              onClick={() =>
                onReject(consultation._id)
              }
              className="
                px-5 py-2
                rounded-xl
                bg-red-600
                hover:bg-red-700
                text-white
              "
            >
              Reject
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

export default ConsultModal;
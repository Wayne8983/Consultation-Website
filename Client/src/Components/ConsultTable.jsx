const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "bg-green-500/20 text-green-400";

    case "Rejected":
      return "bg-red-500/20 text-red-400";

    default:
      return "bg-yellow-500/20 text-yellow-400";
  }
};

const ConsultTable = ({
  consultations,
  onView,
  onApprove,
  onReject,
}) => {
  return (
    <div
      className="
        rounded-3xl
        border border-white/10
        bg-white/5
        overflow-hidden
      "
    >
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="text-left p-5">Name</th>
              <th className="text-left p-5">Company</th>
              <th className="text-left p-5">Project Type</th>
              <th className="text-left p-5">Status</th>
              <th className="text-left p-5">Actions</th>
            </tr>
          </thead>

          <tbody>

            {consultations.map((consultation) => (
              <tr
                key={consultation._id}
                className="
                  border-b border-white/5
                  hover:bg-white/5
                "
              >
                <td className="p-5">
                  <div className="text-white">
                    {consultation.name}
                  </div>

                  <div className="text-sm text-slate-400">
                    {consultation.email}
                  </div>
                </td>

                <td className="p-5 text-slate-300">
                  {consultation.company || "N/A"}
                </td>

                <td className="p-5 text-slate-300">
                  {consultation.projectType}
                </td>

                <td className="p-5">
                  <span
                    className={`
                      px-3 py-1 rounded-full text-sm
                      ${getStatusColor(consultation.status)}
                    `}
                  >
                    {consultation.status}
                  </span>
                </td>

                <td className="p-5 flex gap-2">

                  <button
                    onClick={() => onView(consultation)}
                    className="
                      px-4 py-2
                      rounded-lg
                      bg-cyan-600
                      hover:bg-cyan-700
                      text-white
                    "
                  >
                    View
                  </button>

                  {consultation.status === "Pending" && (
                    <>
                      <button
                        onClick={() => onApprove(consultation)}
                        className="
                          px-4 py-2
                          rounded-lg
                          bg-green-600
                          hover:bg-green-700
                          text-white
                        "
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => onReject(consultation)}
                        className="
                          px-4 py-2
                          rounded-lg
                          bg-red-600
                          hover:bg-red-700
                          text-white
                        "
                      >
                        Reject
                      </button>
                    </>
                  )}

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
};

export default ConsultTable;
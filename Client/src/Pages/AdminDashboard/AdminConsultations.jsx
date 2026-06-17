import { useState } from "react";
import { clients } from "./Data/Data";

const Consultations = () => {
  const [selectedClient, setSelectedClient] = useState(null);

  const pendingConsultations = clients.filter(
    (client) => client.status === "Pending"
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Consultations
        </h1>

        <p className="text-slate-400 mt-2">
          Review incoming consultation requests.
        </p>
      </div>

      {/* Table */}
      <div
        className="
          rounded-3xl
          border border-white/10
          bg-white/5
          backdrop-blur-xl
          overflow-hidden
        "
      >
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">
            Pending Requests
          </h2>
        </div>

        <div className="divide-y divide-white/5">

          {pendingConsultations.map((client) => (
            <div
              key={client.id}
              className="
                p-6
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-4
              "
            >
              <div>
                <h3 className="text-white font-medium">
                  {client.name}
                </h3>

                <p className="text-slate-400 text-sm">
                  {client.email}
                </p>
              </div>

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    setSelectedClient(client)
                  }
                  className="
                    px-4 py-2
                    rounded-lg
                    bg-cyan-600
                    hover:bg-cyan-700
                    text-white
                    transition
                  "
                >
                  View
                </button>

                <button
                  className="
                    px-4 py-2
                    rounded-lg
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    transition
                  "
                >
                  Approve
                </button>

                <button
                  className="
                    px-4 py-2
                    rounded-lg
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    transition
                  "
                >
                  Reject
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Modal */}
      {selectedClient && (
        <div
          className="
            fixed inset-0
            bg-black/70
            flex items-center justify-center
            z-[999]
          "
          onClick={() => setSelectedClient(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              w-full max-w-lg
              rounded-3xl
              bg-[#111827]
              border border-white/10
              p-6
            "
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Consultation Details
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-slate-400 text-sm">
                  Name
                </p>

                <p className="text-white">
                  {selectedClient.name}
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-sm">
                  Email
                </p>

                <p className="text-white">
                  {selectedClient.email}
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-sm">
                  Status
                </p>

                <p className="text-yellow-400">
                  {selectedClient.status}
                </p>
              </div>

            </div>

            <button
              onClick={() =>
                setSelectedClient(null)
              }
              className="
                mt-8
                w-full
                py-3
                rounded-xl
                bg-cyan-600
                hover:bg-cyan-700
                text-white
              "
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Consultations;
import { clients } from "./Data/Data";
const Clients = () => {


  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Clients
        </h1>

        <p className="text-slate-400 mt-2">
          Manage all registered clients and their projects.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-slate-400 text-sm">
            Total Clients
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            24
          </h2>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-slate-400 text-sm">
            Active Projects
          </p>

          <h2 className="text-3xl font-bold text-cyan-400 mt-2">
            12
          </h2>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-slate-400 text-sm">
            Pending Clients
          </p>

          <h2 className="text-3xl font-bold text-yellow-400 mt-2">
            4
          </h2>
        </div>

      </div>

      {/* Clients Table */}
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
            Client Directory
          </h2>
        </div>

        <div className="divide-y divide-white/5">

          {clients.map((client, index) => (
            <div
              key={index}
              className="
                p-6
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
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

              <div className="text-slate-300">
                {client.project}
              </div>

              <div className="flex items-center gap-3">

                <span
                  className={`
                    px-3 py-1
                    rounded-full
                    text-xs
                    ${
                      client.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }
                  `}
                >
                  {client.status}
                </span>

                <button
                  className="
                    px-4 py-2
                    rounded-lg
                    bg-cyan-600
                    hover:bg-cyan-700
                    transition
                    text-white
                  "
                >
                  View
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default Clients;
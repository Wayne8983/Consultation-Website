import { stats } from "./Data/Data";

const AdminDashboard = () => {


  return (
    <div className="space-y-8">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((item, index) => (
          <div
            key={index}
            className="
              rounded-2xl
              border border-white/10
              bg-gradient-to-br
              from-cyan-500/10
              to-blue-900/5
              backdrop-blur-xl
              p-6
            "
          >
            <p className="text-slate-400 text-sm">
              {item.title}
            </p>

            <h2 className="text-3xl font-bold text-white mt-3">
              {item.value}
            </h2>
          </div>
        ))}

      </div>

      {/* Main Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <div
          className="
            xl:col-span-2
            rounded-3xl
            border border-white/10
            bg-white/5
            backdrop-blur-xl
            p-6
          "
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            Recent Activity
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>New consultation booked</span>
              <span className="text-cyan-400">
                5 mins ago
              </span>
            </div>

            <div className="flex justify-between">
              <span>Client account created</span>
              <span className="text-cyan-400">
                20 mins ago
              </span>
            </div>

            <div className="flex justify-between">
              <span>Project updated</span>
              <span className="text-cyan-400">
                1 hour ago
              </span>
            </div>

            <div className="flex justify-between">
              <span>Payment received</span>
              <span className="text-cyan-400">
                Today
              </span>
            </div>

          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="
            rounded-3xl
            border border-white/10
            bg-white/5
            backdrop-blur-xl
            p-6
          "
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            Quick Actions
          </h2>

          <div className="space-y-3">

            <button
              className="
                w-full
                py-3
                rounded-xl
                bg-cyan-600
                hover:bg-cyan-700
                transition
                text-white
                cursor-pointer
              "
            >
              Add Client
            </button>

            <button
              className="
                w-full
                py-3
                rounded-xl
                bg-white/5
                border border-white/10
                hover:bg-white/10
                transition
                text-white
                cursor-pointer
              "
            >
              Create Project
            </button>

            <button
              className="
                w-full
                py-3
                rounded-xl
                bg-white/5
                border border-white/10
                hover:bg-white/10
                transition
                text-white
                cursor-pointer
              "
            >
              Schedule Meeting
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;

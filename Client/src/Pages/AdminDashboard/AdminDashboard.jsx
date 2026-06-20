import { useEffect, useState } from "react";
import api from "../../Service/axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");

        console.log(response.data);

        setStats(response.data.stats);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-xl">
        Loading Dashboard...
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Clients",
      value: stats.clients,
    },
    {
      title: "Consultations",
      value: stats.consultations,
    },
    {
      title: "Pending",
      value: stats.pendingConsultations,
    },
    {
      title: "Approved",
      value: stats.ApprovedConsultations,
    },
    {
      title: "Rejected",
      value: stats.rejectedConsultations,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {dashboardCards.map((item, index) => (
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

      {/* Main Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Overview */}
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
            Overview
          </h2>

          <div className="space-y-4 text-slate-300">

            <div className="flex justify-between">
              <span>Total Clients</span>
              <span className="text-cyan-400">
                {stats.clients}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Consultations</span>
              <span className="text-cyan-400">
                {stats.consultations}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Pending Consultations</span>
              <span className="text-yellow-400">
                {stats.pendingConsultations}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Approved Consultations</span>
              <span className="text-green-400">
                {stats.ApprovedConsultations}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Rejected Consultations</span>
              <span className="text-red-400">
                {stats.rejectedConsultations}
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

            <Link to='/admin/consultations'>
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
              View Consultations
              </button>
            </Link>

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
              View Clients
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
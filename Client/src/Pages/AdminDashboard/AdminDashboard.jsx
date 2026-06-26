import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiClipboard,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiFolder,
  FiCalendar,
  FiArrowRight,
} from "react-icons/fi";
import api from "../../Service/axios";
import { DashboardSkeleton } from "../Skeleton/Skeleton";


const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");
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
  return <DashboardSkeleton />;
}

  const dashboardCards = [
    {
      title: "Clients",
      value: stats?.clients || 0,
      icon: <FiUsers size={22} />,
      color: "text-red-400",
    },
    {
      title: "Consultations",
      value: stats?.consultations || 0,
      icon: <FiClipboard size={22} />,
      color: "text-red-400",
    },
    {
      title: "Pending",
      value: stats?.pendingConsultations || 0,
      icon: <FiClock size={22} />,
      color: "text-yellow-400",
    },
    {
      title: "Approved",
      value: stats?.approvedConsultations || 0,
      icon: <FiCheckCircle size={22} />,
      color: "text-green-400",
    },
    {
      title: "Rejected",
      value: stats?.rejectedConsultations || 0,
      icon: <FiXCircle size={22} />,
      color: "text-red-500",
    },
  ];

  const quickActions = [
    {
      title: "View Consultations",
      path: "/admin/consultations",
      icon: <FiClipboard />,
    },
    {
      title: "Manage Clients",
      path: "/admin/clients",
      icon: <FiUsers />,
    },
    {
      title: "View Projects",
      path: "/admin/projects",
      icon: <FiFolder />,
    },
    {
      title: "Schedule Meetings",
      path: "/admin/meetings",
      icon: <FiCalendar />,
    },
  ];

  return (
    <div className="space-y-8">
      <section
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border border-red-900/20
          bg-black/40
          backdrop-blur-2xl
          p-6 md:p-8
          shadow-[0_0_40px_rgba(220,38,38,.08)]
        "
      >
        <div className="absolute -top-28 -right-20 h-72 w-72 rounded-full bg-red-700/10 blur-[100px]" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-red-400 text-xs uppercase tracking-[0.35em] mb-3">
              Admin Overview
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome Back, Admin
            </h1>

            <p className="text-gray-400 mt-3 max-w-2xl">
              Monitor consultations, clients, projects and daily activity from one control center.
            </p>
          </div>

          <Link
            to="/admin/consultations"
            className="
              inline-flex
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-red-600/15
              border border-red-500/30
              px-5
              py-4
              text-red-300
              hover:bg-red-600/25
              hover:text-white
              transition-all
              shadow-[0_0_20px_rgba(239,68,68,.12)]
            "
          >
            Review Requests
            <FiArrowRight />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        {dashboardCards.map((item) => (
          <div
            key={item.title}
            className="
              rounded-2xl
              border border-red-900/20
              bg-white/[0.04]
              backdrop-blur-xl
              p-5
              hover:border-red-500/30
              hover:bg-red-600/[0.06]
              transition-all
              shadow-[0_0_25px_rgba(220,38,38,.04)]
            "
          >
            <div className="flex items-center justify-between">
              <div
                className={`
                  h-12
                  w-12
                  rounded-2xl
                  bg-red-600/10
                  border border-red-500/20
                  flex
                  items-center
                  justify-center
                  ${item.color}
                `}
              >
                {item.icon}
              </div>

              <span className="text-xs text-gray-500 uppercase tracking-widest">
                Total
              </span>
            </div>

            <h2 className="text-3xl font-bold text-white mt-5">
              {item.value}
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              {item.title}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div
          className="
            xl:col-span-2
            rounded-[28px]
            border border-red-900/20
            bg-black/35
            backdrop-blur-2xl
            p-6
            shadow-[0_0_35px_rgba(220,38,38,.06)]
          "
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Consultation Summary
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Current request status breakdown
              </p>
            </div>

            <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <FiClipboard size={20} />
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Pending Consultations",
                value: stats?.pendingConsultations || 0,
                bar: "bg-yellow-400",
              },
              {
                label: "Approved Consultations",
                value: stats?.approvedConsultations || 0,
                bar: "bg-green-400",
              },
              {
                label: "Rejected Consultations",
                value: stats?.rejectedConsultations || 0,
                bar: "bg-red-500",
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">
                    {item.label}
                  </span>

                  <span className="text-white font-semibold">
                    {item.value}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.bar}`}
                    style={{
                      width: `${Math.min(item.value * 10, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="
            rounded-[28px]
            border border-red-900/20
            bg-black/35
            backdrop-blur-2xl
            p-6
            shadow-[0_0_35px_rgba(220,38,38,.06)]
          "
        >
          <h2 className="text-xl font-semibold text-white mb-2">
            Quick Actions
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Jump to common admin tasks
          </p>

          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  rounded-2xl
                  border border-white/5
                  bg-white/[0.04]
                  px-4
                  py-4
                  text-gray-300
                  hover:bg-red-600/10
                  hover:border-red-500/25
                  hover:text-white
                  transition-all
                "
              >
                <span className="flex items-center gap-3">
                  <span className="text-red-400">
                    {action.icon}
                  </span>

                  {action.title}
                </span>

                <FiArrowRight className="text-gray-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
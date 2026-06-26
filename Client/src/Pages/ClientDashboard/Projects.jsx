import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFolder,
  FiPauseCircle,
  FiTrendingUp,
  FiXCircle,
} from "react-icons/fi";
import api from "../../Service/axios";
import { DashboardSkeleton } from "../Skeleton/Skeleton";

const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.status === 401) return "You are not logged in or your session expired.";
  if (err.response?.status === 403) return "This account is not allowed to view projects.";
  if (err.code === "ERR_NETWORK") return "Cannot connect to the backend. Make sure the server is running on port 3000.";
  return "Something went wrong while loading your projects.";
};

const formatDate = (dateValue) => {
  if (!dateValue) return "No date set";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusStyles = (status) => {
  if (status === "Completed") {
    return "bg-green-500/15 text-green-400";
  }

  if (status === "Cancelled") {
    return "bg-red-500/15 text-red-400";
  }

  if (status === "Paused") {
    return "bg-yellow-500/15 text-yellow-400";
  }

  return "bg-white/5 text-gray-300";
};

const getStatusIcon = (status) => {
  if (status === "Completed") return <FiCheckCircle />;
  if (status === "Cancelled") return <FiXCircle />;
  if (status === "Paused") return <FiPauseCircle />;
  return <FiTrendingUp />;
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/client/getClientProjects")
      .then((res) => {
        if (cancelled) return;

        const data = res.data?.clientProjects;

        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjects([]);
          setPageError("Backend response did not include a projects array.");
        }
      })
      .catch((err) => {
        if (cancelled) return;

        console.log(err);
        setProjects([]);
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

  const stats = useMemo(() => {
    const active = projects.filter((project) => project.status === "Active").length;
    const completed = projects.filter((project) => project.status === "Completed").length;
    const paused = projects.filter((project) => project.status === "Paused").length;

    const averageProgress =
      projects.length === 0
        ? 0
        : Math.round(
            projects.reduce(
              (total, project) => total + (project.progress || 0),
              0
            ) / projects.length
          );

    return {
      total: projects.length,
      active,
      completed,
      paused,
      averageProgress,
    };
  }, [projects]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-red-900/20 bg-black/40 backdrop-blur-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,.08)]">
        <div className="absolute -top-28 -right-20 h-72 w-72 rounded-full bg-red-700/10 blur-[100px]" />

        <div className="relative">
          <p className="text-red-400 text-xs uppercase tracking-[0.35em] mb-3">
            Project Center
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Projects
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl">
            View your assigned projects, track progress, deadlines and current status.
          </p>
        </div>
      </section>

      {pageError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 flex gap-3 text-red-200">
          <FiAlertTriangle className="mt-1 shrink-0" />

          <div>
            <p className="font-medium">
              Could not load projects
            </p>

            <p className="text-sm text-red-200/80 mt-1">
              {pageError}
            </p>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Total Projects"
          value={stats.total}
          icon={<FiFolder />}
        />

        <StatCard
          label="Active"
          value={stats.active}
          icon={<FiTrendingUp />}
        />

        <StatCard
          label="Completed"
          value={stats.completed}
          icon={<FiCheckCircle />}
        />

        <StatCard
          label="Avg Progress"
          value={`${stats.averageProgress}%`}
          icon={<FiClock />}
        />
      </section>

      <section className="grid gap-5">
        {!pageError && projects.length === 0 ? (
          <div className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-8 text-gray-400">
            No projects have been assigned yet.
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]"
            >
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                      <FiFolder />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {project.title}
                      </h2>

                      <p className="text-gray-500 text-sm mt-1">
                        {project.client?.email || "Client project"}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-400 mt-5">
                    {project.description || "No description provided."}
                  </p>

                  {project.notes && (
                    <div className="mt-5 rounded-2xl border border-red-900/20 bg-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-widest text-gray-500">
                        Latest Note
                      </p>

                      <p className="text-gray-300 text-sm mt-2">
                        {project.notes}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <InfoBlock
                      label="Start Date"
                      value={formatDate(project.startDate)}
                      icon={<FiCalendar />}
                    />

                    <InfoBlock
                      label="Deadline"
                      value={formatDate(project.deadline)}
                      icon={<FiClock />}
                    />

                    <InfoBlock
                      label="Budget"
                      value={
                        project.budget
                          ? Number(project.budget).toLocaleString()
                          : "Not set"
                      }
                      icon={<FiTrendingUp />}
                    />
                  </div>
                </div>

                <div className="xl:w-72 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${getStatusStyles(project.status)}`}
                    >
                      {getStatusIcon(project.status)}
                      {project.status || "Active"}
                    </span>

                    <span className="text-red-400 font-semibold">
                      {project.progress || 0}%
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{
                        width: `${project.progress || 0}%`,
                      }}
                    />
                  </div>

                  <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      Progress Summary
                    </p>

                    <p className="text-gray-300 text-sm mt-2">
                      This project is currently {project.status || "Active"} with{" "}
                      {project.progress || 0}% completion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
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
          Total
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

const InfoBlock = ({ label, value, icon }) => {
  return (
    <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-4">
      <div className="flex items-center gap-2 text-red-400">
        {icon}
        <p className="text-xs uppercase tracking-widest text-gray-500">
          {label}
        </p>
      </div>

      <p className="text-white text-sm mt-3">
        {value}
      </p>
    </div>
  );
};

export default Projects;
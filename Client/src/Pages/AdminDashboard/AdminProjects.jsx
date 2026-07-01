import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiFolder,
  FiPauseCircle,
  FiPlayCircle,
  FiRefreshCw,
  FiTrash2,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import api from "../../Service/axios";
import { DashboardSkeleton } from "../Skeleton/Skeleton";

const emptyProgressForm = {
  progress: 0,
  status: "Active",
  notes: "",
};

const statuses = [
  {
    value: "Active",
    label: "Active",
    icon: <FiPlayCircle />,
    className: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  },
  {
    value: "Paused",
    label: "Paused",
    icon: <FiPauseCircle />,
    className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  },
  {
    value: "Completed",
    label: "Completed",
    icon: <FiCheckCircle />,
    className: "border-green-500/30 bg-green-500/10 text-green-300",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    icon: <FiXCircle />,
    className: "border-red-500/30 bg-red-500/10 text-red-300",
  },
];

const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.status === 401) return "You are not logged in or your session expired.";
  if (err.response?.status === 403) return "This account is not allowed to view admin projects.";
  if (err.code === "ERR_NETWORK") return "Cannot connect to the backend. Make sure the server is running on port 3000.";
  return "Something went wrong while loading projects.";
};

const formatDate = (value) => {
  if (!value) return "No date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusConfig = (status) => {
  return statuses.find((item) => item.value === status) || statuses[0];
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [progressForm, setProgressForm] = useState(emptyProgressForm);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        setPageError("");

        const res = await api.get("/admin/Projects");
        const data = res.data?.Projects || res.data?.projects;

        if (cancelled) return;

        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjects([]);
          setPageError("Backend response did not include a projects array.");
        }
      } catch (err) {
        if (cancelled) return;

        setProjects([]);
        setPageError(getErrorMessage(err));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const fetchProjects = async () => {
    try {
      setPageError("");

      const res = await api.get("/admin/Projects");
      const data = res.data?.Projects || res.data?.projects;

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
        setPageError("Backend response did not include a projects array.");
      }
    } catch (err) {
      setProjects([]);
      setPageError(getErrorMessage(err));
    }
  };

  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((project) => project.status === "Active").length;
    const completed = projects.filter((project) => project.status === "Completed").length;
    const submittedPayments = projects.reduce((count, project) => {
      return count + (project.milestones || []).filter((milestone) => milestone.paymentStatus === "Submitted").length;
    }, 0);

    return {
      total,
      active,
      completed,
      submittedPayments,
    };
  }, [projects]);

  const openStatusModal = (project) => {
    setSelectedProject(project);
    setProgressForm({
      progress: project.progress ?? 0,
      status: project.status || "Active",
      notes: project.notes || "",
    });
    setFormError("");
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setSelectedProject(null);
    setProgressForm(emptyProgressForm);
    setFormError("");
    setShowStatusModal(false);
  };

  const updateProjectStatus = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!selectedProject?._id) {
      setFormError("No project selected.");
      return;
    }

    const progressNumber = Number(progressForm.progress);

    if (Number.isNaN(progressNumber) || progressNumber < 0 || progressNumber > 100) {
      setFormError("Progress must be between 0 and 100.");
      return;
    }

    try {
      setActionLoading(true);

      await api.patch(`/admin/Projects/update/${selectedProject._id}`, {
        progress: progressForm.status === "Completed" ? 100 : progressNumber,
        status: progressForm.status,
        notes: progressForm.notes,
      });

      await fetchProjects();
      closeStatusModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update project.");
    } finally {
      setActionLoading(false);
    }
  };

  const quickUpdate = async (project, status) => {
    try {
      setActionLoading(true);

      await api.patch(`/admin/Projects/update/${project._id}`, {
        status,
        progress: status === "Completed" ? 100 : project.progress || 0,
      });

      await fetchProjects();
    } catch (err) {
      setPageError(err.response?.data?.message || "Failed to update project.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteProject = async () => {
    if (!deleteTarget?._id) return;

    try {
      setActionLoading(true);
      await api.delete(`/admin/Projects/delete/${deleteTarget._id}`);
      await fetchProjects();
      setDeleteTarget(null);
    } catch (err) {
      setPageError(err.response?.data?.message || "Failed to delete project.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-red-900/20 bg-black/40 backdrop-blur-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,.08)]">
        <div className="absolute -top-28 -right-20 h-72 w-72 rounded-full bg-red-700/10 blur-[100px]" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <p className="text-red-400 text-xs uppercase tracking-[0.35em] mb-3">
              Project Command Center
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Projects
            </h1>

            <p className="text-gray-400 mt-3 max-w-2xl">
              Update project status visually, track milestones, and monitor payment progress.
            </p>
          </div>

          <button
            onClick={fetchProjects}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/[0.04] border border-red-900/20 px-5 py-3 text-gray-300 hover:bg-red-600/10 hover:text-white"
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>
      </section>

      {pageError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 flex gap-3 text-red-200">
          <FiAlertTriangle className="mt-1 shrink-0" />
          <div>
            <p className="font-medium">Could not load projects</p>
            <p className="text-sm text-red-200/80 mt-1">{pageError}</p>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total Projects" value={stats.total} icon={<FiFolder />} />
        <StatCard label="Active" value={stats.active} icon={<FiPlayCircle />} />
        <StatCard label="Completed" value={stats.completed} icon={<FiCheckCircle />} />
        <StatCard label="Payments Waiting" value={stats.submittedPayments} icon={<FiClock />} />
      </section>

      <section className="grid gap-5">
        {!pageError && projects.length === 0 ? (
          <div className="rounded-[28px] border border-red-900/20 bg-black/35 p-8 text-gray-400">
            No projects found. Create a project from the clients page first.
          </div>
        ) : (
          projects.map((project) => {
            const status = getStatusConfig(project.status);
            const milestones = project.milestones || [];
            const receivedPayments = milestones.filter((milestone) => milestone.paymentStatus === "Received").length;
            const completedMilestones = milestones.filter((milestone) => milestone.status === "Completed").length;

            return (
              <article
                key={project._id}
                className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]"
              >
                <div className="grid xl:grid-cols-[1fr_320px] gap-6">
                  <div>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <ProgressRing value={project.progress || 0} />

                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-xl font-semibold text-white">
                              {project.title}
                            </h2>

                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${status.className}`}
                            >
                              {status.icon}
                              {project.status || "Active"}
                            </span>
                          </div>

                          <p className="text-gray-500 text-sm mt-1">
                            {project.client?.name || "No client"} | {project.client?.email || "No email"}
                          </p>

                          <p className="text-gray-400 mt-4 max-w-3xl">
                            {project.description || "No description provided."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openStatusModal(project)}
                          className="h-11 w-11 rounded-xl bg-red-600/15 border border-red-500/30 text-red-300 hover:bg-red-600/25 hover:text-white flex items-center justify-center"
                          title="Open visual status editor"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(project)}
                          className="h-11 w-11 rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600/20 flex items-center justify-center"
                          title="Delete project"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>

                    {project.notes && (
                      <div className="mt-5 rounded-2xl border border-red-900/20 bg-white/[0.04] p-4">
                        <p className="text-xs uppercase tracking-widest text-gray-500">
                          Latest Note
                        </p>
                        <p className="text-gray-300 text-sm mt-2">{project.notes}</p>
                      </div>
                    )}

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InfoTile label="Start" value={formatDate(project.startDate)} />
                      <InfoTile label="Deadline" value={formatDate(project.deadline)} />
                      <InfoTile
                        label="Budget"
                        value={project.budget ? Number(project.budget).toLocaleString() : "Not set"}
                      />
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold">Milestones</h3>
                        <p className="text-sm text-gray-500">
                          {completedMilestones}/{milestones.length} completed
                        </p>
                      </div>

                      {milestones.length === 0 ? (
                        <p className="text-gray-500 text-sm">No milestones defined.</p>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-3">
                          {milestones.map((milestone) => (
                            <div
                              key={milestone._id}
                              className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-white font-medium">{milestone.title}</p>
                                  <p className="text-gray-500 text-sm mt-1">
                                    Due {formatDate(milestone.dueDate)}
                                  </p>
                                </div>

                                <span
                                  className={`rounded-full px-3 py-1 text-xs ${
                                    milestone.paymentStatus === "Received"
                                      ? "bg-green-500/15 text-green-400"
                                      : milestone.paymentStatus === "Submitted"
                                      ? "bg-yellow-500/15 text-yellow-400"
                                      : "bg-red-500/15 text-red-400"
                                  }`}
                                >
                                  {milestone.paymentStatus}
                                </span>
                              </div>

                              <p className="text-gray-400 text-sm mt-3">
                                Amount: {Number(milestone.amount || 0).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <aside className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-5 h-fit">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      Quick Status
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {statuses.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => quickUpdate(project, item.value)}
                          disabled={actionLoading || project.status === item.value}
                          className={`rounded-2xl border p-4 text-left transition disabled:opacity-45 ${item.className}`}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="block text-sm mt-2">{item.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-5 rounded-2xl border border-red-900/20 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-widest text-gray-500">
                        Payment Health
                      </p>

                      <p className="text-white text-2xl font-bold mt-3">
                        {receivedPayments}/{milestones.length}
                      </p>

                      <p className="text-gray-500 text-sm mt-1">
                        milestone payments received
                      </p>
                    </div>
                  </aside>
                </div>
              </article>
            );
          })
        )}
      </section>

      {showStatusModal && (
        <Modal
          title={`Update ${selectedProject?.title}`}
          onClose={closeStatusModal}
        >
          <form onSubmit={updateProjectStatus} className="space-y-5">
            <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-5">
              <p className="text-sm text-gray-400 mb-4">Choose project status</p>

              <div className="grid grid-cols-2 gap-3">
                {statuses.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setProgressForm({
                        ...progressForm,
                        status: item.value,
                        progress: item.value === "Completed" ? 100 : progressForm.progress,
                      })
                    }
                    className={`rounded-2xl border p-4 text-left transition ${
                      progressForm.status === item.value
                        ? item.className
                        : "border-red-900/20 bg-black/30 text-gray-400 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="block text-sm mt-2">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">Progress</p>
                <p className="text-red-400 font-semibold">{progressForm.progress}%</p>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={progressForm.progress}
                onChange={(e) =>
                  setProgressForm({
                    ...progressForm,
                    progress: Number(e.target.value),
                  })
                }
                className="mt-4 w-full accent-red-600"
              />

              <div className="mt-4 h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-red-500 transition-all"
                  style={{ width: `${progressForm.progress}%` }}
                />
              </div>
            </div>

            <label className="block">
              <span className="text-sm text-gray-400">Admin Note</span>

              <textarea
                rows="4"
                value={progressForm.notes}
                onChange={(e) =>
                  setProgressForm({
                    ...progressForm,
                    notes: e.target.value,
                  })
                }
                className="mt-2 w-full resize-none rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-red-500/40"
                placeholder="Add a project update the client can understand..."
              />
            </label>

            {formError && (
              <p className="rounded-xl border border-red-500/20 bg-red-600/10 px-4 py-3 text-sm text-red-300">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {actionLoading ? "Updating..." : "Save Project Update"}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete Project" onClose={() => setDeleteTarget(null)}>
          <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5">
            <p className="text-white font-medium">Delete this project?</p>
            <p className="text-gray-400 text-sm mt-2">
              {deleteTarget.title} will be permanently removed.
            </p>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-gray-300 hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              onClick={deleteProject}
              disabled={actionLoading}
              className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:opacity-60"
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const ProgressRing = ({ value }) => {
  const normalized = Math.min(100, Math.max(0, Number(value || 0)));
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg className="h-24 w-24 -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="rgba(255,255,255,.08)"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="rgb(239,68,68)"
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold">{normalized}%</span>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => {
  return (
    <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] backdrop-blur-xl p-5">
      <div className="h-12 w-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
        {icon}
      </div>

      <h2 className="text-3xl font-bold text-white mt-5">{value}</h2>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
    </div>
  );
};

const InfoTile = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-4">
      <p className="text-xs uppercase tracking-widest text-gray-500">{label}</p>
      <p className="text-white text-sm mt-3">{value}</p>
    </div>
  );
};

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-red-900/20 bg-[#080808] p-6 shadow-[0_0_45px_rgba(220,38,38,.16)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600/10"
          >
            <FiX />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AdminProjects;
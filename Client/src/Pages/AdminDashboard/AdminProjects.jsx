import { useEffect, useState } from "react";
import {
  FiFolder,
  FiTrash2,
  FiXCircle,
  FiCheckCircle,
  FiX,
  FiAlertTriangle,
  FiEdit3,
} from "react-icons/fi";
import api from "../../Service/axios";
import { DashboardSkeleton } from "../Skeleton/Skeleton";

const emptyProgressForm = {
  progress: "",
  status: "Active",
  notes: "",
};

const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.status === 401) {
    return "You are not logged in or your session expired.";
  }
  if (err.response?.status === 403) {
    return "This account is not allowed to view admin projects.";
  }
  if (err.code === "ERR_NETWORK") {
    return "Cannot connect to the backend. Make sure the server is running on port 3000.";
  }
  return "Something went wrong while loading projects.";
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [pageError, setPageError] = useState("");

  const [selectedProject, setSelectedProject] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressForm, setProgressForm] = useState(emptyProgressForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/admin/Projects")
      .then((res) => {
        if (cancelled) return;

        const data = res.data?.Projects || res.data?.projects;

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
      console.log(err);
      setProjects([]);
      setPageError(getErrorMessage(err));
    }
  };

  const openProgressModal = (project) => {
    setSelectedProject(project);
    setProgressForm({
      progress: project.progress ?? 0,
      status: project.status || "Active",
      notes: project.notes || "",
    });
    setFormError("");
    setShowProgressModal(true);
  };

  const closeProgressModal = () => {
    setSelectedProject(null);
    setProgressForm(emptyProgressForm);
    setFormError("");
    setShowProgressModal(false);
  };

  const updateProgress = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!selectedProject?._id) {
      setFormError("No project selected.");
      return;
    }

    const progressNumber = Number(progressForm.progress);

    if (Number.isNaN(progressNumber) || progressNumber < 0 || progressNumber > 100) {
      setFormError("Progress must be a number between 0 and 100.");
      return;
    }

    try {
      setActionLoading(true);

      await api.patch(`/admin/Projects/update/${selectedProject._id}`, {
        progress: progressNumber,
        status: progressNumber === 100 ? "Completed" : progressForm.status,
        notes: progressForm.notes,
      });

      await fetchProjects();
      closeProgressModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update project.");
    } finally {
      setActionLoading(false);
    }
  };

  const runAction = async () => {
    if (!confirmAction?.project) return;

    try {
      setActionLoading(true);

      if (confirmAction.type === "delete") {
        await api.delete(`/admin/Projects/delete/${confirmAction.project._id}`);
      }

      if (confirmAction.type === "cancel") {
        await api.patch(`/admin/cancelProject/${confirmAction.project._id}`);
      }

      if (confirmAction.type === "complete") {
        await api.patch(`/admin/Projects/update/${confirmAction.project._id}`, {
          status: "Completed",
          progress: 100,
        });
      }

      await fetchProjects();
      setConfirmAction(null);
    } catch (err) {
      setPageError(err.response?.data?.message || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-red-400 text-xs uppercase tracking-[0.35em]">
          Project Control
        </p>

        <h1 className="text-3xl font-bold text-white mt-2">
          Projects
        </h1>

        <p className="text-gray-400 mt-2">
          Track project progress, status and updates.
        </p>
      </div>

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

            <button
              onClick={fetchProjects}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {!pageError && projects.length === 0 ? (
          <p className="text-gray-400">
            No projects found. Create a project from the clients page first.
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
                      <FiFolder />
                    </div>

                    <div>
                      <h3 className="text-white font-semibold">
                        {project.title}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        {project.client?.name || "No client"} |{" "}
                        {project.client?.email || "No email"}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-400 mt-4">
                    {project.description || "No description provided."}
                  </p>

                  {project.notes && (
                    <p className="text-gray-500 text-sm mt-3">
                      Notes: {project.notes}
                    </p>
                  )}

                  <div className="mt-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">
                        Progress
                      </span>

                      <span className="text-red-400">
                        {project.progress || 0}%
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      project.status === "Completed"
                        ? "bg-green-500/15 text-green-400"
                        : project.status === "Cancelled"
                        ? "bg-red-500/15 text-red-400"
                        : project.status === "Paused"
                        ? "bg-yellow-500/15 text-yellow-400"
                        : "bg-white/5 text-gray-300"
                    }`}
                  >
                    {project.status}
                  </span>

                  <button
                    onClick={() => openProgressModal(project)}
                    className="px-4 py-3 rounded-xl bg-white/[0.04] border border-red-900/20 text-gray-300 hover:bg-red-600/10 hover:text-white"
                    title="Update progress"
                  >
                    <FiEdit3 />
                  </button>

                  <button
                    onClick={() =>
                      setConfirmAction({
                        type: "complete",
                        project,
                      })
                    }
                    className="px-4 py-3 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20"
                    title="Mark complete"
                  >
                    <FiCheckCircle />
                  </button>

                  <button
                    onClick={() =>
                      setConfirmAction({
                        type: "cancel",
                        project,
                      })
                    }
                    className="px-4 py-3 rounded-xl bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                    title="Cancel project"
                  >
                    <FiXCircle />
                  </button>

                  <button
                    onClick={() =>
                      setConfirmAction({
                        type: "delete",
                        project,
                      })
                    }
                    className="px-4 py-3 rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600/20"
                    title="Delete project"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showProgressModal && (
        <Modal
          title={`Update ${selectedProject?.title}`}
          onClose={closeProgressModal}
        >
          <form onSubmit={updateProgress} className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-400">
                Progress
              </span>

              <input
                type="number"
                min="0"
                max="100"
                value={progressForm.progress}
                onChange={(e) =>
                  setProgressForm({
                    ...progressForm,
                    progress: e.target.value,
                  })
                }
                className="mt-2 w-full rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-red-500/40"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-400">
                Status
              </span>

              <select
                value={progressForm.status}
                onChange={(e) =>
                  setProgressForm({
                    ...progressForm,
                    status: e.target.value,
                  })
                }
                className="mt-2 w-full rounded-xl border border-red-900/20 bg-[#111] px-4 py-3 text-white outline-none focus:border-red-500/40"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-gray-400">
                Notes
              </span>

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
                placeholder="Add a short progress note..."
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
              {actionLoading ? "Updating..." : "Update Project"}
            </button>
          </form>
        </Modal>
      )}

      {confirmAction && (
        <ConfirmModal
          title="Confirm Project Action"
          itemName={confirmAction.project.title}
          itemDetail={confirmAction.project.client?.name}
          actionType={confirmAction.type}
          loading={actionLoading}
          onCancel={() => setConfirmAction(null)}
          onConfirm={runAction}
        />
      )}
    </div>
  );
};

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-red-900/20 bg-[#080808] p-6 shadow-[0_0_45px_rgba(220,38,38,.16)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {title}
          </h2>

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

const ConfirmModal = ({
  title,
  itemName,
  itemDetail,
  actionType,
  loading,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-[28px] border border-red-900/20 bg-[#080808] p-6 shadow-[0_0_45px_rgba(220,38,38,.16)]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-white">
            {title}
          </h2>

          <button
            onClick={onCancel}
            className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <FiX />
          </button>
        </div>

        <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5">
          <p className="text-white font-medium">
            Preview before continuing
          </p>

          <p className="text-gray-400 text-sm mt-2">
            You are about to {actionType} this project.
          </p>

          <div className="mt-4 text-sm text-gray-300">
            <p>
              <span className="text-gray-500">Project:</span>{" "}
              {itemName}
            </p>

            <p>
              <span className="text-gray-500">Client:</span>{" "}
              {itemDetail || "No client"}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-gray-300 hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Processing..." : `Confirm ${actionType}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;
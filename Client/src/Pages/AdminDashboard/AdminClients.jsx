import { useEffect, useState } from "react";
import {
  FiUsers,
  FiPhone,
  FiMail,
  FiSlash,
  FiPlus,
  FiFolder,
  FiCalendar,
  FiX,
  FiAlertTriangle,
  FiTrash2,
} from "react-icons/fi";
import api from "../../Service/axios";
import { DashboardSkeleton } from "../Skeleton/Skeleton";

const emptyClientForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  company: "",
};

const emptyMilestone = {
  title: "",
  description: "",
  amount: "",
  dueDate: "",
};

const emptyProjectForm = {
  title: "",
  description: "",
  startDate: "",
  deadline: "",
  budget: "",
  milestones: [{ ...emptyMilestone }],
};

const emptyMeetingForm = {
  title: "",
  description: "",
  meetingDate: "",
  venue: "",
};

const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.status === 401) return "You are not logged in or your session expired.";
  if (err.response?.status === 403) return "This account is not allowed to view admin clients.";
  if (err.code === "ERR_NETWORK") return "Cannot connect to the backend. Make sure the server is running on port 3000.";
  return "Something went wrong while loading clients.";
};

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [clientForm, setClientForm] = useState(emptyClientForm);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [meetingForm, setMeetingForm] = useState(emptyMeetingForm);
  const [confirmAction, setConfirmAction] = useState(null);
  const [formError, setFormError] = useState("");

  const fetchClients = async () => {
    try {
      setPageError("");

      const res = await api.get("/admin/clients");
      const data = res.data?.clients;

      if (Array.isArray(data)) {
        setClients(data);
      } else {
        setClients([]);
        setPageError("Backend response did not include a clients array.");
      }
    } catch (err) {
      setClients([]);
      setPageError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadClients = async () => {
      try {
        setPageError("");

        const res = await api.get("/admin/clients");
        const data = res.data?.clients;

        if (cancelled) return;

        if (Array.isArray(data)) {
          setClients(data);
        } else {
          setClients([]);
          setPageError("Backend response did not include a clients array.");
        }
      } catch (err) {
        if (cancelled) return;

        setClients([]);
        setPageError(getErrorMessage(err));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

  loadClients();

  return () => {
    cancelled = true;
  };
}, []);

  const closeModal = () => {
    setModalType(null);
    setSelectedClient(null);
    setClientForm(emptyClientForm);
    setProjectForm(emptyProjectForm);
    setMeetingForm(emptyMeetingForm);
    setFormError("");
  };

  const createClient = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      setActionLoading(true);
      await api.post("/admin/clients", clientForm);
      await fetchClients();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create client.");
    } finally {
      setActionLoading(false);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!selectedClient?._id) {
      setFormError("No client selected.");
      return;
    }

    const milestones = projectForm.milestones
      .map((milestone) => ({
        title: milestone.title.trim(),
        description: milestone.description.trim(),
        amount: Number(milestone.amount),
        dueDate: milestone.dueDate,
      }))
      .filter((milestone) => milestone.title && milestone.amount >= 0 && milestone.dueDate);

    if (milestones.length === 0) {
      setFormError("Add at least one valid milestone.");
      return;
    }

    try {
      setActionLoading(true);

      await api.post(`/admin/clients/${selectedClient._id}/projects`, {
        title: projectForm.title,
        description: projectForm.description,
        startDate: projectForm.startDate,
        deadline: projectForm.deadline,
        budget: projectForm.budget ? Number(projectForm.budget) : undefined,
        milestones,
      });

      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create project.");
    } finally {
      setActionLoading(false);
    }
  };

  const createMeeting = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!selectedClient?._id) {
      setFormError("No client selected.");
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/admin/clients/${selectedClient._id}/meetings`, meetingForm);
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to schedule meeting.");
    } finally {
      setActionLoading(false);
    }
  };

  const suspendClient = async () => {
    if (!confirmAction?.client?._id) return;

    try {
      setActionLoading(true);
      await api.patch(`/admin/clients/${confirmAction.client._id}/suspend`);
      await fetchClients();
      setConfirmAction(null);
    } catch (err) {
      setPageError(err.response?.data?.message || "Failed to suspend client.");
    } finally {
      setActionLoading(false);
    }
  };

  const updateMilestone = (index, field, value) => {
    const nextMilestones = [...projectForm.milestones];
    nextMilestones[index] = {
      ...nextMilestones[index],
      [field]: value,
    };

    setProjectForm({
      ...projectForm,
      milestones: nextMilestones,
    });
  };

  const addMilestone = () => {
    setProjectForm({
      ...projectForm,
      milestones: [...projectForm.milestones, { ...emptyMilestone }],
    });
  };

  const removeMilestone = (index) => {
    const nextMilestones = projectForm.milestones.filter((_, itemIndex) => itemIndex !== index);

    setProjectForm({
      ...projectForm,
      milestones: nextMilestones.length ? nextMilestones : [{ ...emptyMilestone }],
    });
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-red-400 text-xs uppercase tracking-[0.35em]">
            Client Management
          </p>
          <h1 className="text-3xl font-bold text-white mt-2">Clients</h1>
          <p className="text-gray-400 mt-2">
            Create clients, assign projects and define payable milestones.
          </p>
        </div>

        <button
          onClick={() => setModalType("client")}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600/15 border border-red-500/30 px-5 py-3 text-red-300 hover:bg-red-600/25 hover:text-white transition-all"
        >
          <FiPlus />
          Create Client
        </button>
      </div>

      {pageError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 flex gap-3 text-red-200">
          <FiAlertTriangle className="mt-1 shrink-0" />
          <div>
            <p className="font-medium">Could not load clients</p>
            <p className="text-sm text-red-200/80 mt-1">{pageError}</p>
            <button
              onClick={fetchClients}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <div className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl overflow-hidden">
        <div className="p-6 border-b border-red-900/20 flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <FiUsers />
          </div>
          <h2 className="text-white font-semibold">Client Directory ({clients.length})</h2>
        </div>

        <div className="divide-y divide-red-900/20">
          {!pageError && clients.length === 0 ? (
            <p className="p-6 text-gray-400">
              No clients found. Create a client or approve a consultation first.
            </p>
          ) : (
            clients.map((client) => (
              <div
                key={client._id}
                className="p-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 hover:bg-red-600/[0.04]"
              >
                <div>
                  <h3 className="text-white font-semibold capitalize">{client.name}</h3>

                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                      <FiMail className="text-red-400" />
                      {client.email}
                    </span>

                    <span className="flex items-center gap-2">
                      <FiPhone className="text-red-400" />
                      {client.phone || "No phone"}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mt-2">
                    {client.company || "No company provided"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      client.status === "Active"
                        ? "bg-green-500/15 text-green-400"
                        : client.status === "Suspended"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-yellow-500/15 text-yellow-400"
                    }`}
                  >
                    {client.status}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      setModalType("project");
                    }}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] border border-red-900/20 text-gray-300 hover:bg-red-600/10 hover:text-white transition"
                  >
                    <span className="flex items-center gap-2">
                      <FiFolder />
                      Project
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      setModalType("meeting");
                    }}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] border border-red-900/20 text-gray-300 hover:bg-red-600/10 hover:text-white transition"
                  >
                    <span className="flex items-center gap-2">
                      <FiCalendar />
                      Meeting
                    </span>
                  </button>

                  <button
                    onClick={() => setConfirmAction({ type: "suspend", client })}
                    disabled={client.status === "Suspended"}
                    className="px-4 py-2 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 disabled:opacity-40"
                  >
                    <FiSlash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {modalType === "client" && (
        <Modal title="Create Client" onClose={closeModal}>
          <form onSubmit={createClient} className="space-y-4">
            <Input label="Name" value={clientForm.name} onChange={(value) => setClientForm({ ...clientForm, name: value })} />
            <Input label="Email" type="email" value={clientForm.email} onChange={(value) => setClientForm({ ...clientForm, email: value })} />
            <Input label="Password" type="password" value={clientForm.password} onChange={(value) => setClientForm({ ...clientForm, password: value })} />
            <Input label="Phone" value={clientForm.phone} onChange={(value) => setClientForm({ ...clientForm, phone: value })} />
            <Input label="Company" value={clientForm.company} onChange={(value) => setClientForm({ ...clientForm, company: value })} />
            <FormFooter error={formError} loading={actionLoading} buttonText="Create Client" />
          </form>
        </Modal>
      )}

      {modalType === "project" && (
        <Modal title={`Create Project for ${selectedClient?.name}`} onClose={closeModal}>
          <form onSubmit={createProject} className="space-y-4">
            <Input label="Project Title" value={projectForm.title} onChange={(value) => setProjectForm({ ...projectForm, title: value })} />
            <Textarea label="Description" value={projectForm.description} onChange={(value) => setProjectForm({ ...projectForm, description: value })} />
            <Input label="Start Date" type="date" value={projectForm.startDate} onChange={(value) => setProjectForm({ ...projectForm, startDate: value })} />
            <Input label="Deadline" type="date" value={projectForm.deadline} onChange={(value) => setProjectForm({ ...projectForm, deadline: value })} />
            <Input label="Budget" type="number" value={projectForm.budget} onChange={(value) => setProjectForm({ ...projectForm, budget: value })} />

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-white font-semibold">Milestones</h3>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="rounded-xl bg-red-600/15 border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-600/25"
                >
                  Add Milestone
                </button>
              </div>

              {projectForm.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-300">Milestone {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <Input label="Milestone Title" value={milestone.title} onChange={(value) => updateMilestone(index, "title", value)} />
                  <Textarea label="Milestone Description" value={milestone.description} onChange={(value) => updateMilestone(index, "description", value)} />
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input label="Amount" type="number" value={milestone.amount} onChange={(value) => updateMilestone(index, "amount", value)} />
                    <Input label="Due Date" type="date" value={milestone.dueDate} onChange={(value) => updateMilestone(index, "dueDate", value)} />
                  </div>
                </div>
              ))}
            </div>

            <FormFooter error={formError} loading={actionLoading} buttonText="Create Project" />
          </form>
        </Modal>
      )}

      {modalType === "meeting" && (
        <Modal title={`Schedule Meeting for ${selectedClient?.name}`} onClose={closeModal}>
          <form onSubmit={createMeeting} className="space-y-4">
            <Input label="Meeting Title" value={meetingForm.title} onChange={(value) => setMeetingForm({ ...meetingForm, title: value })} />
            <Textarea label="Description" value={meetingForm.description} onChange={(value) => setMeetingForm({ ...meetingForm, description: value })} />
            <Input label="Meeting Date and Time" type="datetime-local" value={meetingForm.meetingDate} onChange={(value) => setMeetingForm({ ...meetingForm, meetingDate: value })} />
            <Input label="Venue" value={meetingForm.venue} onChange={(value) => setMeetingForm({ ...meetingForm, venue: value })} />
            <FormFooter error={formError} loading={actionLoading} buttonText="Schedule Meeting" />
          </form>
        </Modal>
      )}

      {confirmAction && (
        <Modal title="Confirm Action" onClose={() => setConfirmAction(null)}>
          <div className="space-y-5">
            <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5">
              <p className="text-white font-medium">Preview before continuing</p>
              <p className="text-gray-400 text-sm mt-2">
                You are about to suspend this client account.
              </p>
              <div className="mt-4 text-sm text-gray-300">
                <p><span className="text-gray-500">Client:</span> {confirmAction.client.name}</p>
                <p><span className="text-gray-500">Email:</span> {confirmAction.client.email}</p>
                <p><span className="text-gray-500">Current Status:</span> {confirmAction.client.status}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-gray-300 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={suspendClient}
                disabled={actionLoading}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {actionLoading ? "Processing..." : "Confirm Suspend"}
              </button>
            </div>
          </div>
        </Modal>
      )}
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

const Input = ({ label, value, onChange, type = "text" }) => {
  return (
    <label className="block">
      <span className="text-sm text-gray-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-red-500/40"
        required
      />
    </label>
  );
};

const Textarea = ({ label, value, onChange }) => {
  return (
    <label className="block">
      <span className="text-sm text-gray-400">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows="4"
        className="mt-2 w-full resize-none rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-red-500/40"
        required
      />
    </label>
  );
};

const FormFooter = ({ error, loading, buttonText }) => {
  return (
    <>
      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-600/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
      >
        {loading ? "Please wait..." : buttonText}
      </button>
    </>
  );
};

export default AdminClients;
import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiCheck,
  FiTrash2,
  FiX,
  FiXCircle,
  FiAlertTriangle,
  FiMapPin,
} from "react-icons/fi";
import api from "../../Service/axios";
import { DashboardSkeleton } from "../Skeleton/Skeleton";

const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.status === 401) {
    return "You are not logged in or your session expired.";
  }
  if (err.response?.status === 403) {
    return "This account is not allowed to view admin meetings.";
  }
  if (err.code === "ERR_NETWORK") {
    return "Cannot connect to the backend. Make sure the server is running on port 3000.";
  }
  return "Something went wrong while loading meetings.";
};

const formatDate = (dateValue) => {
  if (!dateValue) return "No date set";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString();
};

const AdminMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/admin/meetings")
      .then((res) => {
        if (cancelled) return;

        const data = res.data?.meetings;

        if (Array.isArray(data)) {
          setMeetings(data);
        } else {
          setMeetings([]);
          setPageError("Backend response did not include a meetings array.");
        }
      })
      .catch((err) => {
        if (cancelled) return;

        console.log(err);
        setMeetings([]);
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

  const fetchMeetings = async () => {
    try {
      setPageError("");

      const res = await api.get("/admin/meetings");
      const data = res.data?.meetings;

      if (Array.isArray(data)) {
        setMeetings(data);
      } else {
        setMeetings([]);
        setPageError("Backend response did not include a meetings array.");
      }
    } catch (err) {
      console.log(err);
      setMeetings([]);
      setPageError(getErrorMessage(err));
    }
  };

  const runAction = async () => {
    if (!confirmAction?.meeting?._id) return;

    try {
      setActionLoading(true);
      setPageError("");

      if (confirmAction.type === "complete") {
        await api.patch(`/admin/meetings/${confirmAction.meeting._id}/complete`);
      }

      if (confirmAction.type === "cancel") {
        await api.patch(`/admin/meetings/${confirmAction.meeting._id}/cancel`);
      }

      if (confirmAction.type === "delete") {
        await api.delete(`/admin/meetings/${confirmAction.meeting._id}`);
      }

      await fetchMeetings();
      setConfirmAction(null);
    } catch (err) {
      console.log(err);
      setPageError(err.response?.data?.message || "Meeting action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  const totalMeetings = meetings.length;
  const scheduledMeetings = meetings.filter(
    (meeting) => meeting.status === "Scheduled"
  ).length;
  const completedMeetings = meetings.filter(
    (meeting) => meeting.status === "Completed"
  ).length;
  const cancelledMeetings = meetings.filter(
    (meeting) => meeting.status === "Cancelled"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-red-400 text-xs uppercase tracking-[0.35em]">
          Schedule
        </p>

        <h1 className="text-3xl font-bold text-white mt-2">
          Meetings
        </h1>

        <p className="text-gray-400 mt-2">
          Manage scheduled client meetings and statuses.
        </p>
      </div>

      {pageError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 flex gap-3 text-red-200">
          <FiAlertTriangle className="mt-1 shrink-0" />

          <div>
            <p className="font-medium">
              Could not load meetings
            </p>

            <p className="text-sm text-red-200/80 mt-1">
              {pageError}
            </p>

            <button
              onClick={fetchMeetings}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total" value={totalMeetings} />
        <StatCard label="Scheduled" value={scheduledMeetings} />
        <StatCard label="Completed" value={completedMeetings} />
        <StatCard label="Cancelled" value={cancelledMeetings} />
      </div>

      <div className="grid gap-4">
        {!pageError && meetings.length === 0 ? (
          <p className="text-gray-400">
            No meetings found. Schedule a meeting from the clients page first.
          </p>
        ) : (
          meetings.map((meeting) => (
            <div
              key={meeting._id}
              className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    <FiCalendar />
                  </div>

                  <div>
                    <h3 className="text-white font-semibold">
                      {meeting.title}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {meeting.client?.name || "No client"} |{" "}
                      {meeting.client?.email || "No email"}
                    </p>

                    <p className="text-gray-300 text-sm mt-3">
                      {formatDate(meeting.meetingDate)}
                    </p>

                    <p className="text-gray-400 mt-3">
                      {meeting.description || "No description provided."}
                    </p>

                    <p className="text-gray-500 text-sm mt-3 flex items-center gap-2">
                      <FiMapPin className="text-red-400" />
                      {meeting.venue || "No venue provided"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      meeting.status === "Completed"
                        ? "bg-green-500/15 text-green-400"
                        : meeting.status === "Cancelled"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-yellow-500/15 text-yellow-400"
                    }`}
                  >
                    {meeting.status}
                  </span>

                  <button
                    onClick={() =>
                      setConfirmAction({
                        type: "complete",
                        meeting,
                      })
                    }
                    disabled={
                      meeting.status === "Completed" ||
                      meeting.status === "Cancelled"
                    }
                    className="px-4 py-3 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 disabled:opacity-40"
                    title="Mark complete"
                  >
                    <FiCheck />
                  </button>

                  <button
                    onClick={() =>
                      setConfirmAction({
                        type: "cancel",
                        meeting,
                      })
                    }
                    disabled={
                      meeting.status === "Completed" ||
                      meeting.status === "Cancelled"
                    }
                    className="px-4 py-3 rounded-xl bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 disabled:opacity-40"
                    title="Cancel meeting"
                  >
                    <FiXCircle />
                  </button>

                  <button
                    onClick={() =>
                      setConfirmAction({
                        type: "delete",
                        meeting,
                      })
                    }
                    className="px-4 py-3 rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600/20"
                    title="Delete meeting"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {confirmAction && (
        <ConfirmModal
          title="Confirm Meeting Action"
          itemName={confirmAction.meeting.title}
          itemDetail={confirmAction.meeting.client?.name}
          itemDate={formatDate(confirmAction.meeting.meetingDate)}
          actionType={confirmAction.type}
          loading={actionLoading}
          onCancel={() => setConfirmAction(null)}
          onConfirm={runAction}
        />
      )}
    </div>
  );
};

const StatCard = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-red-900/20 bg-black/35 p-5">
      <p className="text-gray-500 text-sm">
        {label}
      </p>

      <h2 className="text-3xl font-bold text-white mt-2">
        {value}
      </h2>
    </div>
  );
};

const ConfirmModal = ({
  title,
  itemName,
  itemDetail,
  itemDate,
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
            You are about to {actionType} this meeting.
          </p>

          <div className="mt-4 text-sm text-gray-300 space-y-1">
            <p>
              <span className="text-gray-500">Meeting:</span>{" "}
              {itemName}
            </p>

            <p>
              <span className="text-gray-500">Client:</span>{" "}
              {itemDetail || "No client"}
            </p>

            <p>
              <span className="text-gray-500">Date:</span>{" "}
              {itemDate}
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

export default AdminMeetings;
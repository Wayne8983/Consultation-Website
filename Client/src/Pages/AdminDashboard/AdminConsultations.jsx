import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiCheck,
  FiClipboard,
  FiX,
} from "react-icons/fi";
import api from "../../Service/axios";
import { DashboardSkeleton } from "../Skeleton/Skeleton";

const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;

  if (err.response?.status === 401) {
    return "You are not logged in or your session expired.";
  }

  if (err.response?.status === 403) {
    return "This account is not allowed to manage consultations.";
  }

  if (err.code === "ERR_NETWORK") {
    return "Cannot connect to the backend. Make sure the server is running on port 3000.";
  }

  return "Something went wrong while loading consultations.";
};

const AdminConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/admin/consultations")
      .then((res) => {
        if (cancelled) return;

        const data = res.data?.consultations;

        if (Array.isArray(data)) {
          setConsultations(data);
        } else {
          setConsultations([]);
          setPageError("Backend response did not include a consultations array.");
        }
      })
      .catch((err) => {
        if (cancelled) return;

        console.log(err);
        setConsultations([]);
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

  const fetchConsultations = async () => {
    try {
      setPageError("");

      const res = await api.get("/admin/consultations");
      const data = res.data?.consultations;

      if (Array.isArray(data)) {
        setConsultations(data);
      } else {
        setConsultations([]);
        setPageError("Backend response did not include a consultations array.");
      }
    } catch (err) {
      console.log(err);
      setConsultations([]);
      setPageError(getErrorMessage(err));
    }
  };

  const runAction = async () => {
    if (!confirmAction?.consultation?._id) return;

    try {
      setActionLoading(true);
      setPageError("");

      if (confirmAction.type === "approve") {
        await api.patch(
          `/admin/consultations/${confirmAction.consultation._id}/approve`
        );
      }

      if (confirmAction.type === "reject") {
        await api.patch(
          `/admin/consultations/${confirmAction.consultation._id}/reject`
        );
      }

      await fetchConsultations();
      setConfirmAction(null);
    } catch (err) {
      console.log(err);
      setPageError(
        err.response?.data?.message || "Consultation action failed."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-red-400 text-xs uppercase tracking-[0.35em]">
          Requests
        </p>

        <h1 className="text-3xl font-bold text-white mt-2">
          Consultations
        </h1>

        <p className="text-gray-400 mt-2">
          Approve or reject consultation requests.
        </p>
      </div>

      {pageError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 flex gap-3 text-red-200">
          <FiAlertTriangle className="mt-1 shrink-0" />

          <div>
            <p className="font-medium">
              Could not load consultations
            </p>

            <p className="text-sm text-red-200/80 mt-1">
              {pageError}
            </p>

            <button
              onClick={fetchConsultations}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {!pageError && consultations.length === 0 ? (
          <p className="text-gray-400">
            No consultation requests found.
          </p>
        ) : (
          consultations.map((item) => (
            <div
              key={item._id}
              className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6"
            >
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
                      <FiClipboard />
                    </div>

                    <div>
                      <h3 className="text-white font-semibold capitalize">
                        {item.name}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        {item.email} | {item.phone}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-300 mt-5">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs">
                      {item.projectType}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs">
                      {item.preferredContactMethod}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        item.status === "Approved"
                          ? "bg-green-500/15 text-green-400"
                          : item.status === "Rejected"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-yellow-500/15 text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {item.status === "Pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setConfirmAction({
                          type: "approve",
                          consultation: item,
                        })
                      }
                      className="px-4 py-3 rounded-xl bg-green-500/15 text-green-400 hover:bg-green-500/25"
                      title="Approve consultation"
                    >
                      <FiCheck />
                    </button>

                    <button
                      onClick={() =>
                        setConfirmAction({
                          type: "reject",
                          consultation: item,
                        })
                      }
                      className="px-4 py-3 rounded-xl bg-red-600/15 text-red-400 hover:bg-red-600/25"
                      title="Reject consultation"
                    >
                      <FiX />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {confirmAction && (
        <ConfirmModal
          title="Confirm Consultation Action"
          itemName={confirmAction.consultation.name}
          itemEmail={confirmAction.consultation.email}
          itemPhone={confirmAction.consultation.phone}
          itemProjectType={confirmAction.consultation.projectType}
          actionType={confirmAction.type}
          loading={actionLoading}
          onCancel={() => setConfirmAction(null)}
          onConfirm={runAction}
        />
      )}
    </div>
  );
};

const ConfirmModal = ({
  title,
  itemName,
  itemEmail,
  itemPhone,
  itemProjectType,
  actionType,
  loading,
  onCancel,
  onConfirm,
}) => {
  const actionText = actionType === "approve" ? "approve" : "reject";

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
            You are about to {actionText} this consultation request.
          </p>

          <div className="mt-4 text-sm text-gray-300 space-y-1">
            <p>
              <span className="text-gray-500">Client:</span>{" "}
              {itemName}
            </p>

            <p>
              <span className="text-gray-500">Email:</span>{" "}
              {itemEmail}
            </p>

            <p>
              <span className="text-gray-500">Phone:</span>{" "}
              {itemPhone}
            </p>

            <p>
              <span className="text-gray-500">Project Type:</span>{" "}
              {itemProjectType}
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
            className={`flex-1 rounded-xl px-4 py-3 text-white disabled:opacity-60 ${
              actionType === "approve"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Processing..." : `Confirm ${actionText}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminConsultations;
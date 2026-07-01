import { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiCheckCircle, FiClock, FiCreditCard } from "react-icons/fi";
import api from "../../Service/axios";
import { DashboardSkeleton } from "../Skeleton/Skeleton";

const formatMoney = (value) => Number(value || 0).toLocaleString();
const formatDate = (value) => {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const AdminPayments = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setPageError("");
      const res = await api.get("/admin/Projects");
      const data = res.data?.Projects || res.data?.projects;
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not load payments.");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  let cancelled = false;

  const loadProjects = async () => {
    try {
      setPageError("");

      const res = await api.get("/admin/Projects");
      const data = res.data?.Projects || res.data?.projects;

      if (cancelled) return;

      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      if (cancelled) return;

      setPageError(err.response?.data?.message || "Could not load payments.");
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

  const payments = useMemo(() => {
    return projects.flatMap((project) =>
      (project.milestones || []).map((milestone) => ({
        ...milestone,
        projectId: project._id,
        projectTitle: project.title,
        clientName: project.client?.name,
        clientEmail: project.client?.email,
      }))
    );
  }, [projects]);

  const confirmPayment = async (payment) => {
    try {
      setActionLoading(true);
      await api.patch(`/admin/Projects/${payment.projectId}/milestones/${payment._id}/confirm-payment`);
      await fetchProjects();
    } catch (err) {
      setPageError(err.response?.data?.message || "Failed to confirm payment.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  const submittedCount = payments.filter((payment) => payment.paymentStatus === "Submitted").length;
  const receivedCount = payments.filter((payment) => payment.paymentStatus === "Received").length;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-red-900/20 bg-black/40 backdrop-blur-2xl p-6 md:p-8">
        <p className="text-red-400 text-xs uppercase tracking-[0.35em] mb-3">Payment Control</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white">Milestone Payments</h1>
        <p className="text-gray-400 mt-3 max-w-2xl">
          Review client payment submissions and mark received payments.
        </p>
      </section>

      {pageError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 flex gap-3 text-red-200">
          <FiAlertTriangle className="mt-1 shrink-0" />
          <p>{pageError}</p>
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard label="Total Milestones" value={payments.length} icon={<FiCreditCard />} />
        <StatCard label="Submitted" value={submittedCount} icon={<FiClock />} />
        <StatCard label="Received" value={receivedCount} icon={<FiCheckCircle />} />
      </section>

      <section className="grid gap-5">
        {payments.length === 0 ? (
          <div className="rounded-[28px] border border-red-900/20 bg-black/35 p-8 text-gray-400">
            No milestone payments found.
          </div>
        ) : (
          payments.map((payment) => (
            <div
              key={payment._id}
              className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div>
                  <p className="text-red-400 text-sm">{payment.clientName || "No client"} | {payment.clientEmail || "No email"}</p>
                  <h2 className="text-xl font-semibold text-white mt-1">{payment.title}</h2>
                  <p className="text-gray-500 text-sm mt-1">{payment.projectTitle}</p>
                  <p className="text-gray-400 mt-3">{payment.description || "No description provided."}</p>

                  <div className="flex flex-wrap gap-3 mt-5 text-sm">
                    <span className="rounded-full bg-white/[0.04] border border-red-900/20 px-3 py-1 text-gray-300">
                      Amount: {formatMoney(payment.amount)}
                    </span>
                    <span className="rounded-full bg-white/[0.04] border border-red-900/20 px-3 py-1 text-gray-300">
                      Due: {formatDate(payment.dueDate)}
                    </span>
                    <span className={`rounded-full px-3 py-1 ${
                      payment.paymentStatus === "Received"
                        ? "bg-green-500/15 text-green-400"
                        : payment.paymentStatus === "Submitted"
                        ? "bg-yellow-500/15 text-yellow-400"
                        : "bg-red-500/15 text-red-400"
                    }`}>
                      {payment.paymentStatus}
                    </span>
                  </div>

                  {payment.paymentReference && (
                    <p className="text-gray-400 text-sm mt-4">
                      Reference: {payment.paymentReference}
                    </p>
                  )}

                  {payment.paymentNote && (
                    <p className="text-gray-500 text-sm mt-2">
                      Note: {payment.paymentNote}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => confirmPayment(payment)}
                  disabled={payment.paymentStatus === "Received" || actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  <FiCheckCircle />
                  {payment.paymentStatus === "Received" ? "Received" : "Mark Received"}
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-5">
    <div className="h-12 w-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
      {icon}
    </div>
    <h2 className="text-3xl font-bold text-white mt-5">{value}</h2>
    <p className="text-gray-400 text-sm mt-1">{label}</p>
  </div>
);

export default AdminPayments;
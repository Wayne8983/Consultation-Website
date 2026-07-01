import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiSend,
  FiX,
} from "react-icons/fi";
import api from "../../Service/axios";
import { DashboardSkeleton } from "../Skeleton/Skeleton";

const formatMoney = (value) => Number(value || 0).toLocaleString();

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

const Payments = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    paymentReference: "",
    paymentNote: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        setPageError("");

        const res = await api.get("/client/getClientProjects");
        const data = res.data?.clientProjects;

        if (cancelled) return;

        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        if (cancelled) return;

        setPageError(
          err.response?.data?.message || "Could not load milestone payments."
        );
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

      const res = await api.get("/client/getClientProjects");
      const data = res.data?.clientProjects;

      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setPageError(
        err.response?.data?.message || "Could not load milestone payments."
      );
    }
  };

  const payments = useMemo(() => {
    return projects.flatMap((project) =>
      (project.milestones || []).map((milestone) => ({
        ...milestone,
        projectId: project._id,
        projectTitle: project.title,
      }))
    );
  }, [projects]);

  const submitPayment = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!selectedPayment) return;

    try {
      setActionLoading(true);

      await api.patch(
        `/client/projects/${selectedPayment.projectId}/milestones/${selectedPayment._id}/submit-payment`,
        paymentForm
      );

      await fetchProjects();
      setSelectedPayment(null);
      setPaymentForm({
        paymentReference: "",
        paymentNote: "",
      });
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to submit payment.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-red-900/20 bg-black/40 backdrop-blur-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,.08)]">
        <div className="absolute -top-28 -right-20 h-72 w-72 rounded-full bg-red-700/10 blur-[100px]" />

        <div className="relative">
          <p className="text-red-400 text-xs uppercase tracking-[0.35em] mb-3">
            Milestone Payments
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Payments
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl">
            Submit payment details for each project milestone and wait for admin
            confirmation.
          </p>
        </div>
      </section>

      {pageError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 flex gap-3 text-red-200">
          <FiAlertTriangle className="mt-1 shrink-0" />

          <div>
            <p className="font-medium">Could not load payments</p>
            <p className="text-sm text-red-200/80 mt-1">{pageError}</p>
          </div>
        </div>
      )}

      <section className="grid gap-5">
        {!pageError && payments.length === 0 ? (
          <div className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-8 text-gray-400">
            No milestone payments found.
          </div>
        ) : (
          payments.map((payment) => (
            <div
              key={payment._id}
              className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div>
                  <p className="text-red-400 text-sm">
                    {payment.projectTitle}
                  </p>

                  <h2 className="text-xl font-semibold text-white mt-1">
                    {payment.title}
                  </h2>

                  <p className="text-gray-400 mt-3">
                    {payment.description || "No description provided."}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-5 text-sm">
                    <span className="rounded-full bg-white/[0.04] border border-red-900/20 px-3 py-1 text-gray-300">
                      Amount: {formatMoney(payment.amount)}
                    </span>

                    <span className="rounded-full bg-white/[0.04] border border-red-900/20 px-3 py-1 text-gray-300">
                      Due: {formatDate(payment.dueDate)}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 ${
                        payment.paymentStatus === "Received"
                          ? "bg-green-500/15 text-green-400"
                          : payment.paymentStatus === "Submitted"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </div>

                  {payment.paymentReference && (
                    <p className="text-gray-500 text-sm mt-3">
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
                  onClick={() => {
                    setSelectedPayment(payment);
                    setPaymentForm({
                      paymentReference: payment.paymentReference || "",
                      paymentNote: payment.paymentNote || "",
                    });
                    setFormError("");
                  }}
                  disabled={payment.paymentStatus === "Received"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {payment.paymentStatus === "Received" ? (
                    <FiCheckCircle />
                  ) : (
                    <FiSend />
                  )}

                  {payment.paymentStatus === "Submitted"
                    ? "Update Submission"
                    : payment.paymentStatus === "Received"
                    ? "Received"
                    : "Submit Payment"}
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {selectedPayment && (
        <Modal title="Submit Payment" onClose={() => setSelectedPayment(null)}>
          <form onSubmit={submitPayment} className="space-y-4">
            <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-4">
              <p className="text-white font-medium">
                {selectedPayment.title}
              </p>

              <p className="text-gray-400 text-sm mt-1">
                {selectedPayment.projectTitle} | Amount:{" "}
                {formatMoney(selectedPayment.amount)}
              </p>
            </div>

            <Input
              label="Payment Reference"
              value={paymentForm.paymentReference}
              onChange={(value) =>
                setPaymentForm({
                  ...paymentForm,
                  paymentReference: value,
                })
              }
            />

            <label className="block">
              <span className="text-sm text-gray-400">Payment Note</span>

              <textarea
                rows="4"
                value={paymentForm.paymentNote}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    paymentNote: e.target.value,
                  })
                }
                className="mt-2 w-full resize-none rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-red-500/40"
                placeholder="Example: Paid via M-Pesa, bank transfer, cheque..."
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
              {actionLoading ? "Submitting..." : "Submit Payment"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

const Input = ({ label, value, onChange }) => {
  return (
    <label className="block">
      <span className="text-sm text-gray-400">{label}</span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-red-500/40"
        required
      />
    </label>
  );
};

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-red-900/20 bg-[#080808] p-6 shadow-[0_0_45px_rgba(220,38,38,.16)]">
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

export default Payments;
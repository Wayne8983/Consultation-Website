import { payments } from "./Data/Data";

const AdminPayments = () => {


  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-white">
        Payments
      </h1>

      <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">

        {payments.map((payment, index) => (
          <div
            key={index}
            className="p-6 border-b border-white/5 flex justify-between"
          >
            <div>
              <h3 className="text-white">
                {payment.client}
              </h3>

              <p className="text-slate-400">
                {payment.amount}
              </p>
            </div>

            <span
              className={
                payment.status === "Paid"
                  ? "text-green-400"
                  : "text-yellow-400"
              }
            >
              {payment.status}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
};

export default AdminPayments;
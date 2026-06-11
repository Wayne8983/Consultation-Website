const Payments = () => {
  const transactions = [
    {
      title: "Initial Deposit",
      amount: "Ksh.50000",
      status: "Completed",
    },
    {
      title: "Design Phase",
      amount: "Ksh.100,000",
      status: "Completed",
    },
    {
      title: "Development Phase",
      amount: "Ksh.180,000",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Payments
        </h1>

        <p className="text-slate-400 mt-1">
          Track project payments and financial progress.
        </p>
      </div>

      {/* Hero Card */}
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-gradient-to-br
          from-purple-600/20
          via-[#111827]
          to-[#0B1020]
          p-8
        "
      >
        <div
          className="
            absolute
            right-0
            top-0
            h-52
            w-52
            rounded-full
            bg-purple-500/20
            blur-3xl
          "
        />

        <div className="relative z-10">
          <p className="text-purple-300 text-sm uppercase tracking-widest">
            Project Budget
          </p>

          <h2 className="text-5xl font-bold text-white mt-3">
            Ksh.200,500
          </h2>

          <p className="text-slate-400 mt-3">
            Total approved budget for the project.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div
          className="
            rounded-3xl
            border border-white/10
            bg-white/[0.03]
            p-6
            backdrop-blur-xl
          "
        >
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Amount Paid
          </p>

          <h2 className="text-3xl font-bold text-green-400 mt-3">
            100,500
          </h2>
        </div>

        <div
          className="
            rounded-3xl
            border border-white/10
            bg-white/[0.03]
            p-6
            backdrop-blur-xl
          "
        >
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Remaining
          </p>

          <h2 className="text-3xl font-bold text-yellow-400 mt-3">
            Ksh.100,000
          </h2>
        </div>

        <div
          className="
            rounded-3xl
            border border-white/10
            bg-white/[0.03]
            p-6
            backdrop-blur-xl
          "
        >
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Payment Status
          </p>

          <h2 className="text-3xl font-bold text-purple-400 mt-3">
            60%
          </h2>
        </div>

      </div>

      {/* Progress */}
      <div
        className="
          rounded-3xl
          border border-white/10
          bg-white/[0.03]
          backdrop-blur-xl
          p-6
        "
      >
        <div className="flex justify-between mb-4">

          <h2 className="text-lg font-semibold text-white">
            Payment Progress
          </h2>

          <span className="text-purple-400">
            60%
          </span>

        </div>

        <div
          className="
            h-4
            rounded-full
            bg-white/5
            overflow-hidden
          "
        >
          <div
            className="
              h-full
              w-[60%]
              rounded-full
              bg-gradient-to-r
              from-purple-500
              via-violet-500
              to-fuchsia-500
            "
          />
        </div>
      </div>

      {/* Transactions */}
      <div
        className="
          rounded-3xl
          border border-white/10
          bg-white/[0.03]
          backdrop-blur-xl
          p-6
        "
      >
        <h2 className="text-lg font-semibold text-white mb-6">
          Recent Transactions
        </h2>

        <div className="space-y-4">

          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                justify-between
                p-4
                rounded-2xl
                bg-white/5
                hover:bg-white/10
                transition
              "
            >
              <div>
                <p className="text-white font-medium">
                  {transaction.title}
                </p>

                <p className="text-sm text-slate-400">
                  {transaction.amount}
                </p>
              </div>

              <span
                className={`
                  px-3 py-1
                  rounded-full
                  text-sm
                  ${
                    transaction.status === "Completed"
                      ? "bg-green-500/15 text-green-400"
                      : "bg-yellow-500/15 text-yellow-400"
                  }
                `}
              >
                {transaction.status}
              </span>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default Payments;
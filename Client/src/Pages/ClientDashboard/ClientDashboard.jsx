import SkeletonCard from "../Skeleton/Skeleton";
const ClientDashboard = () => {
  const loading = false;
  if (loading) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
  const cards = [
    {
      title: "Project Status",
      value: "In Progress",
    },
    {
      title: "Completion",
      value: "65%",
    },
    {
      title: "Documents",
      value: "4 Files",
    },
    {
      title: "Next Meeting",
      value: "Jun 18",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Page Header */}
      {/* <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Track your project progress and updates.
        </p>
      </div> */}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {cards.map((card, index) => (
          <div
            key={index}
            className="
              rounded-2xl
              border border-white/10
              bg-gradient-to-br
              from-purple-500/10
              to-purple-900/5
              backdrop-blur-xl
              p-6
            "
          >
            <p className="text-gray-400 text-sm">
              {card.title}
            </p>

            <h2 className="text-3xl font-bold text-white mt-3">
              {card.value}
            </h2>
          </div>
        ))}

      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Timeline */}
        <div
          className="
            xl:col-span-2
            rounded-3xl
            border border-white/10
            bg-white/5
            backdrop-blur-xl
            p-6
          "
        >
          <h2 className="text-xl font-semibold mb-6">
            Project Timeline
          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">
              <span>Planning</span>
              <span className="text-green-400">Completed</span>
            </div>

            <div className="flex justify-between">
              <span>Design</span>
              <span className="text-green-400">Completed</span>
            </div>

            <div className="flex justify-between">
              <span>Development</span>
              <span className="text-yellow-400">In Progress</span>
            </div>

            <div className="flex justify-between">
              <span>Testing</span>
              <span className="text-gray-500">Pending</span>
            </div>

          </div>
        </div>

        {/* Activity */}
        <div
          className="
            rounded-3xl
            border border-white/10
            bg-white/5
            backdrop-blur-xl
            p-6
          "
        >
          <h2 className="text-xl font-semibold mb-6">
            Recent Activity
          </h2>

          <div className="space-y-4">

            <div className="border-b border-white/5 pb-3">
              Design files uploaded
            </div>

            <div className="border-b border-white/5 pb-3">
              Meeting scheduled
            </div>

            <div className="border-b border-white/5 pb-3">
              Project milestone completed
            </div>

            <div>
              Feedback received
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default ClientDashboard;
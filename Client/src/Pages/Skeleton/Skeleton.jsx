const SkeletonCard = () => {
  return (
    <div
      className="
        rounded-2xl
        border border-red-900/20
        bg-white/[0.04]
        backdrop-blur-xl
        p-5
        animate-pulse
      "
    >
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/10" />
        <div className="h-3 w-12 rounded-full bg-white/10" />
      </div>

      <div className="h-9 w-20 rounded-lg bg-white/10 mt-5" />
      <div className="h-4 w-28 rounded bg-white/10 mt-3" />
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      <div
        className="
          rounded-[28px]
          border border-red-900/20
          bg-black/40
          backdrop-blur-2xl
          p-6 md:p-8
          animate-pulse
        "
      >
        <div className="h-3 w-36 rounded bg-red-500/20 mb-5" />
        <div className="h-10 w-72 max-w-full rounded bg-white/10 mb-4" />
        <div className="h-4 w-full max-w-xl rounded bg-white/10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div
          className="
            xl:col-span-2
            rounded-[28px]
            border border-red-900/20
            bg-black/35
            p-6
            animate-pulse
          "
        >
          <div className="h-6 w-48 rounded bg-white/10 mb-6" />

          <div className="space-y-5">
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-11/12 rounded bg-white/10" />
            <div className="h-4 w-10/12 rounded bg-white/10" />
          </div>
        </div>

        <div
          className="
            rounded-[28px]
            border border-red-900/20
            bg-black/35
            p-6
            animate-pulse
          "
        >
          <div className="h-6 w-36 rounded bg-white/10 mb-6" />

          <div className="space-y-3">
            <div className="h-14 rounded-2xl bg-white/10" />
            <div className="h-14 rounded-2xl bg-white/10" />
            <div className="h-14 rounded-2xl bg-white/10" />
            <div className="h-14 rounded-2xl bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
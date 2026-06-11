const SkeletonCard = () => {
  return (
    <div
      className="
        rounded-3xl
        border border-white/5
        bg-white/[0.03]
        p-6
        animate-pulse
      "
    >
      <div className="h-5 w-32 bg-white/10 rounded mb-4"></div>

      <div className="h-10 w-20 bg-white/10 rounded mb-3"></div>

      <div className="h-4 w-full bg-white/10 rounded"></div>
    </div>
  );
};

export default SkeletonCard;
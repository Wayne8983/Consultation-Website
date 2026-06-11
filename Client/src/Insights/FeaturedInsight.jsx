import insights from "./InsightsData/InsightsData";

const FeaturedInsight = () => {
  const featured = insights[0];

  return (
    <section className="bg-[#0b0b10] py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div
          className="
            rounded-3xl
            border border-white/10
            bg-white/5
            overflow-hidden
            grid lg:grid-cols-2
          "
        >
          <div className="min-h-[350px] bg-gradient-to-br from-fuchsia-600/20 to-purple-600/20" />

          <div className="p-10 flex flex-col justify-center">
            <span className="text-fuchsia-400">
              Featured Insight
            </span>

            <h2 className="mt-4 text-4xl font-bold text-white">
              {featured.title}
            </h2>

            <p className="mt-6 text-slate-400">
              {featured.description}
            </p>

            <button className="mt-8 text-fuchsia-400 hover:text-fuchsia-300">
              Read Article →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturedInsight;
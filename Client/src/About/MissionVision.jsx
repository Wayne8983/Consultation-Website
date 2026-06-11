const cards = [
  {
    title: "Vision",
    text: "To create high-performance, customer-focused and learning cultures in African organizations.",
  },
  {
    title: "Mission",
    text: "Assist clients create strategic customer value through innovation and organizational excellence.",
  },
  {
    title: "Our Promise",
    text: "Deliver measurable results, knowledge transfer, and sustainable organizational growth.",
  },
];

const MissionVision = () => {
  return (
    <section className="bg-[#0b0b10] py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-fuchsia-400 uppercase tracking-[0.2em] text-sm">
            Purpose & Direction
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">
            What Drives Us
          </h2>

          <p className="mt-6 text-slate-400 max-w-2xl mx-auto">
            Everything we do is guided by a commitment to
            helping organizations grow, innovate and achieve
            lasting impact.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {cards.map((card, index) => (
            <div
              key={index}
              className="
                p-8
                rounded-3xl
                bg-white/5
                border
                border-white/10
                backdrop-blur-md
                hover:-translate-y-2
                hover:border-fuchsia-500/30
                transition-all
                duration-300
              "
            >
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-fuchsia-500/10
                  border
                  border-fuchsia-500/20
                  flex
                  items-center
                  justify-center
                  text-fuchsia-400
                  font-bold
                  text-xl
                "
              >
                {index + 1}
              </div>

              <h3 className="mt-6 text-2xl font-semibold text-white">
                {card.title}
              </h3>

              <p className="mt-4 text-slate-400 leading-relaxed">
                {card.text}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default MissionVision;
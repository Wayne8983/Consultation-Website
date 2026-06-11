const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We analyze your organization, challenges, opportunities and strategic goals.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "Together we design a practical roadmap aligned with your objectives.",
  },
  {
    number: "03",
    title: "Execute",
    description:
      "We support implementation through consulting, coaching and training.",
  },
  {
    number: "04",
    title: "Measure",
    description:
      "Performance is monitored using clear KPIs and measurable outcomes.",
  },
];

const Process = () => {
  return (
    <section className="bg-[#0b0b10] py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center">
          <span className="text-fuchsia-400 uppercase tracking-[0.2em] text-sm">
            Our Process
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">
            How We Deliver Results
          </h2>

          <p className="mt-6 text-slate-400 max-w-2xl mx-auto">
            A structured approach that transforms ideas into
            measurable business outcomes.
          </p>
        </div>

        {/* Process Cards */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {steps.map((step) => (
            <div
              key={step.number}
              className="
                relative
                rounded-3xl
                border border-white/10
                bg-white/5
                backdrop-blur-md
                p-8
                hover:-translate-y-2
                hover:border-fuchsia-500/30
                transition-all duration-300
              "
            >
              <div className="text-5xl font-bold text-fuchsia-400/30">
                {step.number}
              </div>

              <h3 className="mt-6 text-2xl font-semibold text-white">
                {step.title}
              </h3>

              <p className="mt-4 text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Process;
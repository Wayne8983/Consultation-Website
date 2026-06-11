const services = [
  {
    title: "Strategic Planning",
    description:
      "Develop clear strategies that align vision, goals and execution.",
  },
  {
    title: "Leadership Development",
    description:
      "Build high-performing leaders capable of driving transformation.",
  },
  {
    title: "Performance Management",
    description:
      "Improve accountability, productivity and organizational results.",
  },
  {
    title: "Corporate Training",
    description:
      "Practical training programs focused on measurable business impact.",
  },
  {
    title: "Organizational Transformation",
    description:
      "Guide change initiatives that strengthen culture and performance.",
  },
  {
    title: "Innovation Management",
    description:
      "Create systems that encourage innovation and sustainable growth.",
  },
];

const ServiceGrid = () => {
  return (
    <section className="bg-[#0b0b10] py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {services.map((service, index) => (
            <div
              key={index}
              className="
                rounded-3xl
                bg-white/5
                border border-white/10
                p-8
                hover:-translate-y-2
                hover:border-fuchsia-500/30
                transition-all duration-300
              "
            >
              <div className="text-fuchsia-400 font-bold text-lg">
                0{index + 1}
              </div>

              <h3 className="mt-4 text-2xl font-semibold text-white">
                {service.title}
              </h3>

              <p className="mt-4 text-slate-400">
                {service.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default ServiceGrid;
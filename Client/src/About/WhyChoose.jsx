import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";
const reasons = [
  {
    title: "Tailor-Made Solutions",
    description:
      "Every organization is unique. We design solutions that align with your goals, challenges and growth strategy.",
  },
  {
    title: "Knowledge Transfer",
    description:
      "We focus on building internal capability so your team can sustain results long after our engagement ends.",
  },
  {
    title: "Strategy Execution",
    description:
      "We help bridge the gap between planning and implementation to ensure measurable outcomes.",
  },
  {
    title: "Continuous Learning",
    description:
      "Our training programs are practical, relevant and focused on delivering real business value.",
  },
  {
    title: "Regional Expertise",
    description:
      "Extensive experience working with organizations across Africa gives us valuable local and regional insights.",
  },
  {
    title: "Results Driven",
    description:
      "Everything we do is focused on performance improvement, growth and sustainable impact.",
  },
];

const WhyChoose = () => {
         useEffect(() => {
            AOS.init({
              duration: 1000,
              once: false,
              offset: 120,
            });
      
            AOS.refresh();
          }, []);
  return (
    <section className="bg-[#0b0b10] py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center">
          <span className="text-fuchsia-400 uppercase tracking-[0.2em] text-sm"
          data-aos="fade-up"
          data-aos-delay="100"
          >
            Why Choose Us
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white"
          data-aos="fade-up"
          data-aos-delay="100"
          >
            More Than Consultants
          </h2>

          <p className="mt-6 text-slate-400 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
          >
            We partner with organizations to create lasting value,
            strengthen leadership and build high-performance cultures.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {reasons.map((reason, index) => (
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              key={index}
              className="
                group
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
              {/* Number */}
              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="
                  w-14 h-14
                  rounded-2xl
                  flex items-center justify-center
                  bg-fuchsia-500/10
                  border border-fuchsia-500/20
                  text-fuchsia-400
                  font-bold
                  text-lg
                "
              >
                0{index + 1}
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white"
              data-aos="fade-up"
              data-aos-delay="100"
              >
                {reason.title}
              </h3>

              <p className="mt-4 text-slate-400 leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="100"
              >
                {reason.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default WhyChoose;
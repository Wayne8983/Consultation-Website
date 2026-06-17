import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

const featuredServices = [
  {
    title: "Strategic Planning",
    description:
      "Develop practical strategies that align vision, people and execution.",
  },
  {
    title: "Leadership Development",
    description:
      "Equip leaders with the skills needed to drive organizational transformation.",
  },
  {
    title: "Corporate Training",
    description:
      "Industry-focused training programs designed for measurable impact.",
  },
];

const FeaturedServices = () => {
         useEffect(() => {
            AOS.init({
              duration: 2000,
              once: false,
              offset: 120,
            });
      
            AOS.refresh();
          }, []);
  return (
    <section className="bg-[#0b0b10] py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">
          <span className="text-fuchsia-400 uppercase tracking-[0.2em] text-sm"
          data-aos="fade-up"
          data-aos-delay="100"
          >
            Featured Services
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white"
          data-aos="fade-up"
          data-aos-delay="100"
          >
            Expertise That Creates Value
          </h2>
        </div>

        <div className="mt-16 grid lg:grid-cols-3 gap-8">

          {featuredServices.map((service, index) => (
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              key={index}
              className="
                rounded-3xl
                overflow-hidden
                border border-white/10
                bg-white/5
                hover:border-fuchsia-500/30
                hover:-translate-y-2
                transition-all duration-300
              "
            >
              <div className="h-56 bg-gradient-to-br from-fuchsia-600/20 to-purple-600/20" />

              <div className="p-8">
                <h3 className="text-2xl font-semibold text-white"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  {service.title}
                </h3>

                <p className="mt-4 text-slate-400"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  {service.description}
                </p>

                <button
                  data-aos="fade-up"
                  data-aos-delay="100"
                  className="
                    mt-6
                    text-fuchsia-400
                    hover:text-fuchsia-300
                    transition
                  "
                >
                  Learn More →
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default FeaturedServices;
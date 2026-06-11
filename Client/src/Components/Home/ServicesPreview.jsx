import {
  Briefcase,
  Users,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

const services = [
  {
    title: "Strategy Consulting",
    description:
      "Helping organizations define clear objectives, align teams, and execute growth strategies.",
    icon: Briefcase,
  },
  {
    title: "Leadership Development",
    description:
      "Equipping leaders with the skills and mindset needed to drive performance and innovation.",
    icon: Users,
  },
  {
    title: "Performance Management",
    description:
      "Designing systems that improve accountability, productivity, and measurable outcomes.",
    icon: TrendingUp,
  },
  {
    title: "Training & Capacity Building",
    description:
      "Practical programs that strengthen teams and improve organizational effectiveness.",
    icon: GraduationCap,
  },
];

const ServicesPreview = () => {
      useEffect(() => {
      AOS.init({
        duration: 1000,
        once: false,
        offset: 120,
      });
  
      AOS.refresh();
    }, []);
  return (
    <section className="bg-[#0b0b10] py-28 overflow-hidden ">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-fuchsia-400 uppercase tracking-[0.2em] text-sm"
              data-aos="fade-up"
              data-aos-delay="100"
          >
            Services
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white"
              data-aos="fade-up"
              data-aos-delay="150"
          >
            Solutions that drive measurable results
          </h2>

          <p className="mt-6 text-slate-400"
              data-aos="fade-up"
              data-aos-delay="200"
          >
            We partner with organizations to solve strategic,
            leadership, and performance challenges through
            practical, results-focused solutions.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-16"
              data-aos="fade-up"
              data-aos-delay="220"
        >

          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                data-aos="fade-up" 
                data-aos-delay="200"
                key={service.title}
                className="
                  group
                  rounded-3xl
                  border border-white/10
                  bg-white/5
                  backdrop-blur-md
                  p-8
                  transition-all
                  duration-300
                  hover:border-fuchsia-500/40
                  hover:-translate-y-1
                "
              >
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-fuchsia-400" />
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-white">
                  {service.title}
                </h3>

                <p className="mt-4 text-slate-400 leading-relaxed">
                  {service.description}
                </p>

                <button className="mt-6 text-fuchsia-400 font-medium">
                  Learn More →
                </button>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
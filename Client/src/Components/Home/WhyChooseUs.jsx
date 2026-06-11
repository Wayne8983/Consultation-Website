import {
  Target,
  Lightbulb,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

const features = [
  {
    title: "Strategic Focus",
    description:
      "Every engagement is aligned with your long-term business goals.",
    icon: Target,
  },
  {
    title: "Innovative Solutions",
    description:
      "We combine proven methodologies with fresh thinking.",
    icon: Lightbulb,
  },
  {
    title: "Data-Driven Decisions",
    description:
      "Insights and recommendations backed by measurable results.",
    icon: BarChart3,
  },
  {
    title: "Trusted Partnership",
    description:
      "We work alongside your team to ensure sustainable success.",
    icon: ShieldCheck,
  },
];

const WhyChooseUs = () => {
        useEffect(() => {
          AOS.init({
            duration: 1000,
            once: false,
            offset: 120,
          });
    
          AOS.refresh();
        }, []);
  return (
    <section className="bg-[#0b0b10] py-28">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center max-w-3xl mx-auto">
          <p className="text-fuchsia-400 uppercase tracking-[0.2em] text-sm"
              data-aos="fade-up"
              data-aos-delay="100"
          >
            Why Choose Us
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white"
              data-aos="fade-up"
              data-aos-delay="120"
          >
            More than consultants, strategic partners
          </h2>

          <p className="mt-6 text-slate-400"
              data-aos="fade-up"
              data-aos-delay="100"
          >
            We help organizations move from planning to execution,
            delivering measurable impact at every stage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                data-aos="fade-up"
                data-aos-delay="100"
                key={feature.title}
                className="
                  flex gap-5
                  rounded-3xl
                  border border-white/10
                  bg-white/5
                  backdrop-blur-md
                  p-8
                  hover:border-fuchsia-500/40
                  transition-all duration-300
                "
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-fuchsia-400" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
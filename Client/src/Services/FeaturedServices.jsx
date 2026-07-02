import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import AOS from "aos";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Lightbulb,
  Sparkles,
} from "lucide-react";

const featuredServices = [
  {
    title: "Strategic Planning",
    icon: Lightbulb,
    eyebrow: "Direction & Focus",
    description:
      "Develop practical strategies that align vision, people and execution.",
    details:
      "We help your team clarify priorities, identify growth opportunities, define measurable goals and turn big-picture ambition into a practical execution roadmap.",
    points: ["Vision alignment", "Growth roadmap", "Execution priorities"],
  },
  {
    title: "Leadership Development",
    icon: BarChart3,
    eyebrow: "People & Performance",
    description:
      "Equip leaders with the skills needed to drive organizational transformation.",
    details:
      "Our leadership programs strengthen decision-making, communication, accountability and team performance so leaders can guide change with confidence.",
    points: ["Executive coaching", "Team alignment", "Change leadership"],
  },
  {
    title: "Corporate Training",
    icon: GraduationCap,
    eyebrow: "Skills & Capability",
    description:
      "Industry-focused training programs designed for measurable impact.",
    details:
      "We design practical learning experiences that help teams build capability, improve daily execution and apply new skills directly to business outcomes.",
    points: ["Custom workshops", "Practical tools", "Measurable learning"],
  },
];

const FeaturedServices = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      once: false,
      offset: 90,
    });

    AOS.refresh();
  }, []);

  const toggleCard = (index) => {
    setExpandedCard((current) => (current === index ? null : index));
  };

  return (
    <section className="relative overflow-hidden bg-[#0b0b10] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(220,38,38,.12),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(244,63,94,.10),transparent_34%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-red-300"
            data-aos="fade-up"
            data-aos-delay="80"
          >
            <Sparkles size={15} />
            Featured Services
          </span>

          <h2
            className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl"
            data-aos="fade-up"
            data-aos-delay="160"
          >
            Expertise That Feels Practical, Focused and Built for Growth
          </h2>

          <p
            className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400"
            data-aos="fade-up"
            data-aos-delay="240"
          >
            Explore the core services designed to help organizations move from
            strategy conversations to measurable progress.
          </p>
        </div>

        <div className="mt-16 grid gap-7 lg:grid-cols-3">
          {featuredServices.map((service, index) => {
            const Icon = service.icon;
            const isExpanded = expandedCard === index;

            return (
              <article
                key={service.title}
                data-aos="fade-up"
                data-aos-delay={120 + index * 120}
                className={`group overflow-hidden rounded-2xl border bg-white/[0.045] shadow-[0_24px_70px_rgba(0,0,0,.26)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-red-400/35 hover:bg-white/[0.07] ${
                  isExpanded
                    ? "border-red-400/40"
                    : "border-white/10"
                }`}
              >
                <div className="relative p-7">
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-red-500/10 transition group-hover:bg-red-500/20" />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300">
                        <Icon size={25} />
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-slate-400">
                        0{index + 1}
                      </span>
                    </div>

                    <p className="mt-7 text-sm font-semibold uppercase tracking-[0.24em] text-red-300">
                      {service.eyebrow}
                    </p>

                    <h3 className="mt-3 text-2xl font-bold text-white">
                      {service.title}
                    </h3>

                    <p className="mt-4 leading-7 text-slate-400">
                      {service.description}
                    </p>

                    <div
                      className={`grid transition-all duration-500 ${
                        isExpanded
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="mt-6 border-t border-white/10 pt-6">
                          <p className="leading-7 text-slate-300">
                            {service.details}
                          </p>

                          <div className="mt-5 grid gap-3">
                            {service.points.map((point) => (
                              <div
                                key={point}
                                className="flex items-center gap-3 text-sm text-slate-300"
                              >
                                <span className="h-2 w-2 rounded-full bg-red-400" />
                                {point}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleCard(index)}
                      className="mt-7 inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 font-semibold text-red-200 transition hover:border-red-300/40 hover:bg-red-500/20 hover:text-white"
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? "Show Less" : "Read More"}

                      {isExpanded ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 bg-black/20 px-7 py-5">
                  <span className="text-sm text-slate-500">
                    Built for measurable impact
                  </span>

                  <ArrowRight
                    size={18}
                    className={`text-red-300 transition ${
                      isExpanded ? "translate-x-1" : ""
                    }`}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
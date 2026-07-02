import { Link } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Target,
} from "lucide-react";

const HERO_IMAGE = "https://res.cloudinary.com/pvaabczg/image/upload/v1782910965/hero_gewwvx.png";

const Hero = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: false,
      offset: 90,
      delay: 60,
    });

    AOS.refresh();
  }, []);

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-[#07080c] text-white">
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,#07080c_0%,rgba(7,8,12,.96)_38%,rgba(7,8,12,.72)_68%,rgba(7,8,12,.38)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_32%,rgba(220,38,38,.24),transparent_34%)]" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl items-center px-6 py-28">
        <div className="max-w-4xl">
          <div
            data-aos="fade-right"
            data-aos-delay="80"
            className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-red-200 backdrop-blur-md"
          >
            <Sparkles size={15} />
            Strategy • Vision • Innovation
          </div>

          <h1
            data-aos="fade-right"
            data-aos-delay="180"
            className="mt-7 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-white md:text-7xl"
          >
            Transform Strategy Into{" "}
            <span className="text-red-400">Measurable Growth</span>
          </h1>

          <p
            data-aos="fade-right"
            data-aos-delay="300"
            className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl"
          >
            We help organizations execute strategy effectively through
            leadership development, performance systems, and operational
            excellence.
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="420"
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              to="/consultation"
              className="group inline-flex items-center gap-3 rounded-xl bg-red-600 px-6 py-4 font-semibold text-white shadow-[0_18px_45px_rgba(220,38,38,.28)] transition hover:bg-red-500"
            >
              Book Consultation
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-6 py-4 font-semibold text-white backdrop-blur-md transition hover:border-red-400/50 hover:bg-white/15"
            >
              Explore Services
            </Link>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="540"
            className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3"
          >
            <HeroPoint icon={<Target size={18} />} label="Clear Strategy" />
            <HeroPoint icon={<BarChart3 size={18} />} label="Measured Growth" />
            <HeroPoint icon={<CheckCircle2 size={18} />} label="Better Execution" />
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroPoint = ({ icon, label }) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-medium text-slate-200 backdrop-blur-md">
      <span className="text-red-300">{icon}</span>
      {label}
    </div>
  );
};

export default Hero;
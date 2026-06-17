import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";
const WhoWeAre = () => {
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

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Image Side */}
          <div
          data-aos="fade-up"
          data-aos-delay="100"
          >
            <div className="relative h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-white/5">

            <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Team Collaboration"
                className="w-full h-full object-cover"
            />

            {/* SHARP SHIMMER */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 h-full w-1/3 -translate-x-full animate-shimmerSharp bg-gradient-to-r from-transparent via-white/80 to-transparent rotate-12" />
            </div>

            </div>
          </div>

          {/* Content Side */}
          <div>

            <span
              data-aos="fade-up"
              data-aos-delay="100"
              className="
                text-fuchsia-400
                uppercase
                tracking-[0.2em]
                text-sm
              "
            >
              Who We Are
            </span>

            <h2
              data-aos="fade-up"
              data-aos-delay="100"
              className="
                mt-4
                text-4xl
                md:text-5xl
                font-bold
                text-white
              "
            >
              Building Organizations
              For Sustainable Growth
            </h2>

            <p className="mt-8 text-slate-400 leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
            >
              The Center for Strategy & Management was established
              to help organizations across Africa build internal
              capability through leadership development,
              strategic management, and innovation.
            </p>

            <p className="mt-6 text-slate-400 leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
            >
              We partner with organizations to strengthen
              strategy execution, improve performance,
              and create long-term competitive advantage.
            </p>

            {/* Highlights */}
            <div className="mt-10 grid sm:grid-cols-2 gap-4">

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <h3 className="text-white font-semibold"
                data-aos="fade-up"
                data-aos-delay="100"
                >
                  Strategy
                </h3>

                <p className="mt-2 text-slate-400 text-sm"
                data-aos="fade-up"
                data-aos-delay="100"
                >
                  Aligning vision with measurable execution.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <h3 className="text-white font-semibold"
                data-aos="fade-up"
                data-aos-delay="100"
                >
                  Leadership
                </h3>

                <p className="mt-2 text-slate-400 text-sm"
                data-aos="fade-up"
                data-aos-delay="100"
                >
                  Developing leaders that drive change.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default WhoWeAre;
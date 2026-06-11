import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

const CTA = () => {
         useEffect(() => {
            AOS.init({
              duration: 1000,
              once: false,
              offset: 120,
            });
      
            AOS.refresh();
          }, []);
  return (
    <section className="bg-[#0b0b10] py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">

        <div
          data-aos="fade-up"
          data-aos-delay="100"
          className="
            rounded-[32px]
            border border-white/10
            bg-gradient-to-r
            from-fuchsia-500/10
            via-white/5
            to-blue-500/10
            backdrop-blur-md
            p-12 md:p-20
            text-center
          "
        >
          <p className="text-fuchsia-400 uppercase tracking-[0.2em] text-sm"
              data-aos="fade-up"
              data-aos-delay="170"
          >
            Ready To Get Started?
          </p>

          <h2 className="mt-4 text-4xl md:text-6xl font-bold text-white"
              data-aos="fade-up"
              data-aos-delay="180"
          >
            Let's build your next success story
          </h2>

          <p className="mt-6 text-slate-400 max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="200"
          >
            Whether you're looking to improve performance,
            develop leaders, or create a winning strategy,
            we're ready to help.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to='/consultation'
              data-aos="fade-right"
              data-aos-delay="220"
              className="
                px-8 py-4
                rounded-xl
                bg-fuchsia-500
                text-white
                font-medium
                hover:bg-fuchsia-600
                transition
              "
            >
              Book Consultation
            </Link>

            <button
              data-aos="fade-left"
              data-aos-delay="220"
              className="
                px-8 py-4
                rounded-xl
                border border-white/10
                text-white
                hover:bg-white/5
                transition
                flex items-center justify-center gap-2
              "
            >
              Learn More
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CTA;
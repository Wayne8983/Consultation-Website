import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

const ServicesHero = () => {
           useEffect(() => {
              AOS.init({
                duration: 2000,
                once: false,
                offset: 120,
              });
        
              AOS.refresh();
            }, []);
  return (
    <section className="bg-[#0b0b10] pt-40 pb-24">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <span className="text-fuchsia-400 uppercase tracking-[0.2em] text-sm"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          Our Services
        </span>

        <h1 className="mt-6 text-5xl md:text-7xl font-bold text-white"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Solutions That Drive
          <span className="text-fuchsia-400"
          data-aos="fade-up"
          data-aos-delay="100"
          > Growth</span>
        </h1>

        <p className="mt-8 text-lg text-slate-400 max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          We help organizations improve performance,
          strengthen leadership, accelerate innovation
          and execute strategies that create measurable results.
        </p>

      </div>
    </section>
  );
};

export default ServicesHero;
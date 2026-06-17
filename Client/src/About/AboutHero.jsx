import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

const AboutHero = () => {
         useEffect(() => {
            AOS.init({
              duration: 2000,
              once: false,
              offset: 120,
            });
      
            AOS.refresh();
          }, []);
  return (
    <section className="bg-[#0b0b10] pt-40 pb-24 ">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <span
          data-aos="fade-up"
          data-aos-delay="100"
          className="
            inline-block
            px-4 py-2
            rounded-full
            border border-fuchsia-500/20
            bg-fuchsia-500/10
            text-fuchsia-400
            text-sm
          "
        >
          About Us
        </span>

        <h1
          data-aos="fade-up"
          data-aos-delay="200"
          className="
            mt-8
            text-5xl
            md:text-7xl
            font-bold
            text-white
            leading-tight
          "
        >
          Helping African Organizations
          <span className="text-fuchsia-400">
            {" "}Turn Strategy Into Results
          </span>
        </h1>

        <p
          data-aos="fade-up"
          data-aos-delay="600"
          className="
            mt-8
            text-lg
            md:text-xl
            text-slate-400
            max-w-3xl
            mx-auto
            
          "
        >
          We help organizations strengthen leadership,
          improve performance, and build sustainable
          competitive advantage through strategy,
          innovation, and organizational transformation.
        </p>

      </div>
    </section>
  );
};

export default AboutHero;
import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

const industries = [
  "Banking",
  "Insurance",
  "Oil & Gas",
  "Retail",
  "Real Estate",
  "ICT",
  "Agriculture",
  "Education",
  "Government",
  "NGOs",
  "Manufacturing",
  "Construction",
];

const Industries = () => {
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
            Industries We Serve
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white"
          data-aos="fade-up"
          data-aos-delay="100"
          >
            Trusted Across Multiple Sectors
          </h2>

          <p className="mt-6 text-slate-400 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
          >
            Our expertise spans both public and private sector
            organizations, helping leaders navigate growth,
            transformation and performance improvement.
          </p>
        </div>

        {/* Industry Cards */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {industries.map((industry, index) => (
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              key={index}
              className="
                rounded-2xl
                border border-white/10
                bg-white/5
                backdrop-blur-md
                p-6
                text-center
                hover:-translate-y-2
                hover:border-fuchsia-500/30
                hover:bg-white/10
                transition-all duration-300
              "
            >
            <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-fuchsia-400"></div>
                    <h3 className="text-white font-medium"
                    data-aos="fade-up"
                    data-aos-delay="100"
                    >
                        {industry}
                    </h3>
                </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Industries;
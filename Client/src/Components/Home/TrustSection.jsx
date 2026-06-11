import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";


    const stats = [
      {
        number: "500+",
        label: "Organizations Served",
      },
      {
        number: "95%",
        label: "Client Satisfaction",
      },
      {
        number: "14+",
        label: "Countries Reached",
      },
      {
        number: "1000+",
        label: "Professionals Trained",
      },
    ];


const TrustSection = () => {
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

        <div className="text-center mb-14">
          <p className="text-fuchsia-400 uppercase tracking-widest text-sm"
              data-aos="fade-up"
              data-aos-delay="80"
          >
            Trusted Results
          </p>

          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white"
              data-aos="fade-up"
              data-aos-delay="200"
          >
            Delivering measurable impact
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {stats.map((stat) => (
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              key={stat.label}
              className="
                rounded-2xl
                border border-white/10
                bg-white/5
                backdrop-blur-md
                p-8
                text-center
                transition-all
                duration-300
                hover:border-fuchsia-500/40
                hover:-translate-y-1
              "
            >
              <h3 className="text-4xl font-bold text-white">
                {stat.number}
              </h3>

              <p className="mt-3 text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default TrustSection;
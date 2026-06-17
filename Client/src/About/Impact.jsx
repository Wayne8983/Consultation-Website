import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";
const stats = [
  {
    number: "50+",
    title: "Years Combined Experience",
  },
  {
    number: "10+",
    title: "Countries Served",
  },
  {
    number: "30%-70%",
    title: "Average Growth Achieved",
  },
  {
    number: "100%",
    title: "Commitment To Client Success",
  },
];

const Impact = () => {
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

        <div className="text-center">
          <span 
          className="text-fuchsia-400 uppercase tracking-[0.2em] text-sm"
          data-aos="fade-up"
          data-aos-delay="100"
          >
            Our Impact
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white drop-shadow-[0_0_30px_rgba(217,70,239,0.3)]"data-aos="fade-up" data-aos-delay="200">
            Delivering Results Across Africa
          </h2>

          <p className="mt-6 text-slate-400 max-w-2xl mx-auto"data-aos="fade-up"data-aos-delay="100">
            We help organizations improve performance,
            strengthen leadership and create sustainable
            competitive advantage.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {stats.map((stat, index) => (
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              key={index}
              className="
                rounded-3xl
                border border-white/10
                bg-white/5
                backdrop-blur-md
                p-8
                text-center
                hover:-translate-y-2
                hover:border-fuchsia-500/30
                transition-all duration-300
              "
            >
              <h3 className="text-5xl font-bold text-fuchsia-400"
              data-aos="fade-up"
              data-aos-delay="200"
              >
                {stat.number}
              </h3>

              <p className="mt-4 text-slate-300"
              data-aos="fade-up"
              data-aos-delay="100"
              >
                {stat.title}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Impact


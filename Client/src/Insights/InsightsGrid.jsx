import insights from "./InsightsData/InsightsData";
import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

const InsightsGrid = () => {
           useEffect(() => {
              AOS.init({
                duration: 2000,
                once: false,
                offset: 120,
              });
        
              AOS.refresh();
            }, []);
  return (
    <section className="bg-[#0b0b10] py-24">
      <div className="max-w-7xl mx-auto px-6"
          data-aos="fade-up"
          data-aos-delay="100"
      >

        <h2 className="text-4xl font-bold text-white text-center"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Latest Articles
        </h2>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {insights.map((article) => (
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              key={article.id}
              className="
                rounded-3xl
                border border-white/10
                bg-white/5
                overflow-hidden
                hover:-translate-y-2
                transition-all duration-300
              "
            >
              <div className="h-52 bg-gradient-to-br from-fuchsia-500/10 to-purple-500/20"           data-aos="fade-up" data-aos-delay="100" />

              <div className="p-6"
                    data-aos="fade-up"
                    data-aos-delay="100"
              >

                <span className="text-fuchsia-400 text-sm"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  {article.category}
                </span>

                <h3 className="mt-3 text-2xl font-semibold text-white"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  {article.title}
                </h3>

                <p className="mt-4 text-slate-400"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  {article.description}
                </p>

                <p className="mt-4 text-sm text-slate-500"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  {article.date}
                </p>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default InsightsGrid;
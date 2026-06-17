import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

const Newsletter = () => {
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
      <div className="max-w-4xl mx-auto px-6"
                    data-aos="fade-up"
                    data-aos-delay="100"
      >

        <div
                    data-aos="fade-up"
                    data-aos-delay="100"
          className="
            rounded-3xl
            border border-white/10
            bg-white/5
            p-10
            text-center
          "
        >
          <h2 className="text-4xl font-bold text-white"
                    data-aos="fade-up"
                    data-aos-delay="100"
          >
            Stay Updated
          </h2>

          <p className="mt-4 text-slate-400"
                    data-aos="fade-up"
                    data-aos-delay="100"
          >
            Receive our latest insights on leadership,
            strategy and innovation.
          </p>

          <div className="mt-8 flex flex-col md:flex-row gap-4"
                    data-aos="fade-up"
                    data-aos-delay="100"
          >
            <input
                    data-aos="fade-up"
                    data-aos-delay="100"
              type="email"
              placeholder="Enter your email"
              className="
                flex-1
                px-5 py-4
                rounded-xl
                bg-white/5
                border border-white/10
                text-white
              "
            />

            <button
                    data-aos="fade-up"
                    data-aos-delay="100"
              className="
                px-8 py-4
                bg-fuchsia-600
                rounded-xl
                text-white
                hover:bg-fuchsia-500
                transition
              "
            >
              Subscribe
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Newsletter;
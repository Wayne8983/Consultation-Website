import { Star } from "lucide-react";
import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

const testimonials = [
  {
    name: "John Mwangi",
    role: "CEO, Growth Africa",
    quote:
      "Their strategic guidance helped us streamline operations and achieve measurable growth within months.",
  },
  {
    name: "Sarah Njeri",
    role: "HR Director, Innovate Ltd",
    quote:
      "The leadership development program transformed how our managers lead and collaborate.",
  },
  {
    name: "David Kimani",
    role: "Operations Manager",
    quote:
      "Practical, professional, and results-oriented. Their recommendations delivered immediate value.",
  },
];

const Testimonials = () => {
          useEffect(() => {
            AOS.init({
              duration: 1000,
              once: false,
              offset: 120,
            });
      
            AOS.refresh();
          }, []);
  return (
    <section className="bg-[#0b0b10] py-28 overflow-hidden ">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center max-w-3xl mx-auto">
          <p className="text-fuchsia-400 uppercase tracking-[0.2em] text-sm"
              data-aos="fade-up"
              data-aos-delay="100"
          >
            Testimonials
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white"
              data-aos="fade-up"
              data-aos-delay="120"
          >
            What our clients say
          </h2>

          <p className="mt-6 text-slate-400"
              data-aos="fade-up"
              data-aos-delay="150"
          >
            Organizations trust us because we focus on measurable outcomes and lasting impact.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-16">

          {testimonials.map((testimonial) => (
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              key={testimonial.name}
              className="
                rounded-3xl
                border border-white/10
                bg-white/5
                backdrop-blur-md
                p-8
                hover:border-fuchsia-500/40
                transition-all duration-300
              "
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className="fill-fuchsia-400 text-fuchsia-400"
                  />
                ))}
              </div>

              <p className="mt-6 text-slate-300 leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="mt-6">
                <h4 className="text-white font-semibold">
                  {testimonial.name}
                </h4>

                <p className="text-slate-500 text-sm">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Testimonials;
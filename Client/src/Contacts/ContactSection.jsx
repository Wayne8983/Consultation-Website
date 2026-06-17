import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

const ContactSection = () => {
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
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16">

          {/* Form */}

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="
              rounded-3xl
              bg-white/5
              border border-white/10
              p-8
            "
          >
            <h2 className="text-3xl font-bold text-white"
          data-aos="fade-up"
          data-aos-delay="200"
            >
              Send Us A Message
            </h2>

            <form className="mt-8 space-y-6"
                  data-aos="fade-up"
                  data-aos-delay="100"
            >

              <input
                type="text"
                placeholder="Your Name"
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  rounded-xl
                  px-4 py-4
                  text-white
                  outline-none
                  focus:border-fuchsia-500
                "
              />

              <input
                type="email"
                placeholder="Email Address"
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  rounded-xl
                  px-4 py-4
                  text-white
                  outline-none
                  focus:border-fuchsia-500
                "
              />

              <textarea
                rows="6"
                placeholder="Your Message"
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  rounded-xl
                  px-4 py-4
                  text-white
                  outline-none
                  focus:border-fuchsia-500
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
                Send Message
              </button>

            </form>
          </div>

          {/* Info */}

          <div>

            <h2 className="text-3xl font-bold text-white"
                data-aos="fade-up"
                data-aos-delay="100"
            >
              Get In Touch
            </h2>

            <div className="mt-8 space-y-8"
                data-aos="fade-up"
                data-aos-delay="100"
            >

              <div>
                <h3 className="text-fuchsia-400 font-semibold">
                  Email
                </h3>

                <p className="mt-2 text-slate-400"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  info@strategycenter.co.ke
                </p>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  Phone
                </h3>

                <p className="mt-2 text-slate-400"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  +254 718 500 370
                </p>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  Location
                </h3>

                <p className="mt-2 text-slate-400"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  Nairobi, Kenya
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;


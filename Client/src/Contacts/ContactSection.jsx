const ContactSection = () => {
  return (
    <section className="bg-[#0b0b10] py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16">

          {/* Form */}

          <div
            className="
              rounded-3xl
              bg-white/5
              border border-white/10
              p-8
            "
          >
            <h2 className="text-3xl font-bold text-white">
              Send Us A Message
            </h2>

            <form className="mt-8 space-y-6">

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

            <h2 className="text-3xl font-bold text-white">
              Get In Touch
            </h2>

            <div className="mt-8 space-y-8">

              <div>
                <h3 className="text-fuchsia-400 font-semibold">
                  Email
                </h3>

                <p className="mt-2 text-slate-400">
                  info@strategycenter.co.ke
                </p>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold">
                  Phone
                </h3>

                <p className="mt-2 text-slate-400">
                  +254 718 500 370
                </p>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold">
                  Location
                </h3>

                <p className="mt-2 text-slate-400">
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


const faqs = [
  {
    question: "Do you work with small organizations?",
    answer:
      "Yes. We work with organizations of all sizes across multiple industries.",
  },
  {
    question: "Do you offer training programs?",
    answer:
      "Yes. We provide customized leadership and corporate training programs.",
  },
  {
    question: "Can engagements be virtual?",
    answer:
      "Absolutely. We support both in-person and virtual engagements.",
  },
];

const FAQ = () => {
  return (
    <section className="bg-[#0b0b10] py-24">
      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center">
          <h2 className="text-4xl font-bold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-12 space-y-6">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="
                p-6
                rounded-2xl
                bg-white/5
                border border-white/10
              "
            >
              <h3 className="text-white font-semibold">
                {faq.question}
              </h3>

              <p className="mt-3 text-slate-400">
                {faq.answer}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default FAQ;
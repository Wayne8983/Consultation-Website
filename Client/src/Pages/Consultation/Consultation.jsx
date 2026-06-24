import axios from "axios";
import { useState } from "react";
const BackendURL = import.meta.env.VITE_BackendURL

const Consultation = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("text-green-500");

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  company: "",
  projectType: "",
  description: "",
  preferredContactMethod: ""
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await axios.post(
      `${BackendURL}/api/consultations`,
      formData
    );

    if (response.data.success) {
      setMessage(response.data.message);
      setMessageColor("text-green-500");

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "",
        description: "",
        preferredContactMethod: ""
      });

      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  } catch (err) {

  if (err.response?.data?.errors) {

    const validationErrors = Object.values(
      err.response.data.errors
    );

    setMessage(validationErrors.join(", "));
  } else {

    setMessage(
      err.response?.data?.message ||
      "Something went wrong. Please try again later."
    );
  }

  setMessageColor("text-red-500");

  setTimeout(() => {
    setMessage("");
    setLoading(false);
  }, 5000);

}
};


  return (
    <div className="min-h-screen bg-[#0B1020] text-white">

      {/* Hero Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <span className="px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm">
            Consultation Request
          </span>

          <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-tight">
            Let's Build Your
            <span className="text-purple-400"> Next Project</span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-300">
            Share your project goals, requirements, and timeline.
            Our team will review your request and contact you
            to schedule a consultation.
          </p>
        </div>
      </section>

      {/* Trust Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">

          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">
              Fast Response
            </h3>

            <p className="text-gray-400">
              We review consultation requests within 24–48 hours.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">
              Tailored Solutions
            </h3>

            <p className="text-gray-400">
              Every project receives a customized strategy and implementation plan.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">
              Transparent Pricing
            </h3>

            <p className="text-gray-400">
              Clear project budgets and milestone-based payment structures.
            </p>
          </div>

        </div>
      </section>

      {/* Consultation Form */}
      <section className="max-w-5xl mx-auto px-6 pb-24">

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">

          <h2 className="text-3xl font-bold mb-2">
            Project Consultation Form
          </h2>

          <p className="text-gray-400 mb-10">
            Provide a few details about your project and we'll get back to you shortly.
          </p>

        <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid md:grid-cols-2 gap-6">

            <div>
            <label className=" flex gap-1 block mb-2 text-sm text-gray-300">
                Full Name <p className="text-red-600" >*</p>
            </label>

            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />
            </div>

            <div>
            <label className="flex gap-1 block mb-2 text-sm text-gray-300">
                Email Address <p className="text-red-600" >*</p>
            </label>

            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />
            </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

            <div>
            <label className="flex gap-1 block mb-2 text-sm text-gray-300">
                Phone Number <p className="text-red-600" >*</p>
            </label>

            <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+254..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />
            </div>

            <div>
            <label className="flex gap-1 block mb-2 text-sm text-gray-300">
                Company / Organization <p className="text-red-600" >*</p>
            </label>

            <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your Company"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />
            </div>

        </div>

        <div>
          <label className="flex gap-1 block mb-2 text-sm text-gray-300">
            Project Type
            <p className="text-red-600">*</p>
          </label>

            <input
              type="text"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              placeholder="e.g. E-commerce Website, Mobile App, AI Solution..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />
        </div>

        <div>
            <label className="flex gap-1 block mb-2 text-sm text-gray-300">
            Project Description <p className="text-red-600" >*</p>
            </label>

            <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            placeholder="Tell us about your project goals, requirements, timeline, and any additional information..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none resize-none focus:border-purple-500"
            />
        </div>

        <div>
            <label className="flex gap-1 block mb-4 text-sm text-gray-300">
            Preferred Contact Method <p className="text-red-600" >*</p>
            </label>

            <div className="flex flex-col md:flex-row gap-6">

            <label className="flex items-center gap-3 cursor-pointer">
                <input
                type="radio"
                name="preferredContactMethod"
                value="email"
                checked={formData.preferredContactMethod === "email"}
                onChange={handleChange}
                />
                <span>Email</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
                <input
                type="radio"
                name="preferredContactMethod"
                value="phone"
                checked={formData.preferredContactMethod === "phone"}
                onChange={handleChange}
                />
                <span>Phone Call</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
                <input
                type="radio"
                name="preferredContactMethod"
                value="whatsapp"
                checked={formData.preferredContactMethod === "whatsapp"}
                onChange={handleChange}
                />
                <span>WhatsApp</span>
            </label>

            </div>
        </div>
        {message && (
          <p className={`text-center font-medium ${messageColor}`}>
            {message}
          </p>
        )}
        <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 transition-all duration-300 font-semibold cursor-pointer"
        >
            {loading ? "Submitting..." : "Request Consultation"} 
        </button>

        </form>

        </div>

      </section>

    </div>
  );
};

export default Consultation;
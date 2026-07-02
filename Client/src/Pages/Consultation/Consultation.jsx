import { useState } from "react";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiSend,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
} from "react-icons/fi";
import api from "../../Service/axios";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  projectType: "",
  description: "",
  preferredContactMethod: "",
};

const Consultation = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getErrorMessage = (err) => {
    if (err.response?.data?.errors) {
      return Object.values(err.response.data.errors).join(", ");
    }

    if (err.response?.data?.message) {
      return err.response.data.message;
    }

    if (err.code === "ERR_NETWORK") {
      return "Cannot connect to the server. Please try again later.";
    }

    return "Something went wrong. Please try again later.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    try {
      setLoading(true);

      const response = await api.post("/api/consultations", formData);

      if (response.data.success) {
        setMessage(response.data.message || "Consultation request sent successfully.");
        setMessageType("success");
        setFormData(initialFormData);
      }
    } catch (err) {
      console.log(err);
      setMessage(getErrorMessage(err));
      setMessageType("error");
    } finally {
      setLoading(false);
      setTimeout(()=>{
        setMessage("");
      },[4000])
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      <section className="relative overflow-hidden py-24">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[150px]" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="inline-flex px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm">
            Consultation Request
          </span>

          <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-tight">
            Let's Build Your
            <span className="text-purple-400"> Next Project</span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-300">
            Share your project goals, requirements, and timeline. Our team will review your request and contact you shortly.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <InfoCard
            title="Fast Response"
            text="We review consultation requests within 24 to 48 hours."
          />

          <InfoCard
            title="Tailored Solutions"
            text="Every project receives a customized strategy and implementation plan."
          />

          <InfoCard
            title="Transparent Process"
            text="Clear project scope, milestones, timelines, and next steps."
          />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-2">
            Project Consultation Form
          </h2>

          <p className="text-gray-400 mb-10">
            Provide a few details about your project and we will get back to you shortly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                icon={<FiUser />}
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="First name Second name"
                required
              />

              <Input
                icon={<FiMail />}
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                icon={<FiPhone />}
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+254700000000"
                required
              />

              <Input
                icon={<FiBriefcase />}
                label="Company / Organization"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company name"
              />
            </div>

            <div>
              <label className="flex gap-1 mb-2 text-sm text-gray-300">
                Project Type
                <span className="text-red-500">*</span>
              </label>

              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                required
              >
                <option value="">Select project type</option>
                <option value="Strategy Consulting">Strategy Consulting</option>
                <option value="Leadership Development">Leadership Development</option>
                <option value="Performance Management">Performance Management</option>
                <option value="Training and Capacity Building">Training and Capacity Building</option>
                <option value="Business Advisory">Business Advisory</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="flex gap-1 mb-2 text-sm text-gray-300">
                Project Description
                <span className="text-red-500">*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                maxLength="1000"
                placeholder="Tell us about your project goals, requirements, timeline, and any additional information..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none resize-none focus:border-purple-500"
                required
              />

              <p className="text-xs text-gray-500 mt-2">
                {formData.description.length}/1000 characters
              </p>
            </div>

            <div>
              <label className="flex gap-1 mb-4 text-sm text-gray-300">
                Preferred Contact Method
                <span className="text-red-500">*</span>
              </label>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <RadioOption
                  label="Email"
                  value="email"
                  checked={formData.preferredContactMethod === "email"}
                  onChange={handleChange}
                />

                <RadioOption
                  label="Phone Call"
                  value="phone"
                  checked={formData.preferredContactMethod === "phone"}
                  onChange={handleChange}
                />

                <RadioOption
                  label="WhatsApp"
                  value="whatsapp"
                  checked={formData.preferredContactMethod === "whatsapp"}
                  onChange={handleChange}
                />

                <RadioOption
                  label="Any"
                  value="any"
                  checked={formData.preferredContactMethod === "any"}
                  onChange={handleChange}
                />
              </div>
            </div>

            {message && (
              <div
                className={`rounded-2xl border px-4 py-4 flex items-start gap-3 ${
                  messageType === "success"
                    ? "border-green-500/20 bg-green-500/10 text-green-300"
                    : "border-red-500/20 bg-red-500/10 text-red-300"
                }`}
              >
                {messageType === "success" ? (
                  <FiCheckCircle className="mt-1 shrink-0" />
                ) : (
                  <FiAlertTriangle className="mt-1 shrink-0" />
                )}

                <p className="text-sm font-medium">
                  {message}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 transition-all duration-300 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiSend />
              {loading ? "Submitting..." : "Request Consultation"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

const InfoCard = ({ title, text }) => {
  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-2">
        {title}
      </h3>

      <p className="text-gray-400">
        {text}
      </p>
    </div>
  );
};

const Input = ({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => {
  return (
    <div>
      <label className="flex gap-1 mb-2 text-sm text-gray-300">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
          {icon}
        </span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-purple-500"
          required={required}
        />
      </div>
    </div>
  );
};

const RadioOption = ({ label, value, checked, onChange }) => {
  return (
    <label
      className={`cursor-pointer rounded-xl border px-4 py-3 transition-all ${
        checked
          ? "border-purple-500/50 bg-purple-500/15 text-white"
          : "border-white/10 bg-white/5 text-gray-300 hover:border-purple-500/30"
      }`}
    >
      <input
        type="radio"
        name="preferredContactMethod"
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      <span>{label}</span>
    </label>
  );
};

export default Consultation;
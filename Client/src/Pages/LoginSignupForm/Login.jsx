import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import LoginPic from '../../assets/LoginPic.png'
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusField, setFocusField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const isActive = (value, field) => {
    return focusField === field || value.length > 0;
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  // Basic validation
  if (!email.trim() || !password.trim()) {
    setError("Email and password are required");
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post(
      "http://localhost:3000/users/login",
      {
        email,
        password
      }
    );

    const data = response.data;

    // Save authentication data
    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", data.userType);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Redirect based on role
    if (data.userType === "admin") {
      navigate("/admin/dashboard");
    } else if (data.userType === "client") {
      navigate("/client/dashboard");
    }

  } catch (err) {
    console.error(err);

    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError("Something went wrong.Please try again");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black from-[#070B14] via-[#0B1020] to-[#0F172A] px-4">

      {/* BIGGER CARD */}
      <div className="w-[92vw] h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">

        <div className="h-full grid grid-cols-1 md:grid-cols-12">

          {/* LEFT IMAGE (8/12 - BIGGER) */}
      <div className="hidden md:block md:col-span-8 relative h-full overflow-hidden">

        {/* Background Image */}
          <img
            src={LoginPic}
            alt="Login Visual"
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />

        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60 flex flex-col items-center justify-center text-center p-12 text-white"
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.0 }}
        >
            <h2 className="text-5xl font-bold text-shadow-2xs text-shadow-black">
              Welcome Back
            </h2>

            <p className="text-white mt-3 max-w-md text-lg text-shadow-2xs text-shadow-black">
              Manage your dashboard, track your projects and workflow seamlessly.
            </p>
        </motion.div>

      </div>

          {/* RIGHT FORM (4/12) */}
          <div className="col-span-1 md:col-span-4 flex items-center justify-center p-8">

            <div className="w-full max-w-md">

              <h1 className="text-4xl font-bold text-white mb-2">
                Login
              </h1>
              <p className="text-gray-400 mb-10 text-sm">
                Enter your credentials to continue
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">

                {/* EMAIL */}
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusField("email")}
                    onBlur={() => setFocusField(null)}
                    className="w-full px-4 pt-6 pb-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500 transition"
                  />

                  <label
                    className={`
                      absolute left-4 text-gray-400 pointer-events-none transition-all duration-300 ease-out

                      ${isActive(email, "email")
                        ? "top-2 text-xs text-purple-400"
                        : "top-1/2 -translate-y-1/2 text-base text-gray-500"
                      }
                    `}
                  >
                    Email address
                  </label>
                </div>

                {/* PASSWORD */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusField("password")}
                    onBlur={() => setFocusField(null)}
                    className="w-full px-4 pt-6 pb-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500 transition"
                  />

                  <label
                    className={`
                      absolute left-4 text-gray-400 pointer-events-none transition-all duration-300 ease-out

                      ${isActive(password, "password")
                        ? "top-2 text-xs text-purple-400"
                        : "top-1/2 -translate-y-1/2 text-base text-gray-500"
                      }
                    `}
                  >
                    Password
                  </label>

                  {/* toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-sm">
                    {error}
                  </p>
                )}

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:opacity-90 active:scale-95 transition"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
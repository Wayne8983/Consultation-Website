import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AuthPopup from "../../Components/Feedback/AuthPopup";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginPic from "../../assets/LoginPic.png";
import CompanyLogo from '../../assets/companyLogo.png'
import { getToken, getUserType, logout } from "../../Utils/auth";

const BackendURL = import.meta.env.VITE_BackendURL;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 128;

const getDashboardPath = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "client") return "/client/dashboard";
  return null;
};

const decodeJwtPayload = (token) => {
  const [, payload] = token.split(".");
  if (!payload) return null;

  const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
  const paddedPayload = normalizedPayload.padEnd(
    normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
    "="
  );

  return JSON.parse(atob(paddedPayload));
};

const tokenHasExpired = (token) => {
  try {
    const decoded = decodeJwtPayload(token);
    if (!decoded) return true;

    return decoded.exp ? decoded.exp * 1000 <= Date.now() : false;
  } catch {
    return true;
  }
};

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusField, setFocusField] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const navigate = useNavigate();
  const location = useLocation();

  const [popupMessage, setPopupMessage] = useState(
    location.state?.message || ""
  );

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const canSubmit =
    EMAIL_PATTERN.test(normalizedEmail) && password.length >= 8 && !loading;

  const isFloating = (field, value) => {
    return focusField === field || value.length > 0;
  };

  useEffect(() => {
    if (!popupMessage) return;

    const timer = setTimeout(() => {
      setPopupMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [popupMessage]);

  useEffect(() => {
    const token = getToken();
    const userType = getUserType();
    const dashboardPath = getDashboardPath(userType);

    if (!token) return;

    if (tokenHasExpired(token) || !dashboardPath) {
      logout();
      return;
    }

    navigate(dashboardPath, { replace: true });
  }, [navigate]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value.slice(0, MAX_EMAIL_LENGTH));
    if (error) setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.slice(0, MAX_PASSWORD_LENGTH));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${BackendURL}/users/login`,
        {
          email: normalizedEmail,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
            withCredentials: true,
            timeout: 15000,
        }
      );

      const data = response.data;
      const dashboardPath = getDashboardPath(data.userType);

      if (!data?.token || !dashboardPath) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", data.userType);
      localStorage.setItem("user", JSON.stringify(data.user || {}));

      setPopupMessage("Login successful. Redirecting...");

      setTimeout(() => {
        navigate(dashboardPath, { replace: true });
      }, 900);
    }catch (err) {
  if (err.response?.status === 403) {
    setError(
      err.response?.data?.message ||
        "Your account has been suspended. Please contact the organization for more information."
    );
    return;
  }

  if (err.response?.status === 401) {
    setError("Invalid credentials!!!");
    return;
  }

  setError(
    err.response?.data?.message ||
      "Something went wrong while signing in. Please try again."
  );
} finally {
  setLoading(false);
}
  };

  return (
    <main className="min-h-screen bg-[#050507] text-white">
      <AuthPopup
        message={popupMessage}
        onClose={() => setPopupMessage("")}
      />
      <section className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src={LoginPic}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/45 to-[#0b0b10]/95" />

          <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
            <a href="/" className="inline-flex w-fit items-center gap-3">
              <span className="flex h-25 w-25 items-center justify-center rounded-xl border border-fuchsia-400/25 bg-white/10 backdrop-blur-md">
                <img src={CompanyLogo} alt=""className="h-23 w-23 text-fuchsia-300" />
              </span>

              <span className="text-lg font-semibold tracking-wide">
                Strategy Center
              </span>
            </a>

            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-fuchsia-300">
                Welcome Back
              </p>

              <h1 className="mt-5 text-5xl font-bold leading-tight xl:text-7xl">
                Sign in and continue your work
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
                Access your workspace and pick up right where you left off.
              </p>
            </div>

            <p className="max-w-lg text-sm leading-6 text-slate-300">
              Strategy, execution, and progress in one focused workspace.
            </p>
          </div>
        </div>

        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
          <div className="absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-fuchsia-600/15 blur-[140px]" />
          <div className="absolute -bottom-40 left-10 h-[360px] w-[360px] rounded-full bg-blue-600/10 blur-[140px]" />

          <div className="relative w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <a href="/" className="inline-flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-fuchsia-400/25 bg-white/10">
                  <BriefcaseBusiness className="h-5 w-5 text-fuchsia-300" />
                </span>

                <span className="text-lg font-semibold tracking-wide">
                  Strategy Center
                </span>
              </a>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-9">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-300">
                  Login
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Welcome back
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Enter your credentials to continue.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-9 space-y-6">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fuchsia-300" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={() => setFocusField("email")}
                    onBlur={() => setFocusField("")}
                    autoComplete="email"
                    inputMode="email"
                    maxLength={MAX_EMAIL_LENGTH}
                    required
                    className="peer h-16 w-full rounded-2xl border border-white/10 bg-black/30 px-12 pt-5 text-white outline-none transition duration-300 placeholder:text-transparent focus:border-fuchsia-400/70 focus:bg-black/40"
                    placeholder="Email address"
                  />

                  <label
                    htmlFor="email"
                    className={`pointer-events-none absolute left-12 text-slate-500 transition-all duration-500 ease-out ${
                      isFloating("email", email)
                        ? "top-2 text-xs text-fuchsia-300"
                        : "top-1/2 -translate-y-1/2 text-base"
                    }`}
                  >
                    Email address
                  </label>
                </div>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fuchsia-300" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setFocusField("password")}
                    onBlur={() => setFocusField("")}
                    autoComplete="current-password"
                    maxLength={MAX_PASSWORD_LENGTH}
                    required
                    className="peer h-16 w-full rounded-2xl border border-white/10 bg-black/30 px-12 pt-5 pr-14 text-white outline-none transition duration-300 placeholder:text-transparent focus:border-fuchsia-400/70 focus:bg-black/40"
                    placeholder="Password"
                  />

                  <label
                    htmlFor="password"
                    className={`pointer-events-none absolute left-12 text-slate-500 transition-all duration-500 ease-out ${
                      isFloating("password", password)
                        ? "top-2 text-xs text-fuchsia-300"
                        : "top-1/2 -translate-y-1/2 text-base"
                    }`}
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-fuchsia-500 font-semibold text-white transition duration-300 hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500"
                >
                  {loading ? "Signing in..." : "Sign in"}

                  {!loading && (
                    <ArrowRight className="h-5 w-5 transition duration-300 group-hover:translate-x-0.5" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
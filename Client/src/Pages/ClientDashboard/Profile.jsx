import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiBriefcase,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiShield,
  FiUser,
  FiX,
} from "react-icons/fi";
import api from "../../Service/axios";
import { DashboardSkeleton } from "../Skeleton/Skeleton";

const emptyPasswordForm = {
  oldPassword: "",
  newPassword: "",
};

const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.status === 401) return "You are not logged in or your session expired.";
  if (err.response?.status === 403) return "This account is not allowed to view this profile.";
  if (err.code === "ERR_NETWORK") return "Cannot connect to the backend. Make sure the server is running on port 3000.";
  return "Something went wrong while loading your profile.";
};

const formatDate = (dateValue) => {
  if (!dateValue) return "Not available";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/client/profile")
      .then((res) => {
        if (cancelled) return;

        setProfile(res.data?.user || null);
      })
      .catch((err) => {
        if (cancelled) return;

        console.log(err);
        setProfile(null);
        setPageError(getErrorMessage(err));
      })
      .finally(() => {
        if (cancelled) return;

        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm(emptyPasswordForm);
    setShowOldPassword(false);
    setShowNewPassword(false);
    setFormError("");
    setFormSuccess("");
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!profile?._id) {
      setFormError("Profile could not be loaded. Please refresh and try again.");
      return;
    }

    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      setFormError("Please fill in both password fields.");
      return;
    }

    try {
      setActionLoading(true);

      await api.patch(`/client/changePassword/${profile._id}`, passwordForm);

      setPasswordForm(emptyPasswordForm);
      setFormSuccess("Password updated successfully.");
    } catch (err) {
      console.log(err);
      setFormError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  const initial = profile?.name?.trim()?.charAt(0)?.toUpperCase() || "C";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-red-900/20 bg-black/40 backdrop-blur-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,.08)]">
        <div className="absolute -top-28 -right-20 h-72 w-72 rounded-full bg-red-700/10 blur-[100px]" />

        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="h-24 w-24 rounded-[28px] bg-red-600/15 border border-red-500/25 flex items-center justify-center text-red-300 text-4xl font-bold shadow-[0_0_18px_rgba(239,68,68,.12)]">
            {initial}
          </div>

          <div>
            <p className="text-red-400 text-xs uppercase tracking-[0.35em] mb-3">
              Client Profile
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-white capitalize">
              {profile?.name || "Client Account"}
            </h1>

            <p className="text-gray-400 mt-3">
              Manage your account information and security settings.
            </p>

            <span
              className={`inline-flex mt-4 px-3 py-1 rounded-full text-xs ${
                profile?.status === "Active"
                  ? "bg-green-500/15 text-green-400"
                  : profile?.status === "Suspended"
                  ? "bg-red-500/15 text-red-400"
                  : "bg-yellow-500/15 text-yellow-400"
              }`}
            >
              {profile?.status || "Client"}
            </span>
          </div>
        </div>
      </section>

      {pageError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 flex gap-3 text-red-200">
          <FiAlertTriangle className="mt-1 shrink-0" />

          <div>
            <p className="font-medium">
              Could not load profile
            </p>

            <p className="text-sm text-red-200/80 mt-1">
              {pageError}
            </p>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Account Information
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your personal and organization details
              </p>
            </div>

            <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <FiUser />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <ReadOnlyField
              label="Full Name"
              value={profile?.name || "Not available"}
              icon={<FiUser />}
            />

            <ReadOnlyField
              label="Email Address"
              value={profile?.email || "Not available"}
              icon={<FiMail />}
            />

            <ReadOnlyField
              label="Phone Number"
              value={profile?.phone || "Not available"}
              icon={<FiPhone />}
            />

            <ReadOnlyField
              label="Company"
              value={profile?.company || "Not available"}
              icon={<FiBriefcase />}
            />

            <ReadOnlyField
              label="Account Created"
              value={formatDate(profile?.createdAt)}
              icon={<FiCheckCircle />}
            />

            <ReadOnlyField
              label="Last Login"
              value={formatDate(profile?.lastLogin)}
              icon={<FiShield />}
            />
          </div>
        </div>

        <div className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Security
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Password and account protection
              </p>
            </div>

            <FiLock className="text-red-400" />
          </div>

          <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-5">
            <p className="text-white font-medium">
              Password
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Use a strong password with uppercase, lowercase, number and special character.
            </p>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="mt-5 w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 transition"
            >
              Change Password
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Notifications
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Local preference until notification backend is added
            </p>
          </div>

          <FiShield className="text-red-400" />
        </div>

        <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-white font-medium">
              Email Notifications
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Receive updates about milestones, meetings and project activity.
            </p>
          </div>

          <button
            onClick={() =>
              setEmailNotifications((current) => !current)
            }
            className={`relative h-8 w-16 rounded-full transition-all ${
              emailNotifications ? "bg-red-600" : "bg-gray-700"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-all ${
                emailNotifications ? "right-1" : "left-1"
              }`}
            />
          </button>
        </div>
      </section>

      {showPasswordModal && (
        <Modal title="Change Password" onClose={closePasswordModal}>
          <form onSubmit={changePassword} className="space-y-4">
            <PasswordField
              label="Old Password"
              value={passwordForm.oldPassword}
              visible={showOldPassword}
              onToggle={() =>
                setShowOldPassword((current) => !current)
              }
              onChange={(value) =>
                setPasswordForm({
                  ...passwordForm,
                  oldPassword: value,
                })
              }
            />

            <PasswordField
              label="New Password"
              value={passwordForm.newPassword}
              visible={showNewPassword}
              onToggle={() =>
                setShowNewPassword((current) => !current)
              }
              onChange={(value) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: value,
                })
              }
            />

            {formError && (
              <p className="rounded-xl border border-red-500/20 bg-red-600/10 px-4 py-3 text-sm text-red-300">
                {formError}
              </p>
            )}

            {formSuccess && (
              <p className="rounded-xl border border-green-500/20 bg-green-600/10 px-4 py-3 text-sm text-green-300">
                {formSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {actionLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

const ReadOnlyField = ({ label, value, icon }) => {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm text-gray-400">
        <span className="text-red-400">
          {icon}
        </span>
        {label}
      </span>

      <input
        type="text"
        value={value}
        readOnly
        className="w-full mt-2 rounded-xl bg-white/[0.04] border border-red-900/20 px-4 py-3 text-white outline-none"
      />
    </label>
  );
};

const PasswordField = ({
  label,
  value,
  visible,
  onToggle,
  onChange,
}) => {
  return (
    <label className="block">
      <span className="text-sm text-gray-400">
        {label}
      </span>

      <div className="relative mt-2">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 pr-12 text-white outline-none focus:border-red-500/40"
          required
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {visible ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </label>
  );
};

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-red-900/20 bg-[#080808] p-6 shadow-[0_0_45px_rgba(220,38,38,.16)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600/10"
          >
            <FiX />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Profile;
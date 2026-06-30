import { useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiSave,
  FiShield,
} from "react-icons/fi";
import api from "../../Service/axios";

const emptyPasswordForm = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const AdminSettings = () => {

  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const updatePasswordField = (field, value) => {
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (formError) setFormError("");
    if (successMessage) setSuccessMessage("");
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setFormError("Please fill in all password fields.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setFormError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.patch("/admin/change-password", passwordForm);

      setSuccessMessage(res.data?.message || "Password updated successfully.");
      setPasswordForm(emptyPasswordForm);
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to update password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-red-900/20 bg-black/40 p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,.08)]">
        <div>
          <p className="text-red-400 text-xs uppercase tracking-[0.35em]">
            Admin Controls
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">
            Settings
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl">
            Manage account security and notification preferences.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-[28px] border border-red-900/20 bg-black/35 p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <FiLock />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Change Password
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Use a strong password to protect the admin workspace.
              </p>
            </div>
          </div>

          <form onSubmit={changePassword} className="space-y-4">
            <PasswordInput
              label="Old Password"
              value={passwordForm.oldPassword}
              visible={showPasswords}
              onChange={(value) => updatePasswordField("oldPassword", value)}
            />

            <PasswordInput
              label="New Password"
              value={passwordForm.newPassword}
              visible={showPasswords}
              onChange={(value) => updatePasswordField("newPassword", value)}
            />

            <PasswordInput
              label="Confirm New Password"
              value={passwordForm.confirmPassword}
              visible={showPasswords}
              onChange={(value) =>
                updatePasswordField("confirmPassword", value)
              }
            />
            <div className="flex gap-4" >
                <button
                type="button"
                onClick={() => setShowPasswords((value) => !value)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
              >
                {showPasswords ? <FiEyeOff /> : <FiEye />}
                {showPasswords ? "Hide Passwords" : "Show Passwords"}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                <FiSave />
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>

              {formError && (
                <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-4 flex gap-3 text-red-200">
                  <FiAlertTriangle className="mt-0.5 shrink-0" />
                  <p className="text-sm">{formError}</p>
                </div>
              )}

              {successMessage && (
                <div className="rounded-2xl border border-green-500/20 bg-green-600/10 p-4 flex gap-3 text-green-200">
                  <FiCheckCircle className="mt-0.5 shrink-0" />
                  <p className="text-sm">{successMessage}</p>
                </div>
              )}
            
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-red-900/20 bg-black/35 p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <FiShield />
              </div>

              <div>
                <h2 className="text-white font-semibold">
                  Security Rules
                </h2>

                <p className="text-sm text-gray-500">
                  Password requirements
                </p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-gray-400">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character</li>
              <li>Must be different from old password</li>
            </ul>
          </div>

 
        </div>
      </section>
    </div>
  );
};

const PasswordInput = ({ label, value, visible, onChange }) => {
  return (
    <label className="block">
      <span className="text-sm text-gray-400">
        {label}
      </span>

      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-red-900/20 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-red-500/40"
        required
      />
    </label>
  );
};

export default AdminSettings;
import { useState } from "react";

const AdminSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-white">
        Settings
      </h1>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

        <div className="flex items-center justify-between">

          <div>
            <h3 className="text-white font-medium">
              Email Notifications
            </h3>

            <p className="text-slate-400 text-sm">
              Receive updates by email.
            </p>
          </div>

          <button
            onClick={() =>
              setEmailNotifications(!emailNotifications)
            }
            className={`
              w-14 h-8 rounded-full transition relative
              ${
                emailNotifications
                  ? "bg-cyan-600"
                  : "bg-slate-600"
              }
            `}
          >
            <div
              className={`
                absolute top-1
                h-6 w-6 rounded-full bg-white
                transition-all
                ${
                  emailNotifications
                    ? "left-7"
                    : "left-1"
                }
              `}
            />
          </button>

        </div>

      </div>

    </div>
  );
};

export default AdminSettings;
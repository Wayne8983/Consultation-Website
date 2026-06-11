import { useState } from "react";

const Profile = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
  return (
    <div className="space-y-8">

      {/* Profile Banner */}
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-gradient-to-br
          from-violet-600/20
          via-[#111827]
          to-[#0B1020]
          p-8
        "
      >
        <div
          className="
            absolute
            top-0
            right-0
            h-56
            w-56
            rounded-full
            bg-violet-500/20
            blur-3xl
          "
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">

          <div
            className="
              h-28 w-28
              rounded-full
              bg-gradient-to-br
              from-violet-500
              to-purple-700
              flex
              items-center
              justify-center
              text-4xl
              font-bold
              text-white
            "
          >
            W
          </div>

          <div>

            <h1 className="text-3xl font-bold text-white">
              Wayne
            </h1>

            <p className="text-slate-400 mt-2">
              Client Account
            </p>

            <span
              className="
                inline-block
                mt-3
                px-3 py-1
                rounded-full
                bg-green-500/15
                text-green-400
                text-sm
              "
            >
              Active Client
            </span>

          </div>

        </div>
      </div>

      {/* Account Information */}
      <div
        className="
          rounded-3xl
          border border-white/10
          bg-white/[0.03]
          backdrop-blur-xl
          p-6
        "
      >
        <h2 className="text-lg font-semibold text-white mb-6">
          Account Information
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="text-sm text-slate-400">
              Full Name
            </label>

            <input
              type="text"
              value="Wayne"
              readOnly
              className="
                w-full mt-2
                rounded-xl
                bg-white/5
                border border-white/10
                px-4 py-3
                text-white
                outline-none
              "
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Email Address
            </label>

            <input
              type="email"
              value="wayne@example.com"
              readOnly
              className="
                w-full mt-2
                rounded-xl
                bg-white/5
                border border-white/10
                px-4 py-3
                text-white
                outline-none
              "
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Company
            </label>

            <input
              type="text"
              value="Client Company"
              readOnly
              className="
                w-full mt-2
                rounded-xl
                bg-white/5
                border border-white/10
                px-4 py-3
                text-white
                outline-none
              "
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Phone Number
            </label>

            <input
              type="text"
              value="+254 700 000 000"
              readOnly
              className="
                w-full mt-2
                rounded-xl
                bg-white/5
                border border-white/10
                px-4 py-3
                text-white
                outline-none
              "
            />
          </div>

        </div>
      </div>

      {/* Security */}
      <div
        className="
          rounded-3xl
          border border-white/10
          bg-white/[0.03]
          backdrop-blur-xl
          p-6
        "
      >
        <h2 className="text-lg font-semibold text-white mb-6">
          Security
        </h2>

        <div className="space-y-4">

          <div
            className="
              p-5
              rounded-2xl
              bg-white/5
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h3 className="text-white font-medium">
                Password
              </h3>

              <p className="text-slate-500 text-sm mt-1">
                Last updated 30 days ago
              </p>
            </div>

            <button
              className="
                px-4 py-2
                rounded-xl
                bg-violet-500/15
                text-violet-400
                hover:bg-violet-500/25
                transition
                cursor-pointer
              "
            >
              Change Password
            </button>

          </div>

        </div>
      </div>

      {/* Notifications */}
      <div
        className="
          rounded-3xl
          border border-white/10
          bg-white/[0.03]
          backdrop-blur-xl
          p-6
        "
      >
        <h2 className="text-lg font-semibold text-white mb-6">
          Notifications
        </h2>

        <div className="space-y-4">

          <div
            className="
              p-5
              rounded-2xl
              bg-white/5
              flex
              justify-between
              items-center
            "
          >
            <div>
              <p className="text-white">
                Email Notifications
              </p>

              <p className="text-slate-500 text-sm mt-1">
                Receive updates about your project.
              </p>
            </div>

            <div
            className="
                p-5
                rounded-2xl
                bg-white/5
                border border-white/5
                hover:border-purple-500/20
                transition-all
                duration-300
                flex
                justify-between
                items-center
            "
            >
            <div>
                <p className="text-white font-medium">
                Email Notifications
                </p>

                <p className="text-slate-400 text-sm mt-1">
                Receive updates about milestones,
                meetings and project activity.
                </p>
            </div>

  {/* Toggle */}
        <button
        onClick={() =>
            setEmailNotifications(!emailNotifications)
        }
        className={`
            relative
            w-20
            h-7
            rounded-full
            transition-all
            duration-300
            flex
            items-center
            ${
            emailNotifications
                ? "bg-gradient-to-r from-purple-500 to-violet-600"
                : "bg-slate-700"
            }
        `}
        >
        <span
            className={`
            absolute
            h-6
            w-6
            rounded-full
            bg-white
            shadow-md
            transition-all
            duration-300
            ${
                emailNotifications
                ? "right-1"
                : "left-1"
            }
            `}
        />
        </button>
        </div>
        </div>

        </div>
        </div>

        </div>
  );
};

export default Profile;
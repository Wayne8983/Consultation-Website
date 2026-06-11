import { useState, useEffect, useRef } from "react";
import {
  FiBell,
  FiMenu,
  FiSearch,
} from "react-icons/fi";

const Topbar = ({ setMobileOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  //------------------This is to disappear the notifications bar on clicks-------------------
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

  return (
      <header
      className="
        relative
        z-50
        h-20
        border-b border-white/5
        bg-[#0B1020]/80
        backdrop-blur-xl
        px-4 md:px-8
        flex
        items-center
        justify-between
      "
      >
      {/* Left */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu */}
        <button
          onClick={() => setMobileOpen(true)}
          className="
            md:hidden
            w-10 h-10
            rounded-xl
            bg-white/5
            border border-white/10
            flex
            items-center
            justify-center
            text-white
          "
        >
          <FiMenu size={20} />
        </button>

        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-white">
            Dashboard
          </h1>

          <p className="hidden sm:block text-sm text-gray-400">
            Welcome back. Track your project here.
          </p>
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div
          className="
            hidden lg:flex
            items-center
            gap-2
            w-72
            px-4 py-2.5
            rounded-xl
            bg-white/5
            border border-white/5
          "
        >
          <FiSearch className="text-gray-500" />

          <input
            type="text"
            placeholder="Search..."
            className="
              w-full
              bg-transparent
              outline-none
              text-sm
              text-white
              placeholder:text-gray-500
            "
          />
        </div>

        {/* Notifications */}
        <div className="relative  ">

          <button
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
            ref={notificationRef}
            className="
              relative
              w-11 h-11
              rounded-xl
              bg-white/5
              border border-white/5
              hover:bg-white/10
              transition
              flex
              items-center
              justify-center
              text-white
              cursor-pointer
            "
          >
            <FiBell size={18} />

            <span
              className="
                absolute
                top-2
                right-2
                h-2
                w-2
                rounded-full
                bg-purple-500
              "
            />
          </button>

          {showNotifications && (
            <div
              className="
                absolute
                right-0
                mt-3
                w-80
                rounded-2xl
                border border-white/10
                bg-[#111827]
                shadow-2xl
                overflow-hidden
                z-[9999]
              "
            >
              <div className="p-4 border-b border-white/10 ">
                <h3 className="text-white font-semibold">
                  Notifications
                </h3>
              </div>

              <div className="p-4 space-y-3">

                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-white text-sm">
                    Milestone Completed
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    UI Design Phase has been completed.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-white text-sm">
                    Meeting Scheduled
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Consultation tomorrow at 2:00 PM.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-white text-sm">
                    Document Uploaded
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    New contract is available.
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Profile */}
        <div
          className="
            flex items-center gap-3
            px-3 py-2
            rounded-xl
            bg-white/5
            border border-white/5
          "
        >
          <div
            className="
              w-10 h-10
              rounded-full
              bg-gradient-to-br
              from-purple-500
              to-violet-700
              flex items-center justify-center
              text-white font-bold
            "
          >
            W
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">
              Client
            </p>

            <p className="text-xs text-gray-400">
              Active Project
            </p>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Topbar;
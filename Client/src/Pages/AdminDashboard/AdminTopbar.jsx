import { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiBell,
  FiSearch,
} from "react-icons/fi";

const AdminTopbar = ({ setMobileOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
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
            Admin Dashboard
          </h1>

          <p className="hidden sm:block text-sm text-gray-400">
            Manage clients, projects and consultations.
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
            placeholder="Search clients..."
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
        <div
          ref={notificationRef}
          className="relative"
        >
          <button
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
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
                bg-cyan-500
              "
            />
          </button>

          {showNotifications && (
            <div
              className="
                absolute
                right-0
                top-full
                mt-3
                w-80
                rounded-2xl
                border border-white/10
                bg-[#111827]
                shadow-2xl
                overflow-hidden
                z-[999]
              "
            >
              <div className="p-4 border-b border-white/5">
                <h3 className="font-semibold text-white">
                  Notifications
                </h3>
              </div>

              <div className="p-4 space-y-3 text-sm">
                <p className="text-slate-300">
                  New consultation request
                </p>

                <p className="text-slate-300">
                  Client uploaded documents
                </p>

                <p className="text-slate-300">
                  Payment received
                </p>
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
              from-cyan-500
              to-blue-700
              flex
              items-center
              justify-center
              text-white
              font-bold
            "
          >
            A
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">
              Admin
            </p>

            <p className="text-xs text-gray-400">
              System Manager
            </p>
          </div>
        </div>

      </div>
    </header>
  );
};

export default AdminTopbar;
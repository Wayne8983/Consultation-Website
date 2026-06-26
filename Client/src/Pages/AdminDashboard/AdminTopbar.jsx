import { useEffect, useRef, useState } from "react";
import {
  FiBell,
  FiMenu,
  FiSearch,
  FiUser,
  FiChevronDown,
  FiClipboard,
  FiFileText,
  FiCalendar,
} from "react-icons/fi";
import { getUser } from "../../Utils/auth";

const notifications = [
  {
    title: "New consultation request",
    description: "A client submitted a new consultation form.",
    time: "Just now",
    icon: <FiClipboard />,
  },
  {
    title: "Client document uploaded",
    description: "A new file was added to a client workspace.",
    time: "15 min ago",
    icon: <FiFileText />,
  },
  {
    title: "Meeting scheduled",
    description: "A project meeting has been added to the calendar.",
    time: "1 hr ago",
    icon: <FiCalendar />,
  },
];

const AdminTopbar = ({ setMobileOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [admin] = useState(() => getUser());
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayName = admin?.name || "Admin";
  const displayEmail = admin?.email || "System Manager";

  return (
    <header
      className="
        relative
        z-50
        h-20
        border-b border-red-900/20
        bg-black/40
        backdrop-blur-2xl
        px-4 md:px-8
        flex
        items-center
        justify-between
        shadow-[0_10px_35px_rgba(220,38,38,.04)]
      "
    >
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="
            md:hidden
            h-11
            w-11
            shrink-0
            rounded-2xl
            bg-white/5
            border border-red-500/20
            flex
            items-center
            justify-center
            text-white
            hover:bg-red-600/10
            transition-all
          "
        >
          <FiMenu size={20} />
        </button>

        <div className="min-w-0">
          <p className="text-red-400 text-[11px] uppercase tracking-[0.3em]">
            Control Center
          </p>

          <h1 className="text-xl md:text-2xl font-semibold text-white truncate">
            Admin Dashboard
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="
            hidden lg:flex
            items-center
            gap-3
            w-80
            px-4
            py-3
            rounded-2xl
            bg-white/[0.04]
            border border-red-900/20
            focus-within:border-red-500/30
            focus-within:bg-red-600/[0.04]
            transition-all
          "
        >
          <FiSearch className="text-red-400" />

          <input
            type="text"
            placeholder="Search clients, projects..."
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

        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setShowNotifications((current) => !current)}
            className="
              relative
              h-11
              w-11
              rounded-2xl
              bg-white/[0.04]
              border border-red-900/20
              hover:bg-red-600/10
              hover:border-red-500/30
              transition-all
              flex
              items-center
              justify-center
              text-white
            "
          >
            <FiBell size={18} />

            {notifications.length > 0 && (
              <span
                className="
                  absolute
                  top-2.5
                  right-2.5
                  h-2
                  w-2
                  rounded-full
                  bg-red-500
                  shadow-[0_0_12px_rgba(239,68,68,.9)]
                "
              />
            )}
          </button>

          {showNotifications && (
            <div
              className="
                absolute
                right-0
                top-full
                mt-4
                w-80
                rounded-3xl
                border border-red-900/20
                bg-[#080808]
                backdrop-blur-2xl
                shadow-[0_0_45px_rgba(220,38,38,.12)]
                overflow-hidden
                z-[999]
              "
            >
              <div className="p-5 border-b border-red-900/20">
                <h3 className="text-white font-semibold">
                  Notifications
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  Latest admin activity
                </p>
              </div>

              <div className="p-3 space-y-2">
                {notifications.map((item) => (
                  <div
                    key={item.title}
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-2xl
                      p-3
                      hover:bg-red-600/10
                      transition-all
                    "
                  >
                    <div
                      className="
                        h-10
                        w-10
                        shrink-0
                        rounded-xl
                        bg-red-600/10
                        border border-red-500/20
                        flex
                        items-center
                        justify-center
                        text-red-400
                      "
                    >
                      {item.icon}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm text-gray-200">
                        {item.title}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {item.description}
                      </p>

                      <p className="text-[11px] text-red-400 mt-2">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="
                  w-full
                  border-t border-red-900/20
                  py-4
                  text-sm
                  text-red-400
                  hover:bg-red-600/10
                  hover:text-white
                  transition-all
                "
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        <div
          className="
            hidden sm:flex
            items-center
            gap-3
            px-3
            py-2
            rounded-2xl
            bg-white/[0.04]
            border border-red-900/20
            hover:border-red-500/30
            transition-all
          "
        >
          <div
            className="
              h-10
              w-10
              rounded-2xl
              bg-red-600/15
              border border-red-500/25
              flex
              items-center
              justify-center
              text-red-300
              shadow-[0_0_18px_rgba(239,68,68,.12)]
            "
          >
            <FiUser size={18} />
          </div>

          <div className="hidden md:block min-w-0">
            <p className="text-sm font-medium text-white truncate max-w-36">
              {displayName}
            </p>

            <p className="text-xs text-gray-500 truncate max-w-40">
              {displayEmail}
            </p>
          </div>

          <FiChevronDown className="hidden md:block text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
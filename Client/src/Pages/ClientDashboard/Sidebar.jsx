import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiChevronLeft,
  FiCreditCard,
  FiFileText,
  FiFolder,
  FiHome,
  FiLogOut,
  FiMenu,
  FiUser,
  FiX,
} from "react-icons/fi";
import Logo from "../../assets/companyLogo.png";
import { logout } from "../../Utils/auth";

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const links = [
    {
      name: "Dashboard",
      path: "/client/dashboard",
      icon: <FiHome size={20} />,
    },
    {
      name: "Projects",
      path: "/client/project",
      icon: <FiFolder size={20} />,
    },
    {
      name: "Payments",
      path: "/client/payments",
      icon: <FiCreditCard size={20} />,
    },
    {
      name: "Documents",
      path: "/client/documents",
      icon: <FiFileText size={20} />,
    },
    {
      name: "Meetings",
      path: "/client/meetings",
      icon: <FiCalendar size={20} />,
    },
    {
      name: "Profile",
      path: "/client/profile",
      icon: <FiUser size={20} />,
    },
  ];

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    await logout();

    navigate("/login", {
      replace: true,
      state: {
        message: "Logout successful.",
      },
    });
  };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:relative
          left-0 top-0 z-50
          flex h-full flex-col
          overflow-hidden
          border-r border-red-900/20
          bg-black/70
          shadow-[0_0_40px_rgba(220,38,38,.08)]
          backdrop-blur-2xl
          transition-all duration-300
          ${collapsed ? "md:w-24" : "md:w-72"}
          w-72
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        <div className="border-b border-red-900/20 px-6 py-8">
          <div className="flex items-center justify-between">
            {!collapsed || mobileOpen ? (
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-white/5 shadow-[0_0_25px_rgba(239,68,68,.15)] backdrop-blur-xl">
                  <img
                    src={Logo}
                    alt="Company Logo"
                    className="h-11 w-11 object-contain"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold tracking-wide text-white">
                    Strategy
                  </h2>

                  <p className="text-xs uppercase tracking-[0.35em] text-red-400">
                    Client Portal
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-white/5 shadow-[0_0_20px_rgba(239,68,68,.15)]">
                <img
                  src={Logo}
                  alt="Company Logo"
                  className="h-9 w-9 object-contain"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition-all hover:border-red-500/30 hover:bg-red-600/10 hover:text-white md:flex"
              >
                {collapsed ? <FiMenu /> : <FiChevronLeft />}
              </button>

              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white md:hidden"
              >
                <FiX />
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto p-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `
                  relative flex items-center gap-4
                  rounded-2xl border px-4 py-4
                  transition-all duration-300
                  ${
                    isActive
                      ? "border-red-500/30 bg-red-600/15 text-white shadow-[0_0_20px_rgba(239,68,68,.15)]"
                      : "border-transparent text-gray-400 hover:border-red-500/20 hover:bg-red-600/10 hover:text-white"
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute bottom-3 left-0 top-3 w-1 rounded-full bg-red-500" />
                  )}

                  <div className="shrink-0">{link.icon}</div>

                  {(!collapsed || mobileOpen) && (
                    <span className="font-medium">{link.name}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-red-900/20 p-4">
        <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-4 rounded-2xl border border-red-500/20 bg-red-600/10 px-4 py-4 text-red-400 transition-all duration-300 hover:bg-red-600/20 hover:text-white disabled:opacity-60"
          >
              <FiLogOut size={20} />

            {(!collapsed || mobileOpen) && (
              <span className="font-medium">
                {loggingOut ? "Logging out..." : "Logout"}
              </span>
            )}
        </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
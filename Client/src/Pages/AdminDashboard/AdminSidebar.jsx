import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiFolder,
  FiCreditCard,
  FiFileText,
  FiCalendar,
  FiSettings,
  FiClipboard,
  FiLogOut,
  FiMenu,
  FiChevronLeft,
  FiX,
} from "react-icons/fi";

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FiHome size={20} />,
    },
    {
      name: "Consultations",
      path: "/admin/consultations",
      icon: <FiClipboard size={20} />,
    },
    {
      name: "Clients",
      path: "/admin/clients",
      icon: <FiUsers size={20} />,
    },
    {
      name: "Projects",
      path: "/admin/projects",
      icon: <FiFolder size={20} />,
    },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: <FiCreditCard size={20} />,
    },
    {
      name: "Documents",
      path: "/admin/documents",
      icon: <FiFileText size={20} />,
    },
    {
      name: "Meetings",
      path: "/admin/meetings",
      icon: <FiCalendar size={20} />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <FiSettings size={20} />,
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="
            fixed inset-0
            bg-black/60
            backdrop-blur-sm
            z-40
            md:hidden
          "
        />
      )}

      <aside
        className={`
          fixed md:relative
          top-0 left-0
          z-50
          h-full
          flex flex-col
          bg-[#0F172A]
          border-r border-white/5
          transition-all duration-300
          ${collapsed ? "md:w-20" : "md:w-64"}
          w-72
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">

          {(!collapsed || mobileOpen) && (
            <div>
              <h2 className="text-white font-semibold">
                Admin Portal
              </h2>

              <p className="text-xs text-slate-400">
                Management Console
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="
                hidden md:flex
                p-2
                rounded-lg
                text-slate-400
                hover:bg-white/5
                hover:text-white
              "
            >
              {collapsed ? (
                <FiMenu size={18} />
              ) : (
                <FiChevronLeft size={18} />
              )}
            </button>

            <button
              onClick={() => setMobileOpen(false)}
              className="
                md:hidden
                p-2
                rounded-lg
                text-slate-400
                hover:bg-white/5
                hover:text-white
              "
            >
              <FiX size={20} />
            </button>

          </div>

        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `
                  flex items-center
                  gap-3
                  px-3 py-3
                  rounded-xl
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }
                `
              }
            >
              {link.icon}

              {(!collapsed || mobileOpen) && (
                <span className="text-sm font-medium">
                  {link.name}
                </span>
              )}
            </NavLink>
          ))}

        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5">

          <button
            className="
              w-full
              flex items-center
              gap-3
              px-3 py-3
              rounded-xl
              text-red-400
              hover:bg-red-500/10
              transition
            "
          >
            <FiLogOut size={20} />

            {(!collapsed || mobileOpen) && (
              <span className="text-sm font-medium">
                Logout
              </span>
            )}
          </button>

        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;
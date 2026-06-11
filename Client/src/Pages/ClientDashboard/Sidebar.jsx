import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiFolder,
  FiCreditCard,
  FiFileText,
  FiCalendar,
  FiUser,
  FiLogOut,
  FiMenu,
  FiChevronLeft,
  FiX,
} from "react-icons/fi";

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);

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

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="
            fixed
            inset-0
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
          bg-[#0D1324]
          border-r border-white/5
          transition-all duration-300
          ${
            collapsed
              ? "md:w-20"
              : "md:w-64"
          }
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
              <h2 className="text-white font-semibold text-sm">
                Strategy
              </h2>

              <p className="text-xs text-slate-400">
                Client Portal
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">

            {/* Desktop Collapse */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="
                hidden md:flex
                p-2
                rounded-lg
                text-slate-400
                hover:bg-white/5
                hover:text-white
                transition
                cursor-pointer
              "
            >
              {collapsed ? (
                <FiMenu size={18} />
              ) : (
                <FiChevronLeft size={18} />
              )}
            </button>

            {/* Mobile Close */}
            <button
              onClick={() => setMobileOpen(false)}
              className="
                md:hidden
                p-2
                rounded-lg
                text-slate-400
                hover:bg-white/5
                hover:text-white
                transition
              "
            >
              <FiX size={20} />
            </button>

          </div>

        </div>

        {/* Navigation */}
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
                      ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }
                `
              }
            >
              <span className="shrink-0">
                {link.icon}
              </span>

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
              cursor-pointer
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

export default Sidebar;
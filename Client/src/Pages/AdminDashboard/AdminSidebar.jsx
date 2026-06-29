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
  FiEdit3,
} from "react-icons/fi";
import Logo from "../../assets/companyLogo.png";

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
      name: "Blogs",
      path: "/admin/blogs",
      icon: <FiEdit3 size={20} />,
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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:relative
          top-0 left-0
          z-50
          h-full
          flex flex-col
          bg-black/70
          backdrop-blur-2xl
          overflow-hidden
          border-r border-red-900/20
          shadow-[0_0_40px_rgba(220,38,38,.08)]
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
        <div className="px-6 py-8 border-b border-red-900/20">
          <div className="flex items-center justify-between">
            {!collapsed || mobileOpen ? (
              <div className="flex items-center gap-4">
                <div
                  className="
                    h-16 w-16 rounded-2xl
                    bg-white/5
                    border border-red-500/20
                    backdrop-blur-xl
                    flex items-center justify-center
                    shadow-[0_0_25px_rgba(239,68,68,.15)]
                  "
                >
                  <img
                    src={Logo}
                    alt="Company Logo"
                    className="h-11 w-11 object-contain"
                  />
                </div>

                <div>
                  <h2 className="text-white text-xl font-bold tracking-wide">
                    Strategy
                  </h2>

                  <p className="text-red-400 text-xs uppercase tracking-[0.35em]">
                    Consulting
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="
                  h-14 w-14 mx-auto rounded-2xl
                  bg-white/5
                  border border-red-500/20
                  flex items-center justify-center
                  shadow-[0_0_20px_rgba(239,68,68,.15)]
                "
              >
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
                className="
                  hidden md:flex h-10 w-10 rounded-xl
                  items-center justify-center
                  bg-white/5
                  border border-white/10
                  text-gray-300
                  hover:bg-red-600/10
                  hover:border-red-500/30
                  hover:text-white
                  transition-all
                "
              >
                {collapsed ? <FiMenu /> : <FiChevronLeft />}
              </button>

              <button
                onClick={() => setMobileOpen(false)}
                className="
                  md:hidden h-10 w-10 rounded-xl
                  bg-white/5
                  flex items-center justify-center
                  text-white
                "
              >
                <FiX />
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `
                  relative flex items-center gap-4
                  px-4 py-4
                  rounded-2xl
                  border
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-red-600/15 border-red-500/30 text-white shadow-[0_0_20px_rgba(239,68,68,.15)]"
                      : "border-transparent text-gray-400 hover:bg-red-600/10 hover:border-red-500/20 hover:text-white"
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-red-500" />
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

        <div className="p-4 border-t border-red-900/20">
          <button
            className="
              w-full flex items-center gap-4
              px-4 py-4
              rounded-2xl
              bg-red-600/10
              border border-red-500/20
              text-red-400
              hover:bg-red-600/20
              hover:text-white
              transition-all duration-300
            "
          >
            <FiLogOut size={20} />

            {(!collapsed || mobileOpen) && (
              <span className="font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
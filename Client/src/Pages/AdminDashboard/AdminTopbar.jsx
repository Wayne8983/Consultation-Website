import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiChevronDown,
  FiClipboard,
  FiCreditCard,
  FiEdit3,
  FiFileText,
  FiFolder,
  FiMenu,
  FiSearch,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { getUser } from "../../Utils/auth";

const searchItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <FiUser /> },
  { label: "Consultations", path: "/admin/consultations", icon: <FiClipboard /> },
  { label: "Clients", path: "/admin/clients", icon: <FiUsers /> },
  { label: "Projects", path: "/admin/projects", icon: <FiFolder /> },
  { label: "Payments", path: "/admin/payments", icon: <FiCreditCard /> },
  { label: "Documents", path: "/admin/documents", icon: <FiFileText /> },
  { label: "Meetings", path: "/admin/meetings", icon: <FiCalendar /> },
  { label: "Blogs", path: "/admin/blogs", icon: <FiEdit3 /> },
  { label: "Settings", path: "/admin/settings", icon: <FiSettings /> },
];

const AdminTopbar = ({ setMobileOpen }) => {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [admin] = useState(() => getUser());
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  const displayName = admin?.name || "Admin";
  const displayEmail = admin?.email || "System Manager";
  const initial = displayName.trim().charAt(0).toUpperCase() || "A";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return searchItems;

    return searchItems.filter((item) =>
      item.label.toLowerCase().includes(term)
    );
  }, [search]);

  const goToResult = (item) => {
    navigate(item.path);
    setSearch("");
    setShowSearch(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (results[0]) {
      goToResult(results[0]);
    }
  };

  return (
    <header className="relative z-50 h-20 border-b border-red-900/20 bg-black/40 px-4 shadow-[0_10px_35px_rgba(220,38,38,.04)] backdrop-blur-2xl md:px-8">
      <div className="flex h-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-white/5 text-white transition-all hover:bg-red-600/10 md:hidden"
            aria-label="Open menu"
          >
            <FiMenu size={20} />
          </button>

          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.3em] text-red-400">
              Control Center
            </p>

            <h1 className="truncate text-xl font-semibold text-white md:text-2xl">
              Admin Dashboard
            </h1>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <div ref={searchRef} className="relative hidden lg:block">
            <form
              onSubmit={handleSubmit}
              className="flex w-80 items-center gap-3 rounded-2xl border border-red-900/20 bg-white/[0.04] px-4 py-3 transition-all focus-within:border-red-500/30 focus-within:bg-red-600/[0.04]"
            >
              <FiSearch className="shrink-0 text-red-400" />

              <input
                type="text"
                value={search}
                onFocus={() => setShowSearch(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSearch(true);
                }}
                placeholder="Search dashboard..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
              />
            </form>

            {showSearch && (
              <div className="absolute right-0 top-full mt-3 w-80 overflow-hidden rounded-3xl border border-red-900/20 bg-[#080808] shadow-[0_0_45px_rgba(220,38,38,.12)]">
                <div className="space-y-2 p-3">
                  {results.length === 0 ? (
                    <p className="px-3 py-4 text-sm text-gray-500">
                      No matching page found.
                    </p>
                  ) : (
                    results.map((item) => (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => goToResult(item)}
                        className="flex w-full items-center gap-3 rounded-2xl p-3 text-left text-gray-300 transition-all hover:bg-red-600/10 hover:text-white"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-600/10 text-red-400">
                          {item.icon}
                        </span>

                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-red-900/20 bg-white/[0.04] px-3 py-2 transition-all hover:border-red-500/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/25 bg-red-600/15 text-sm font-bold text-red-300 shadow-[0_0_18px_rgba(239,68,68,.12)]">
              {initial}
            </div>

            <div className="hidden min-w-0 md:block">
              <p className="max-w-36 truncate text-sm font-medium text-white">
                {displayName}
              </p>

              <p className="max-w-40 truncate text-xs text-gray-500">
                {displayEmail}
              </p>
            </div>

            <FiChevronDown className="hidden text-gray-500 md:block" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
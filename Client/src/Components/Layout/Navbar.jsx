import { useState } from "react";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import Logo from "../../assets/companyLogo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Insights", path: "/insights" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentPath = window.location.pathname;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-1">
        <div className="h-20 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-center">
              <img
                src={Logo}
                alt="Strategy Center Logo"
                className="h-14 w-auto object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
              />
            </div>

            <h1 className="text-2xl font-semibold tracking-wide text-slate-900 leading-none">
              Strategy Center
            </h1>
          </div>

          {/* DESKTOP NAV */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((a) => {
              const isActive = currentPath === a.path;

              return (
                <li key={a.path}>
                  <a
                    href={a.path}
                    className={`
                      relative pb-1 transition-colors duration-200

                      after:content-[''] after:absolute after:left-0 after:-bottom-0.5
                      after:h-[2px] after:w-full after:bg-slate-900
                      after:scale-x-0 after:origin-center
                      after:transition-transform after:duration-300

                      hover:after:scale-x-100

                      ${
                        isActive
                          ? "text-slate-900 font-semibold after:scale-x-100"
                          : "text-gray-600 hover:text-slate-900"
                      }
                    `}
                  >
                    {a.name}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-3">

            {/* SIGN IN */}
            <a
              href="/login"
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900 transition-colors duration-200"
            >
              Sign In
            </a>

            {/* BOOK CONSULTATION */}
            <a
              href="/consultation"
              className="px-5 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors duration-200"
            >
              Book Consultation
            </a>

          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <HiOutlineXMark size={30} />
            ) : (
              <HiOutlineBars3 size={30} />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <ul className="py-6 flex flex-col gap-5">

              {navLinks.map((a) => {
                const isActive = currentPath === a.path;

                return (
                  <li key={a.path}>
                    <a
                      href={a.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`
                        block transition-colors duration-200

                        ${
                          isActive
                            ? "text-slate-900 font-semibold"
                            : "text-gray-600"
                        }
                      `}
                    >
                      {a.name}
                    </a>
                  </li>
                );
              })}

              {/* MOBILE SIGN IN */}
              <a
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-3 rounded-lg border hover:bg-slate-900  border-gray-300 text-gray-700 text-center"
              >
                Sign In
              </a>

              {/* MOBILE CTA */}
              <button className="mt-2 w-full py-3 rounded-lg bg-slate-900 text-white">
                Book Consultation
              </button>

            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
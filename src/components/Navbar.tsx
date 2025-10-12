import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignInNavigation = () => {
    navigate("/signin");
    setIsOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Alumni", path: "/alumni" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="w-full fixed top-0 left-0 z-[100] backdrop-blur-md bg-white/70 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* ✅ Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="BrainPro Logo"
            className="w-16 h-16 object-contain"
          />
          {/* <span className="text-2xl font-bold font-serif tracking-wide text-slate-800">
            BRAIN<span className="text-blue-500">Pro</span>
          </span> */}
        </Link>

        {/* ✅ Desktop Nav */}
        <ul className="hidden md:flex space-x-10 text-[15px] font-medium">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink to={item.path}>
                {({ isActive }) => (
                  <span
                    className={`relative pb-1 transition-all duration-300 group ${
                      isActive
                        ? "text-blue-500 font-semibold"
                        : "text-slate-700 hover:text-blue-500"
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute left-0 bottom-0 h-0.5 bg-blue-500 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ✅ Login (Desktop) */}
        <div className="hidden md:flex items-center">
          <button
            onClick={handleSignInNavigation}
            className="text-slate-700 hover:text-blue-500 transition text-2xl"
            title="Login"
          >
            <FaUserCircle />
          </button>
        </div>

        {/* ✅ Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl text-slate-700 focus:outline-none hover:text-blue-500 transition"
        >
          <FaBars />
        </button>
      </div>

      {/* ✅ Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
          <ul className="flex flex-col items-center space-y-5 py-5 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink to={item.path} onClick={() => setIsOpen(false)}>
                  {({ isActive }) => (
                    <span
                      className={`relative block pb-1 transition-all duration-300 group ${
                        isActive
                          ? "text-blue-500 font-semibold"
                          : "text-slate-700 hover:text-blue-500"
                      }`}
                    >
                      {item.name}
                      <span
                        className={`absolute left-0 bottom-0 h-0.5 bg-blue-400 transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </span>
                  )}
                </NavLink>
              </li>
            ))}

            {/* ✅ Login (Mobile) */}
            <button
              onClick={handleSignInNavigation}
              className="text-slate-700 hover:text-blue-500 transition text-2xl mt-2"
              title="Login"
            >
              <FaUserCircle />
            </button>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

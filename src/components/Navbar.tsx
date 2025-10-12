import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import logo from "../assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false); // dropdown state
  const navigate = useNavigate();

  const handleSignInNavigation = () => {
    navigate("/signin");
    setIsOpen(false);
    setAboutOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/" },
    {
      name: "About",
      path: "/about",
      dropdown: [
        { name: "About Page", path: "/about" },
        { name: "CBT Portal", path: "/quiz-login" },
      ],
    },
    { name: "Alumni", path: "/alumni" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="w-full fixed top-0 left-0 z-[100] backdrop-blur-md bg-white/70 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="BrainPro Logo" className="w-16 h-16 object-contain" />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-10 text-[15px] font-medium">
          {navItems.map((item) => (
            <li key={item.name} className="relative">
              {!item.dropdown ? (
                <NavLink to={item.path}>
                  {({ isActive }) => (
                    <span
                      className={`relative pb-1 transition-all duration-300 group ${
                        isActive ? "text-blue-500 font-semibold" : "text-slate-700 hover:text-blue-500"
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
              ) : (
                // Dropdown
                <div
                  className="cursor-pointer flex items-center space-x-1"
                  onMouseEnter={() => setAboutOpen(true)}
                  onMouseLeave={() => setAboutOpen(false)}
                >
                  <span className="text-slate-700 hover:text-blue-500 transition">{item.name}</span>
                  <FaChevronDown className="text-slate-700 text-sm" />
                  {aboutOpen && (
                    <ul className="absolute top-full left-0 mt-2 bg-white border border-slate-200 shadow-lg w-40 rounded-md">
                      {item.dropdown.map((dropItem) => (
                        <li key={dropItem.name}>
                          <Link
                            to={dropItem.path}
                            className="block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-500"
                          >
                            {dropItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop Login */}
        <div className="hidden md:flex items-center">
          <button
            onClick={handleSignInNavigation}
            className="text-slate-700 hover:text-blue-500 transition text-2xl"
            title="Login"
          >
            <FaUserCircle />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl text-slate-700 focus:outline-none hover:text-blue-500 transition"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
          <ul className="flex flex-col items-center space-y-5 py-5 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.name} className="relative">
                {!item.dropdown ? (
                  <NavLink to={item.path} onClick={() => setIsOpen(false)}>
                    {({ isActive }) => (
                      <span
                        className={`relative block pb-1 transition-all duration-300 group ${
                          isActive ? "text-blue-500 font-semibold" : "text-slate-700 hover:text-blue-500"
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
                ) : (
                  <div>
                    <span
                      onClick={() => setAboutOpen(!aboutOpen)}
                      className="flex items-center space-x-1 cursor-pointer text-slate-700 hover:text-blue-500 transition"
                    >
                      {item.name} <FaChevronDown className="text-sm" />
                    </span>
                    {aboutOpen && (
                      <ul className="mt-2 bg-white border border-slate-200 shadow-lg w-40 rounded-md">
                        {item.dropdown.map((dropItem) => (
                          <li key={dropItem.name}>
                            <Link
                              to={dropItem.path}
                              onClick={() => {
                                setIsOpen(false);
                                setAboutOpen(false);
                              }}
                              className="block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-500"
                            >
                              {dropItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}

            {/* Mobile Login */}
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

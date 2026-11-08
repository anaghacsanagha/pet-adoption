
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Header({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("pawhavenUser") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("pawhavenUser");
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-container">

        {/* Logo */}
        <Link
          to={user ? "/home" : "/"}
          className="brand-logo"
          onClick={closeMenu}
        >
          <span className="brand-icon">🐾</span>
          <span>PawHaven</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Navigation */}
        <nav className={`header-nav ${menuOpen ? "active" : ""}`}>

          {user ? (
            <>
              <NavLink to="/home" onClick={closeMenu}>
                Home
              </NavLink>

              <NavLink to="/pets" onClick={closeMenu}>
                Find Pets
              </NavLink>

              <NavLink to="/about" onClick={closeMenu}>
                About
              </NavLink>

              <NavLink to="/contact" onClick={closeMenu}>
                Contact
              </NavLink>

              <NavLink to="/dashboard" onClick={closeMenu}>
                My Dashboard
              </NavLink>

              {/* Logout Button */}
              <button
                className="header-login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

              {/* Dark / Light Mode Button - After Logout */}
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={() => setDarkMode((prev) => !prev)}
                title={darkMode ? "Light Mode" : "Dark Mode"}
                aria-label={
                  darkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" onClick={closeMenu}>
                Home
              </NavLink>

              <NavLink to="/about" onClick={closeMenu}>
                About
              </NavLink>

              <NavLink to="/contact" onClick={closeMenu}>
                Contact
              </NavLink>

              <Link
                to="/login"
                className="header-login-btn"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="header-register-btn"
                onClick={closeMenu}
              >
                Register
              </Link>

              {/* Dark / Light Mode Button */}
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={() => setDarkMode((prev) => !prev)}
                title={darkMode ? "Light Mode" : "Dark Mode"}
                aria-label={
                  darkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </>
          )}

        </nav>
      </div>
    </header>
  );
}

export default Header;

import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Navbar.css";
import { FaUser, FaSearch, FaShoppingBag, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

function Navbar({ onCartClick, setSearchText, cartRefresh }) {

  // ✅ FIXED STATES
  const [userOpen, setUserOpen] = useState(false);
  const [weddingOpen, setWeddingOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();
  const location = useLocation();

  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));

  // ✅ ADMIN CHECK
  const userObj = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = userObj?.role === "ADMIN";

  // ================= DARK MODE =================
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ================= USER SYNC =================
  useEffect(() => {
    const handleStorage = () => {
      setUserEmail(localStorage.getItem("userEmail"));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ================= CART COUNT =================
  const fetchCartCount = useCallback(async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))?.id;

      if (!userId) {
        setCartCount(0);
        return;
      }

      const res = await fetch(`http://localhost:8080/cart/user/${userId}`);
      const data = await res.json();

      const total =
        data?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

      setCartCount(total);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchCartCount();
    window.addEventListener("cartUpdated", fetchCartCount);

    return () => {
      window.removeEventListener("cartUpdated", fetchCartCount);
    };
  }, [fetchCartCount, cartRefresh]);

  // ================= SEARCH =================
  const toggleSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.trim().length > 0) {
      navigate("/catalogue");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");
    setUserEmail(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const avatarLetter = userEmail
    ? userEmail.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="navbar-container">
      <div className="navbar">

        {/* LOGO */}
        <div className="logo" onClick={() => navigate("/")}>
          SravanLexi
        </div>

        {/* NAV LINKS */}
        <ul className="nav-links">

          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              HOME DECOR
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/gifting"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              GIFTING
            </NavLink>
          </li>

          {/* ✅ WEDDING FIX */}
          <li
            className="wedding-menu"
            onMouseEnter={() => setWeddingOpen(true)}
            onMouseLeave={() => setWeddingOpen(false)}
          >
            <span
              className={
                location.pathname.includes("/wedding")
                  ? "active-link"
                  : ""
              }
            >
              WEDDINGS
            </span>

            {weddingOpen && (
              <div className="wedding-dropdown">
                <div className="wedding-options">
                  <p onClick={() => navigate("/wedding/womens")}>
                    Women
                  </p>
                  <p onClick={() => navigate("/wedding/mens")}>
                    Men
                  </p>
                </div>
              </div>
            )}
          </li>

        </ul>

        {/* ICONS */}
        <div className="icons-container">

          {/* ✅ ADMIN BUTTONS */}
          {isAdmin && (
            <div style={{ display: "flex", gap: "10px", marginRight: "10px" }}>
              <button onClick={() => navigate("/admin/products")}>
                Admin Products
              </button>
              <button onClick={() => navigate("/admin/add-product")}>
                Add Product
              </button>
              <button onClick={() => navigate("/admin")}>
                Dashboard
              </button>
            </div>
          )}

          {/* DARK MODE */}
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* SEARCH */}
          <FaSearch className="icon-btn" onClick={toggleSearch} />

          {/* ✅ USER FIX */}
          <div
            className="user-section"
            ref={menuRef}
            onMouseEnter={() => setUserOpen(true)}
            onMouseLeave={() => setUserOpen(false)}
          >
            {userEmail ? (
              <>
                <div className="avatar-circle">{avatarLetter}</div>

                {userOpen && (
                  <div className="dropdown animate-dropdown">
                    <div className="user-info">
                      <div className="username">{userEmail}</div>
                      <div className="email-text">Logged in</div>
                    </div>

                    <p onClick={() => navigate("/profile")}>
                      My Profile
                    </p>
                    <p onClick={() => navigate("/orders")}>
                      Orders
                    </p>
                    <p className="logout-btn" onClick={handleLogout}>
                      Logout
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <FaUser className="icon-btn" />

                {userOpen && (
                  <div className="dropdown animate-dropdown">
                    <p onClick={() => navigate("/login")}>
                      Login
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* CART */}
          <div className="cart-trigger" onClick={onCartClick}>
            <FaShoppingBag className="icon-btn" />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>

        </div>
      </div>

      {/* SEARCH */}
      <div className={`search-overlay ${isSearchOpen ? "open" : ""}`}>
        <div className="search-content" ref={searchRef}>
          <FaSearch />

          <input
            ref={inputRef}
            type="text"
            className="full-search-input"
            placeholder="Search products..."
            onChange={handleSearchChange}
          />

          <FaTimes
            className="close-search-btn"
            onClick={() => setIsSearchOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
import React from "react";
import { NavLink } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-section">
          <h2 className="logo">Lexi Store</h2>
          <p>Discover elegant wedding collections for Men & Women.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>

            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
                Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/wedding/womens" className={({ isActive }) => isActive ? "active-link" : ""}>
                Women Wedding
              </NavLink>
            </li>

            <li>
              <NavLink to="/wedding/mens" className={({ isActive }) => isActive ? "active-link" : ""}>
                Men Wedding
              </NavLink>
            </li>

            <li>
              <NavLink to="/gifting" className={({ isActive }) => isActive ? "active-link" : ""}>
                Gifting
              </NavLink>
            </li>

            <li>
              <NavLink to="/brands" className={({ isActive }) => isActive ? "active-link" : ""}>
                Brands
              </NavLink>
            </li>

          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@weddingstore.com</p>
          <p>Phone: +91 9704065203</p>
          <p>Location: India</p>
        </div>

        {/* Social */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com"><FaFacebook /></a>
            <a href="https://www.instagram.com"><FaInstagram /></a>
            <a href="https://www.twitter.com"><FaTwitter /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Wedding Store
      </div>
    </footer>
  );
}

export default Footer;
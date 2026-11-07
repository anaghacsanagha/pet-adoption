
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-about">
          <h2>🐾 PawHaven</h2>
          <p>
            Every paw deserves a loving home.
            Find your forever friend and make a
            difference in a pet's life.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/pets">Find Pets</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="footer-links">
          <h3>Adoption</h3>
          <Link to="/wishlist">My Wishlist</Link>
          <Link to="/my-adoptions">My Adoptions</Link>
          <Link to="/adoption-terms">Adoption Terms</Link>
          <Link to="/care-feeding">Pet Care Guide</Link>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>📍 Kerala, India</p>
          <p>✉️ hello@pawhaven.com</p>
          <p>🐶 Love • Care • Adopt</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} PawHaven. All Rights Reserved.</p>
        <p>Made with ❤️ for every little paw.</p>
      </div>
    </footer>
  );
}

export default Footer;

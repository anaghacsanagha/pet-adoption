
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, password, confirmPassword } = formData;

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Check existing users from server
      const response = await fetch("http://localhost:3000/users");

      if (!response.ok) {
        throw new Error("Unable to connect to server.");
      }

      const users = await response.json();

      const emailExists = users.some(
        (user) =>
          user.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (emailExists) {
        setError("This email is already registered. Please login.");
        return;
      }

      const newUser = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone,
        password
      };

      // Save user to JSON Server
      const saveResponse = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      });

      if (!saveResponse.ok) {
        throw new Error("Registration failed. Please try again.");
      }

      alert("Registration successful! Please login.");
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("Server connection failed. Please start the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <section className="auth-section">
        <div className="auth-container">

          <div className="auth-image">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1000"
              alt="Two lovely dogs"
            />

            <div className="auth-image-content">
              <h2>Every Paw Deserves Love</h2>
              <p>Join PawHaven and find your forever friend.</p>
            </div>
          </div>

          <div className="auth-form-container">
            <span className="auth-tag">🐾 Welcome to PawHaven</span>

            <h1>Create Your Account</h1>
            <p className="auth-description">
              Join our community and start your adoption journey.
            </p>

            <form onSubmit={handleSubmit} className="auth-form">

              <div className="auth-input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="10 digit phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account →"}
              </button>

            </form>

            <p className="auth-switch">
              Already have an account?
              <Link to="/login"> Login here</Link>
            </p>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Register;

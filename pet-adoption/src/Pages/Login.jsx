
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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

    try {
      setLoading(true);
      setError("");

      // Fetch registered users from JSON Server
      const response = await fetch("http://localhost:3000/users");

      if (!response.ok) {
        throw new Error("Server connection failed");
      }

      const users = await response.json();

      // Find matching user
      const user = users.find(
        (item) =>
          item.email.toLowerCase() ===
            formData.email.trim().toLowerCase() &&
          item.password === formData.password
      );

      if (!user) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      const loggedInUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      };

      // Store only logged-in user session in localStorage
      localStorage.setItem(
        "pawhavenUser",
        JSON.stringify(loggedInUser)
      );

      alert(`Welcome back, ${user.name}!`);

      navigate("/home");

    } catch (err) {
      console.error(err);
      setError("Unable to connect to server. Please start the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <section className="auth-section">
        <div className="auth-container login-container">

          <div className="auth-image">
            <img
              src="https://images.unsplash.com/photo-1551717743-49959800b1f6?w=1000"
              alt="Cute dog waiting for a home"
            />

            <div className="auth-image-content">
              <h2>Your Best Friend Is Waiting</h2>
              <p>Come back and continue your journey with PawHaven.</p>
            </div>
          </div>

          <div className="auth-form-container login-form-container">
            <span className="auth-tag">🐾 Welcome Back</span>

            <h1>Login to PawHaven</h1>
            <p className="auth-description">
              Sign in to discover lovely pets waiting for you.
            </p>

            <form onSubmit={handleSubmit} className="auth-form">

              <div className="auth-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your registered email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
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
                {loading ? "Logging in..." : "Login →"}
              </button>

            </form>

            <p className="auth-switch">
              Don't have an account?
              <Link to="/register"> Register here</Link>
            </p>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Login;

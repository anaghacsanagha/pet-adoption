
import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "../utils/sweetAlert";

function Profile() {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("pawhavenUser")) || {};

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });

  const [isDark, setIsDark] = useState(
    () => document.querySelector(".pawhaven-app")?.classList.contains("dark-mode") || false
  );

  useEffect(() => {
    const app = document.querySelector(".pawhaven-app");
    if (!app) return;

    const observer = new MutationObserver(() => {
      setIsDark(app.classList.contains("dark-mode"));
    });

    observer.observe(app, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const theme = {
    background: isDark ? "#242424" : "#fffaf5",
    card: isDark ? "#303030" : "#ffffff",
    text: isDark ? "#f5eee7" : "#493b35",
    muted: isDark ? "#c0b5aa" : "#81736b",
    border: isDark ? "#4a4a4a" : "#eadfd5",
    input: isDark ? "#252525" : "#ffffff",
    inputText: isDark ? "#f5eee7" : "#493b35",
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      ...formData,
    };

    localStorage.setItem(
      "pawhavenUser",
      JSON.stringify(updatedUser)
    );

    const users =
      JSON.parse(localStorage.getItem("pawhavenUsers")) || [];

    const updatedUsers = users.map((item) =>
      item.id === user.id ? { ...item, ...formData } : item
    );

    localStorage.setItem(
      "pawhavenUsers",
      JSON.stringify(updatedUsers)
    );

    setEditMode(false);

    await showSuccess(
      "Profile Updated!",
      "Your profile details have been updated successfully."
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("pawhavenUser");
    navigate("/login");
  };

  const inputStyle = {
    background: theme.input,
    color: theme.inputText,
    border: `1px solid ${theme.border}`,
    borderRadius: "8px",
    padding: "11px 13px",
    boxShadow: "none",
  };

  return (
    <div
      className="profile-page"
      style={{
        background: theme.background,
        color: theme.text,
        minHeight: "70vh",
        padding: "40px 0",
        transition: "all 0.3s ease",
      }}
    >
      <Container>
        <div
          className="profile-heading"
          style={{ textAlign: "center", marginBottom: "30px" }}
        >
          <p style={{ color: theme.muted }}>MY ACCOUNT</p>
          <h1 style={{ color: theme.text }}>My Profile</h1>
          <span style={{ color: theme.muted }}>
            Manage your PawHaven account details.
          </span>
        </div>

        <div
          className="profile-card"
          style={{
            background: theme.card,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: "16px",
            padding: "35px",
            maxWidth: "600px",
            margin: "0 auto",
            boxShadow: isDark
              ? "0 4px 18px rgba(0,0,0,0.3)"
              : "0 4px 18px rgba(0,0,0,0.06)",
          }}
        >
          <div
            className="profile-avatar"
            style={{
              background: isDark ? "#536b52" : "#789477",
              color: "#ffffff",
              width: "85px",
              height: "85px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "35px",
              fontWeight: "bold",
              margin: "0 auto 15px",
            }}
          >
            {formData.name
              ? formData.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <h2 style={{ color: theme.text, textAlign: "center" }}>
            {formData.name}
          </h2>

          <p
            className="profile-email"
            style={{ color: theme.muted, textAlign: "center" }}
          >
            {formData.email}
          </p>

          <div
            className="profile-divider"
            style={{
              borderTop: `1px solid ${theme.border}`,
              margin: "25px 0",
            }}
          />

          {editMode ? (
            <Form onSubmit={handleSave} className="profile-form">
              <Form.Group>
                <Form.Label style={{ color: theme.text }}>
                  Full Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label style={{ color: theme.text }}>
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label style={{ color: theme.text }}>
                  Phone Number
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </Form.Group>

              <div
                className="profile-buttons"
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "25px",
                }}
              >
                <Button
                  type="submit"
                  className="profile-save-btn"
                  style={{
                    flex: 1,
                    background: "#789477",
                    border: "none",
                  }}
                >
                  Save Changes
                </Button>

                <Button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={() => setEditMode(false)}
                  style={{
                    flex: 1,
                    background: isDark ? "#555555" : "#81736b",
                    border: "none",
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          ) : (
            <>
              <div
                className="profile-details"
                style={{ display: "grid", gap: "18px" }}
              >
                {[
                  ["Full Name", formData.name],
                  ["Email Address", formData.email],
                  ["Phone Number", formData.phone || "Not added"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      background: isDark ? "#252525" : "#fffaf5",
                      border: `1px solid ${theme.border}`,
                      borderRadius: "9px",
                      padding: "13px 16px",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        color: theme.muted,
                        fontSize: "13px",
                        marginBottom: "5px",
                      }}
                    >
                      {label}
                    </span>

                    <strong style={{ color: theme.text }}>
                      {value}
                    </strong>
                  </div>
                ))}
              </div>

              <Button
                className="profile-edit-btn"
                onClick={() => setEditMode(true)}
                style={{
                  width: "100%",
                  marginTop: "25px",
                  background: "#789477",
                  border: "none",
                }}
              >
                Edit Profile
              </Button>
            </>
          )}

          <Button
            className="profile-logout-btn"
            onClick={handleLogout}
            style={{
              width: "100%",
              marginTop: "12px",
              background: "#c62828",
              border: "none",
            }}
          >
            Logout
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default Profile;

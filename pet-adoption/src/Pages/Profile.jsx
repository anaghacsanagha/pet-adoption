
import React, { useState } from "react";
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

  return (
    <div className="profile-page">
      <Container>
        <div className="profile-heading">
          <p>MY ACCOUNT</p>
          <h1>My Profile</h1>
          <span>Manage your PawHaven account details.</span>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">
            {formData.name
              ? formData.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <h2>{formData.name}</h2>
          <p className="profile-email">{formData.email}</p>

          <div className="profile-divider"></div>

          {editMode ? (
            <Form onSubmit={handleSave} className="profile-form">
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className="profile-buttons">
                <Button type="submit" className="profile-save-btn">
                  Save Changes
                </Button>

                <Button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          ) : (
            <>
              <div className="profile-details">
                <div>
                  <span>Full Name</span>
                  <strong>{formData.name}</strong>
                </div>

                <div>
                  <span>Email Address</span>
                  <strong>{formData.email}</strong>
                </div>

                <div>
                  <span>Phone Number</span>
                  <strong>{formData.phone || "Not added"}</strong>
                </div>
              </div>

              <Button
                className="profile-edit-btn"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            </>
          )}

          <Button
            className="profile-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default Profile;

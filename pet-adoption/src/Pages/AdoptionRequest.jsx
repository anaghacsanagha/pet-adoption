
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  showSuccess,
  showError,
  showWarning,
} from "../utils/sweetAlert";

const API = "https://pawhaven-server.onrender.com";

function AdoptionRequest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("pawhavenUser") || "null"
  );

  const applicantId = user?.id || user?._id;

  const [isDark, setIsDark] = useState(
    document.querySelector(".pawhaven-app")?.classList.contains("dark-mode") || false
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
    page: isDark ? "#181818" : "#fffaf5",
    card: isDark ? "#292929" : "#ffffff",
    text: isDark ? "#f5f0eb" : "#493b35",
    muted: isDark ? "#c0b8b0" : "#81736b",
    border: isDark ? "#505050" : "#eadfd5",
    soft: isDark ? "#353535" : "#fffaf5",
    input: isDark ? "#353535" : "#ffffff",
    button: isDark ? "#789477" : "#198754",
  };

  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    livingType: "",
    experience: "",
    reason: "",
    agree: false,
  });

  useEffect(() => {
    const fetchPetAndOwner = async () => {
      try {
        const petResponse = await fetch(`${API}/pets/${id}`);

        if (!petResponse.ok) {
          throw new Error("Pet not found");
        }

        const petData = await petResponse.json();
        setPet(petData);

        const ownerId = petData.ownerId || petData.userId;

        if (ownerId) {
          const usersResponse = await fetch(`${API}/users`);

          if (usersResponse.ok) {
            const users = await usersResponse.json();

            const ownerData = users.find(
              (item) => String(item.id) === String(ownerId)
            );

            setOwner(ownerData || null);
          }
        }
      } catch (error) {
        console.error("Pet fetch error:", error);
        setPet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPetAndOwner();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !applicantId) {
      await showWarning("Please login first.");
      navigate("/login");
      return;
    }

    if (!pet) {
      await showError("Pet details not found.");
      return;
    }

    const ownerId = pet.ownerId || pet.userId;

    if (!ownerId) {
      await showError(
        "This pet does not have an owner ID. Please check the pet listing."
      );
      return;
    }

    if (String(ownerId) === String(applicantId)) {
      await showWarning("You cannot apply for your own pet.");
      return;
    }

    if (!formData.agree) {
      await showWarning("Please accept the adoption terms.");
      return;
    }

    if (!formData.phone.trim()) {
      await showWarning("Please enter your contact number.");
      return;
    }

    try {
      setSubmitting(true);

      const existingResponse = await fetch(
        `${API}/adoptions?petId=${encodeURIComponent(pet.id)}`
      );

      if (!existingResponse.ok) {
        throw new Error("Unable to check previous requests.");
      }

      const existingRequests = await existingResponse.json();

      const alreadyApplied = existingRequests.some((request) => {
        const previousApplicantId =
          request.applicantId || request.userId;

        return (
          String(previousApplicantId) === String(applicantId) &&
          ["Pending", "Accepted"].includes(
            request.status || "Pending"
          )
        );
      });

      if (alreadyApplied) {
        await showWarning(
          "You have already submitted an adoption request for this pet."
        );
        return;
      }

      const newRequest = {
        ownerId: String(ownerId),
        ownerName: owner?.name || pet.ownerName || "",
        ownerPhone: owner?.phone || pet.ownerPhone || "",

        applicantId: String(applicantId),
        applicantName: formData.fullName,
        applicantEmail: formData.email,
        applicantPhone: formData.phone,

        userId: String(applicantId),
        userName: formData.fullName,
        userEmail: formData.email,

        petId: String(pet.id),
        petName: pet.name,

        formData: {
          ...formData,
          phone: formData.phone,
        },

        status: "Pending",
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
      };

      const response = await fetch(`${API}/adoptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRequest),
      });

      if (!response.ok) {
        throw new Error("Failed to submit adoption request.");
      }

      await showSuccess(
        "Adoption request submitted successfully! 🐾"
      );

      navigate("/my-adoptions");
    } catch (error) {
      console.error("Adoption submission error:", error);
      await showError(
        error.message || "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    background: theme.input,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: "8px",
    padding: "11px 13px",
    colorScheme: isDark ? "dark" : "light",
    transition: "0.3s",
  };

  const labelStyle = {
    color: theme.text,
    fontWeight: "600",
    marginBottom: "8px",
  };

  const backButtonStyle = {
    background: theme.soft,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: "8px",
    padding: "9px 16px",
    marginBottom: "22px",
    cursor: "pointer",
  };

  if (!user) {
    return (
      <div
        className="container py-5 text-center"
        style={{ background: theme.page, color: theme.text }}
      >
        <h3>Please login to apply for adoption.</h3>
        <button
          style={{
            background: theme.button,
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "7px",
            marginTop: "15px",
          }}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="container py-5 text-center"
        style={{ background: theme.page, color: theme.text }}
      >
        Loading adoption form...
      </div>
    );
  }

  if (!pet) {
    return (
      <div
        className="container py-5 text-center"
        style={{ background: theme.page, color: theme.text }}
      >
        <h3>Pet not found.</h3>
        <button
          style={{
            background: theme.button,
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "7px",
            marginTop: "15px",
          }}
          onClick={() => navigate("/pets")}
        >
          Browse Pets
        </button>
      </div>
    );
  }

  return (
    <div
      className="adoption-request-page"
      style={{
        background: theme.page,
        color: theme.text,
        minHeight: "100vh",
        padding: "35px 0",
        transition: "0.3s",
      }}
    >
      <style>{`
        .adoption-request-page .form-control,
        .adoption-request-page .form-select {
          background-color: ${theme.input} !important;
          color: ${theme.text} !important;
          border-color: ${theme.border} !important;
        }

        .adoption-request-page .form-control::placeholder {
          color: ${theme.muted} !important;
        }

        .adoption-request-page .form-control:focus,
        .adoption-request-page .form-select:focus {
          border-color: ${isDark ? "#789477" : "#b69b89"} !important;
          box-shadow: 0 0 0 0.2rem ${isDark ? "rgba(120,148,119,0.2)" : "rgba(182,155,137,0.2)"} !important;
        }

        .adoption-request-page .form-check-label {
          color: ${theme.text};
        }

        .adoption-request-page .form-check-input {
          background-color: ${theme.input};
          border-color: ${theme.border};
        }

        .adoption-request-page .form-check-input:checked {
          background-color: ${theme.button};
          border-color: ${theme.button};
        }

        .adoption-request-page option {
          background: ${theme.card};
          color: ${theme.text};
        }
      `}</style>

      <div className="container">
        <div className="mx-auto" style={{ maxWidth: "750px" }}>
          <button
            style={backButtonStyle}
            onClick={() => navigate(`/pet/${pet.id}`)}
          >
            ← Back to Pet
          </button>

          <div
            className="card shadow-sm"
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: "14px",
              color: theme.text,
              overflow: "hidden",
            }}
          >
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 style={{ color: theme.text }}>
                  Adoption Application 🐾
                </h2>

                <p style={{ color: theme.muted }}>
                  Fill in your details to apply for adopting {pet.name}.
                </p>
              </div>

              <div
                className="d-flex align-items-center gap-3 mb-4 p-3 rounded"
                style={{
                  background: theme.soft,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <img
                  src={pet.image || "https://placehold.co/100x100?text=Pet"}
                  alt={pet.name}
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />

                <div>
                  <h5
                    className="mb-1"
                    style={{ color: theme.text }}
                  >
                    {pet.name}
                  </h5>

                  <p
                    className="mb-0"
                    style={{ color: theme.muted }}
                  >
                    {pet.breed} · {pet.location}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={labelStyle}>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    style={inputStyle}
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={labelStyle}>
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      style={inputStyle}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={labelStyle}>
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      style={inputStyle}
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" style={labelStyle}>
                    Address
                  </label>

                  <textarea
                    name="address"
                    className="form-control"
                    style={inputStyle}
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" style={labelStyle}>
                    Living Type
                  </label>

                  <select
                    name="livingType"
                    className="form-select"
                    style={inputStyle}
                    value={formData.livingType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select living type</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Independent House">
                      Independent House
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label" style={labelStyle}>
                    Previous Pet Experience
                  </label>

                  <textarea
                    name="experience"
                    className="form-control"
                    style={inputStyle}
                    rows="3"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Tell us about your previous experience with pets..."
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" style={labelStyle}>
                    Why do you want to adopt {pet.name}?
                  </label>

                  <textarea
                    name="reason"
                    className="form-control"
                    style={inputStyle}
                    rows="4"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    name="agree"
                    id="agree"
                    className="form-check-input"
                    checked={formData.agree}
                    onChange={handleChange}
                  />

                  <label
                    className="form-check-label"
                    htmlFor="agree"
                  >
                    I agree to the adoption terms and conditions.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-100 py-2"
                  disabled={submitting}
                  style={{
                    background: theme.button,
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "16px",
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Adoption Request"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdoptionRequest;


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

        // Exact submission timestamp for latest-first sorting
        createdAt: new Date().toISOString(),

        // Existing display date
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

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h3>Please login to apply for adoption.</h3>
        <button
          className="btn btn-success mt-3"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        Loading adoption form...
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container py-5 text-center">
        <h3>Pet not found.</h3>
        <button
          className="btn btn-success mt-3"
          onClick={() => navigate("/pets")}
        >
          Browse Pets
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: "750px" }}>
        <button
          className="btn btn-outline-secondary mb-4"
          onClick={() => navigate(`/pet/${pet.id}`)}
        >
          ← Back to Pet
        </button>

        <div className="card shadow-sm border-0">
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <h2>Adoption Application 🐾</h2>
              <p className="text-muted">
                Fill in your details to apply for adopting {pet.name}.
              </p>
            </div>

            <div
              className="d-flex align-items-center gap-3 mb-4 p-3 rounded"
              style={{ background: "#fffaf5" }}
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
                <h5 className="mb-1">{pet.name}</h5>
                <p className="text-muted mb-0">
                  {pet.breed} · {pet.location}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Living Type</label>
                <select
                  name="livingType"
                  className="form-select"
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
                <label className="form-label">
                  Previous Pet Experience
                </label>
                <textarea
                  name="experience"
                  className="form-control"
                  rows="3"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Tell us about your previous experience with pets..."
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Why do you want to adopt {pet.name}?
                </label>
                <textarea
                  name="reason"
                  className="form-control"
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
                <label className="form-check-label" htmlFor="agree">
                  I agree to the adoption terms and conditions.
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 py-2"
                disabled={submitting}
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
  );
}

export default AdoptionRequest;


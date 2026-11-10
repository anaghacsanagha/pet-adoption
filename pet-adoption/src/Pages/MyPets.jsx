
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  showConfirm,
  showSuccess,
  showError,
  showWarning,
} from "../utils/sweetAlert";

function MyPets({ onEdit }) {
  const [myPets, setMyPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(
    () => document.querySelector(".pawhaven-app")?.classList.contains("dark-mode") || false
  );

  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("pawhavenUser"));
  } catch {
    user = null;
  }

  const userId = user?.id;

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(
        document.querySelector(".pawhaven-app")?.classList.contains("dark-mode") || false
      );
    });

    const app = document.querySelector(".pawhaven-app");

    if (app) {
      observer.observe(app, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => observer.disconnect();
  }, []);

  const theme = {
    background: isDark ? "#242424" : "#fffaf5",
    card: isDark ? "#303030" : "#ffffff",
    text: isDark ? "#f5eee7" : "#5b3928",
    muted: isDark ? "#c0b5aa" : "#777777",
    border: isDark ? "#4a4a4a" : "#eeeeee",
    empty: isDark ? "#303030" : "#ffffff",
  };

  const fetchMyPets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://pawhaven-server.onrender.com/pets?ownerId=${encodeURIComponent(userId)}`
      );

      if (!response.ok) throw new Error("Failed to fetch pets");

      const data = await response.json();
      setMyPets(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load your pets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetchMyPets();
  }, [userId, navigate]);

  const handleDelete = async (id) => {
    const confirmDelete = await showConfirm(
      "Delete Pet?",
      "Are you sure you want to delete this pet?"
    );

    if (!confirmDelete.isConfirmed) return;

    try {
      const checkResponse = await fetch(
        `https://pawhaven-server.onrender.com/pets/${id}`
      );

      if (!checkResponse.ok) throw new Error("Pet not found");

      const pet = await checkResponse.json();

      if (String(pet.ownerId) !== String(userId)) {
        await showWarning("Not Allowed", "You can only delete your own pets!");
        return;
      }

      const response = await fetch(
        `https://pawhaven-server.onrender.com/pets/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Delete failed");

      setMyPets((previousPets) =>
        previousPets.filter((item) => String(item.id) !== String(id))
      );

      await showSuccess("Pet Deleted!", "Pet deleted successfully.");
    } catch (error) {
      console.error(error);
      await showError("Delete Failed", "Unable to delete pet. Please try again.");
    }
  };

  const buttonStyle = {
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    padding: "11px",
    fontWeight: "500",
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", padding: "50px", color: theme.text }}>
        Loading...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 style={{ textAlign: "center", padding: "50px", color: theme.text }}>
        {error}
      </h2>
    );
  }

  return (
    <div
      style={{
        padding: "40px 5%",
        minHeight: "70vh",
        background: theme.background,
        color: theme.text,
        transition: "all 0.3s ease",
        borderRadius: "12px",
      }}
    >
      <h2 style={{ color: theme.text, marginBottom: "10px" }}>
        My Adoption Posts
      </h2>

      <p style={{ color: theme.muted, marginBottom: "30px" }}>
        Manage the pets you have uploaded to PawHaven.
      </p>

      <button
        onClick={() => navigate("/add-pet")}
        style={{
          ...buttonStyle,
          background: "#5b3928",
          padding: "12px 22px",
          marginBottom: "30px",
        }}
      >
        + Add New Pet
      </button>

      {myPets.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px 10px",
            background: theme.empty,
            color: theme.text,
            borderRadius: "12px",
          }}
        >
          <h3>You haven't uploaded any pets yet.</h3>
          <p style={{ color: theme.muted }}>
            Upload your first pet and help it find a loving home!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "25px",
          }}
        >
          {myPets.map((pet) => (
            <div
              key={pet.id}
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: "12px",
                overflow: "hidden",
                background: theme.card,
                color: theme.text,
                boxShadow: isDark
                  ? "0 3px 12px rgba(0,0,0,0.3)"
                  : "0 3px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
              }}
            >
              <img
                src={pet.image || "https://placehold.co/400x250?text=Pet"}
                alt={pet.name}
                style={{
                  width: "100%",
                  height: "210px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "16px" }}>
                <h3 style={{ color: theme.text, marginBottom: "8px" }}>
                  {pet.name}
                </h3>

                <p>Type: {pet.type}</p>
                <p>Breed: {pet.breed}</p>
                <p>Age: {pet.age}</p>
                <p>Location: {pet.location}</p>
                <p>Status: {pet.status || "Available"}</p>

                <button
                  onClick={() => navigate(`/pet/${pet.id}`)}
                  style={{
                    ...buttonStyle,
                    width: "100%",
                    background: "#765846",
                    marginTop: "8px",
                    marginBottom: "10px",
                  }}
                >
                  View More
                </button>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => onEdit(pet.id)}
                    style={{
                      ...buttonStyle,
                      flex: 1,
                      background: "#2e7d32",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(pet.id)}
                    style={{
                      ...buttonStyle,
                      flex: 1,
                      background: "#c62828",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPets;

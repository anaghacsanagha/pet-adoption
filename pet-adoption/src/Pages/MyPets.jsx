
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

  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("pawhavenUser"));
  } catch {
    user = null;
  }

  const userId = user?.id;

  const fetchMyPets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:3000/pets?ownerId=${encodeURIComponent(userId)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pets");
      }

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
        `http://localhost:3000/pets/${id}`
      );

      if (!checkResponse.ok) {
        throw new Error("Pet not found");
      }

      const pet = await checkResponse.json();

      if (String(pet.ownerId) !== String(userId)) {
        await showWarning(
          "Not Allowed",
          "You can only delete your own pets!"
        );
        return;
      }

      const response = await fetch(
        `http://localhost:3000/pets/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setMyPets((previousPets) =>
        previousPets.filter(
          (item) => String(item.id) !== String(id)
        )
      );

      await showSuccess(
        "Pet Deleted!",
        "Pet deleted successfully."
      );
    } catch (error) {
      console.error(error);
      await showError(
        "Delete Failed",
        "Unable to delete pet. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", padding: "50px" }}>
        Loading...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 style={{ textAlign: "center", padding: "50px" }}>
        {error}
      </h2>
    );
  }

  return (
    <div style={{ padding: "40px 5%", minHeight: "70vh" }}>
      <h2 style={{ color: "#5b3928", marginBottom: "10px" }}>
        My Adoption Posts
      </h2>

      <p style={{ color: "#777", marginBottom: "30px" }}>
        Manage the pets you have uploaded to PawHaven.
      </p>

      <button
        onClick={() => navigate("/add-pet")}
        style={{
          background: "#5b3928",
          color: "white",
          padding: "12px 22px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "30px",
        }}
      >
        + Add New Pet
      </button>

      {myPets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 10px" }}>
          <h3>You haven't uploaded any pets yet.</h3>
          <p>
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
                border: "1px solid #eee",
                borderRadius: "12px",
                overflow: "hidden",
                background: "white",
                boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src={
                  pet.image ||
                  "https://placehold.co/400x250?text=Pet"
                }
                alt={pet.name}
                style={{
                  width: "100%",
                  height: "210px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "16px" }}>
                <h3 style={{ color: "#5b3928", marginBottom: "8px" }}>
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
                    width: "100%",
                    padding: "11px",
                    background: "#765846",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
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
                      flex: 1,
                      padding: "10px",
                      background: "#2e7d32",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(pet.id)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "#c62828",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
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

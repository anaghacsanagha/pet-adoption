
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../Components/SectionTitle";
import {
  showConfirm,
  showSuccess,
  showError,
} from "../utils/sweetAlert";

const API = "https://pawhaven-server.onrender.com";

function MyAdoptions() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("pawhavenUser") || "null"
  );

  const fetchAdoptions = async () => {
    if (!user) {
      setAdoptions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [adoptionRes, petRes, userRes] = await Promise.all([
        fetch(`${API}/adoptions`),
        fetch(`${API}/pets`),
        fetch(`${API}/users`),
      ]);

      if (!adoptionRes.ok || !petRes.ok || !userRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const adoptionData = await adoptionRes.json();
      const petData = await petRes.json();
      const userData = await userRes.json();

      // Get only requests submitted by the logged-in user.
      // Reverse database order: latest POST appears first.
      const userAdoptions = adoptionData
        .filter((item) => {
          const applicantId = item.applicantId || item.userId;

          return (
            String(applicantId) === String(user.id) ||
            item.applicantEmail === user.email ||
            item.userEmail === user.email
          );
        })
        .reverse();

      const updatedAdoptions = userAdoptions.map((item) => {
        const pet = petData.find(
          (p) => String(p.id) === String(item.petId)
        );

        const ownerId =
          item.ownerId || pet?.ownerId || pet?.userId;

        const owner = userData.find(
          (u) => String(u.id) === String(ownerId)
        );

        return {
          ...item,
          petImage: item.petImage || pet?.image,
          petName: item.petName || pet?.name,
          ownerName:
            item.ownerName || pet?.ownerName || owner?.name,
          ownerPhone: item.ownerPhone || owner?.phone,
        };
      });

      setAdoptions(updatedAdoptions);
    } catch (error) {
      console.error("Error fetching adoptions:", error);
      setAdoptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const cancelRequest = async (id) => {
    const result = await showConfirm(
      "Cancel Adoption Request?",
      "Are you sure you want to cancel this request?"
    );

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${API}/adoptions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel request");
      }

      setAdoptions((previous) =>
        previous.filter(
          (item) => String(item.id) !== String(id)
        )
      );

      await showSuccess(
        "Request cancelled successfully!"
      );
    } catch (error) {
      console.error("Cancel error:", error);
      await showError(
        "Unable to cancel request. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        Loading your adoption requests...
      </div>
    );
  }

  return (
    <div className="my-adoptions-page">
      <div className="container">
        <SectionTitle
          subtitle="YOUR ADOPTION JOURNEY"
          title="My Adoptions"
          description="Track all your pet adoption applications here."
        />

        {adoptions.length > 0 ? (
          <div className="my-adoptions-list">
            {adoptions.map((item) => {
              const status = item.status || "Pending";
              const accepted = status === "Accepted";

              return (
                <div className="my-adoption-card" key={item.id}>
                  <img
                    src={
                      item.petImage ||
                      "https://placehold.co/300x300?text=Pet"
                    }
                    alt={item.petName || "Pet"}
                  />

                  <div className="my-adoption-content">
                    <h3>{item.petName}</h3>

                    <p>
                      Application Date: {item.date || "Not available"}
                    </p>

                    <p>
                      Applicant:{" "}
                      {item.applicantName ||
                        item.userName ||
                        item.formData?.fullName ||
                        user?.name}
                    </p>

                    <div className="my-adoption-status-row">
                      <span>Status</span>

                      <strong
                        className={`adoption-status ${status.toLowerCase()}`}
                      >
                        {status}
                      </strong>
                    </div>

                    {accepted && (
                      <div className="mt-3 p-3 rounded border">
                        <h5>Pet Owner Contact</h5>

                        <p className="mb-1">
                          <strong>Name:</strong>{" "}
                          {item.ownerName || "Pet Owner"}
                        </p>

                        <p className="mb-0">
                          <strong>Phone:</strong>{" "}
                          {item.ownerPhone ? (
                            <a href={`tel:${item.ownerPhone}`}>
                              {item.ownerPhone}
                            </a>
                          ) : (
                            "Owner has not added a phone number"
                          )}
                        </p>
                      </div>
                    )}

                    {status === "Pending" && (
                      <button
                        className="adoption-cancel-btn"
                        onClick={() => cancelRequest(item.id)}
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="my-adoptions-empty">
            <div className="my-adoptions-icon">🐾</div>

            <h3>No Adoption Requests Yet</h3>

            <p>
              You haven't submitted any adoption applications.
              Find a lovely pet and start your adoption journey!
            </p>

            <Link
              to="/pets"
              className="my-adoptions-browse-btn"
            >
              Find a Pet
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAdoptions;


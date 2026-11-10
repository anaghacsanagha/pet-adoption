
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
  const [isDark, setIsDark] = useState(
    document.querySelector(".pawhaven-app")?.classList.contains("dark-mode") || false
  );

  const user = JSON.parse(
    localStorage.getItem("pawhavenUser") || "null"
  );

  // Detect dark/light mode changes
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
    border: isDark ? "#494949" : "#eadfd5",
    soft: isDark ? "#353535" : "#f8f3ed",
    green: isDark ? "#9bbd98" : "#789477",
    link: isDark ? "#a8cfa5" : "#567b55",
  };

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

      await showSuccess("Request cancelled successfully!");
    } catch (error) {
      console.error("Cancel error:", error);
      await showError(
        "Unable to cancel request. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div
        className="text-center py-5"
        style={{
          background: theme.page,
          color: theme.text,
          minHeight: "300px",
        }}
      >
        Loading your adoption requests...
      </div>
    );
  }

  return (
    <div
      className="my-adoptions-page"
      style={{
        background: theme.page,
        color: theme.text,
        minHeight: "100%",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <style>{`
        .my-adoptions-page .my-adoption-card {
          background: ${theme.card} !important;
          border: 1px solid ${theme.border} !important;
          color: ${theme.text} !important;
          transition: 0.3s;
        }

        .my-adoptions-page .my-adoption-content h3,
        .my-adoptions-page .my-adoption-content h5 {
          color: ${theme.text} !important;
        }

        .my-adoptions-page .my-adoption-content p,
        .my-adoptions-page .my-adoption-status-row span {
          color: ${theme.muted} !important;
        }

        .my-adoptions-page .my-adoption-card a {
          color: ${theme.link} !important;
        }

        .my-adoptions-page .my-adoption-card .owner-contact {
          background: ${theme.soft} !important;
          border-color: ${theme.border} !important;
          color: ${theme.text} !important;
        }

        .my-adoptions-page .my-adoption-card .owner-contact p,
        .my-adoptions-page .my-adoption-card .owner-contact strong {
          color: ${theme.text} !important;
        }

        .my-adoptions-page .my-adoptions-empty {
          background: ${theme.card} !important;
          border-color: ${theme.border} !important;
          color: ${theme.text} !important;
        }

        .my-adoptions-page .my-adoptions-empty h3 {
          color: ${theme.text} !important;
        }

        .my-adoptions-page .my-adoptions-empty p {
          color: ${theme.muted} !important;
        }

        .my-adoptions-page .adoption-cancel-btn {
          background: #c75b5b !important;
          color: #ffffff !important;
        }

        .my-adoptions-page .my-adoptions-browse-btn {
          background: ${theme.green} !important;
          color: #ffffff !important;
        }
      `}</style>

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
                      <div
                        className="owner-contact mt-3 p-3 rounded border"
                        style={{
                          background: theme.soft,
                          borderColor: theme.border,
                          color: theme.text,
                        }}
                      >
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

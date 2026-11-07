
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../Components/SectionTitle";

function MyAdoptions() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("pawhavenUser"));

  // Fetch logged-in user's adoption requests
  useEffect(() => {
    const fetchAdoptions = async () => {
      if (!user?.email) {
        setAdoptions([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/adoptions"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch adoption requests");
        }

        const data = await response.json();

        const userAdoptions = data.filter(
          (item) => item.userEmail === user.email
        );

        setAdoptions(userAdoptions);
      } catch (error) {
        console.error("Error fetching adoptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptions();
  }, [user?.email]);

  // Cancel adoption request
  const cancelRequest = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this request?"
    );

    if (!confirmCancel) return;

    try {
      const response = await fetch(
        `http://localhost:3000/adoptions/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel request");
      }

      setAdoptions((previous) =>
        previous.filter((item) => item.id !== id)
      );

      alert("Adoption request cancelled successfully!");
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Unable to cancel request. Please try again.");
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
            {adoptions.map((item) => (
              <div className="my-adoption-card" key={item.id}>
                <img
                  src={item.petImage}
                  alt={item.petName}
                />

                <div className="my-adoption-content">
                  <h3>{item.petName}</h3>

                  <p>
                    Application Date: {item.date}
                  </p>

                  <p>
                    Applicant: {item.formData?.fullName}
                  </p>

                  <div className="my-adoption-status-row">
                    <span>Status</span>

                    <strong
                      className={`adoption-status ${item.status?.toLowerCase()}`}
                    >
                      {item.status}
                    </strong>
                  </div>

                  {item.status === "Pending" && (
                    <button
                      className="adoption-cancel-btn"
                      onClick={() => cancelRequest(item.id)}
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            ))}
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

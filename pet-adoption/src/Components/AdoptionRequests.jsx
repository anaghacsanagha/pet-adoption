
import React, { useEffect, useState } from "react";
import {
  showSuccess,
  showError,
} from "../utils/sweetAlert";

const API = "http://localhost:3000";

function AdoptionRequests() {
  const user = JSON.parse(
    localStorage.getItem("pawhavenUser") || "null"
  );

  const userId = user?.id || user?._id;
  const userEmail = user?.email?.toLowerCase();

  const [requests, setRequests] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const [requestRes, petRes, userRes] = await Promise.all([
        fetch(`${API}/adoptions`),
        fetch(`${API}/pets`),
        fetch(`${API}/users`),
      ]);

      if (!requestRes.ok || !petRes.ok || !userRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const requestData = await requestRes.json();
      const petData = await petRes.json();
      const userData = await userRes.json();

      setPets(petData);

      const myPets = petData.filter((pet) => {
        const ownerId = pet.ownerId || pet.userId;
        const ownerEmail = pet.ownerEmail?.toLowerCase();

        const owner = userData.find(
          (item) =>
            String(item.id || item._id) === String(ownerId)
        );

        return (
          (ownerId && String(ownerId) === String(userId)) ||
          (ownerEmail && ownerEmail === userEmail) ||
          (owner &&
            userEmail &&
            owner.email?.toLowerCase() === userEmail)
        );
      });

      const myPetIds = myPets.map((pet) => String(pet.id));

      const ownerRequests = requestData.filter((request) => {
        const pet = petData.find(
          (item) => String(item.id) === String(request.petId)
        );

        if (!pet) return false;

        const petOwnerId = pet.ownerId || pet.userId;
        const requestOwnerId = request.ownerId;
        const ownerId = petOwnerId || requestOwnerId;

        const owner = userData.find(
          (item) =>
            String(item.id || item._id) === String(ownerId)
        );

        return (
          myPetIds.includes(String(request.petId)) ||
          (ownerId && String(ownerId) === String(userId)) ||
          (owner &&
            userEmail &&
            owner.email?.toLowerCase() === userEmail)
        );
      });

      setRequests(ownerRequests);

      console.log("Logged-in user:", user);
      console.log("My pets:", myPets);
      console.log("Requests for my pets:", ownerRequests);
    } catch (error) {
      console.error("Adoption requests error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (request, status) => {
    try {
      setUpdatingId(request.id);

      const response = await fetch(
        `${API}/adoptions/${request.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      if (status === "Accepted") {
        const allRes = await fetch(`${API}/adoptions`);

        if (!allRes.ok) {
          throw new Error("Unable to fetch other requests");
        }

        const allRequests = await allRes.json();

        const otherRequests = allRequests.filter(
          (item) =>
            String(item.petId) === String(request.petId) &&
            String(item.id) !== String(request.id) &&
            item.status === "Pending"
        );

        await Promise.all(
          otherRequests.map((item) =>
            fetch(`${API}/adoptions/${item.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: "Declined" }),
            })
          )
        );
      }

      await showSuccess(
        `Request ${status.toLowerCase()} successfully!`
      );

      await fetchRequests();
    } catch (error) {
      console.error("Update error:", error);

      await showError(
        "Unable to update request. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <h4 className="text-center mt-5">
        Loading requests...
      </h4>
    );
  }

  if (!userId && !userEmail) {
    return (
      <div className="text-center py-5">
        <h5>Please login to view adoption requests.</h5>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Adoption Requests</h2>

      {requests.length === 0 ? (
        <div className="text-center py-5">
          <h5>No adoption requests received yet.</h5>
          <p className="text-muted">
            Requests from people interested in your pets will appear here.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {requests.map((request) => {
            const pet = pets.find(
              (item) => String(item.id) === String(request.petId)
            );

            const applicantName =
              request.applicantName ||
              request.userName ||
              request.formData?.fullName ||
              "Unknown";

            const applicantEmail =
              request.applicantEmail ||
              request.userEmail ||
              request.formData?.email ||
              "";

            const applicantPhone =
              request.applicantPhone ||
              request.formData?.phone ||
              "";

            const status = request.status || "Pending";

            return (
              <div className="col-md-6" key={request.id}>
                <div className="card h-100 shadow-sm p-3">
                  <div className="d-flex gap-3 align-items-center mb-3">
                    {pet?.image && (
                      <img
                        src={pet.image}
                        alt={pet.name}
                        style={{
                          width: "110px",
                          height: "110px",
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                    )}

                    <div>
                      <h5>{request.petName || pet?.name}</h5>

                      <p className="mb-1">
                        Applicant: {applicantName}
                      </p>

                      <span
                        className={`badge ${
                          status === "Accepted"
                            ? "bg-success"
                            : status === "Declined"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>

                  <hr />

                  <p>
                    <strong>Email:</strong> {applicantEmail}
                  </p>

                  {status === "Accepted" && (
                    <div className="alert alert-success">
                      <strong>Applicant Contact Number:</strong>
                      <p className="mb-0">
                        {applicantPhone ? (
                          <a href={`tel:${applicantPhone}`}>
                            {applicantPhone}
                          </a>
                        ) : (
                          "No phone number provided"
                        )}
                      </p>
                    </div>
                  )}

                  <p>
                    <strong>Address:</strong>{" "}
                    {request.formData?.address || "Not provided"}
                  </p>

                  <p>
                    <strong>Living Type:</strong>{" "}
                    {request.formData?.livingType || "Not provided"}
                  </p>

                  <p>
                    <strong>Experience:</strong>{" "}
                    {request.formData?.experience || "Not provided"}
                  </p>

                  <p>
                    <strong>Reason:</strong>{" "}
                    {request.formData?.reason || "Not provided"}
                  </p>

                  <p>
                    <strong>Request Date:</strong>{" "}
                    {request.date || "Not available"}
                  </p>

                  {status === "Pending" && (
                    <div className="d-flex gap-2 mt-3">
                      <button
                        className="btn btn-success"
                        disabled={updatingId === request.id}
                        onClick={() =>
                          updateStatus(request, "Accepted")
                        }
                      >
                        {updatingId === request.id
                          ? "Updating..."
                          : "Accept"}
                      </button>

                      <button
                        className="btn btn-danger"
                        disabled={updatingId === request.id}
                        onClick={() =>
                          updateStatus(request, "Declined")
                        }
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdoptionRequests;

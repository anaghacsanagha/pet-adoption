
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { pets as defaultPets } from "../data/pets";
import {
  showSuccess,
  showWarning,
  showError,
} from "../utils/sweetAlert";
import "./PetDetails.css";

function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [uploadedReports, setUploadedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch pet details
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/pets/${id}`
        );

        if (response.ok) {
          const data = await response.json();
          setPet(data);
        } else {
          const staticPet = defaultPets.find(
            (item) => String(item.id) === String(id)
          );

          setPet(staticPet || null);
        }
      } catch (error) {
        console.error("Pet Fetch Error:", error);

        const staticPet = defaultPets.find(
          (item) => String(item.id) === String(id)
        );

        setPet(staticPet || null);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  // Check wishlist status
  useEffect(() => {
    const checkWishlist = () => {
      const savedWishlist = JSON.parse(
        localStorage.getItem("pawhavenWishlist") || "[]"
      );

      const exists = savedWishlist.some(
        (item) => String(item.id ?? item) === String(id)
      );

      setIsWishlisted(exists);
    };

    checkWishlist();

    window.addEventListener("wishlistUpdated", checkWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", checkWishlist);
    };
  }, [id]);

  // Fetch uploaded health reports
  useEffect(() => {
    const fetchUploadedReports = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/petDocuments"
        );

        if (!response.ok) {
          throw new Error("Unable to fetch uploaded reports.");
        }

        const data = await response.json();

        const petReports = data.filter(
          (report) => String(report.petId) === String(id)
        );

        setUploadedReports(petReports);
      } catch (error) {
        console.error("Uploaded Reports Error:", error);
      } finally {
        setReportsLoading(false);
      }
    };

    fetchUploadedReports();
  }, [id]);

  // Add to Wishlist
  const addToWishlist = async () => {
    if (!pet) return;

    const savedWishlist = JSON.parse(
      localStorage.getItem("pawhavenWishlist") || "[]"
    );

    const alreadyAdded = savedWishlist.some(
      (item) => String(item.id ?? item) === String(pet.id)
    );

    if (alreadyAdded) {
      setIsWishlisted(true);

      await showWarning(
        "Already in Wishlist",
        "This pet is already in your wishlist!"
      );

      return;
    }

    const updatedWishlist = [...savedWishlist, pet];

    localStorage.setItem(
      "pawhavenWishlist",
      JSON.stringify(updatedWishlist)
    );

    setIsWishlisted(true);

    window.dispatchEvent(new Event("wishlistUpdated"));

    await showSuccess(
      "Added to Wishlist!",
      `${pet.name} has been added to your wishlist.`
    );
  };

  // Convert uploaded Data URL into Blob URL
  const createReportURL = (report) => {
    if (!report.fileData) {
      throw new Error("Report file is not available.");
    }

    const parts = report.fileData.split(",");

    if (parts.length < 2) {
      throw new Error("Invalid report file.");
    }

    const mimeMatch = parts[0].match(/:(.*?);/);

    if (!mimeMatch) {
      throw new Error("Invalid file format.");
    }

    const mimeType = mimeMatch[1];
    const byteCharacters = atob(parts[1]);
    const byteNumbers = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteNumbers], {
      type: mimeType,
    });

    return URL.createObjectURL(blob);
  };

  // View uploaded report
  const viewReport = async (report) => {
    let newWindow = null;

    try {
      newWindow = window.open("about:blank", "_blank");

      if (!newWindow) {
        await showWarning(
          "Pop-up Blocked",
          "Please allow pop-ups to view the report."
        );
        return;
      }

      if (!report.fileData) {
        newWindow.close();

        await showError(
          "File Not Available",
          "Report file is not available."
        );
        return;
      }

      const fileURL = createReportURL(report);

      newWindow.location.href = fileURL;

      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 60000);
    } catch (error) {
      console.error("View Report Error:", error);

      if (newWindow && !newWindow.closed) {
        newWindow.close();
      }

      await showError(
        "Unable to Open Report",
        "Please download the report instead."
      );
    }
  };

  // Download uploaded report
  const downloadReport = async (report) => {
    try {
      if (!report.fileData) {
        await showError(
          "File Not Available",
          "Report file is not available."
        );
        return;
      }

      const fileURL = createReportURL(report);
      const link = document.createElement("a");

      link.href = fileURL;
      link.download = report.fileName || "Pet_Report";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 1000);
    } catch (error) {
      console.error("Download Report Error:", error);

      await showError(
        "Download Failed",
        "Unable to download this report."
      );
    }
  };

  // Download all uploaded reports
  const downloadAllReports = async () => {
    if (uploadedReports.length === 0) {
      await showWarning(
        "No Reports",
        "No uploaded reports available."
      );
      return;
    }

    uploadedReports.forEach((report, index) => {
      setTimeout(() => {
        downloadReport(report);
      }, index * 1000);
    });
  };

  if (loading) {
    return (
      <div className="pet-not-found">
        <h2>Loading Pet Details...</h2>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="pet-not-found">
        <h2>Pet Not Found</h2>
        <p>Sorry, this pet is not available.</p>

        <Link to="/pets" className="pet-back-btn">
          Browse Pets
        </Link>
      </div>
    );
  }

  return (
    <div className="pet-details-page">
      <div className="container pet-details-container">

        <button
          className="pet-back-link"
          onClick={() => navigate("/pets")}
        >
          ← Back to Pets
        </button>

        <div className="row align-items-center g-5">

          <div className="col-lg-6">
            <div className="pet-details-image">
              <img src={pet.image} alt={pet.name} />

              <span className="pet-details-status">
                {pet.status || "Available"}
              </span>
            </div>
          </div>

          <div className="col-lg-6">
            <p className="pet-details-subtitle">
              MEET YOUR NEW BEST FRIEND
            </p>

            <h1>{pet.name}</h1>

            <p className="pet-details-breed">{pet.breed}</p>

            <p className="pet-details-about">{pet.about}</p>

            <div className="pet-details-info">

              <div>
                <span>Age</span>
                <strong>{pet.age}</strong>
              </div>

              <div>
                <span>Gender</span>
                <strong>{pet.gender}</strong>
              </div>

              <div>
                <span>Type</span>
                <strong>{pet.type}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{pet.location}</strong>
              </div>

              <div>
                <span>Vaccinated</span>
                <strong>
                  {pet.vaccinated === true ||
                  pet.vaccinated === "Yes"
                    ? "Yes"
                    : "No"}
                </strong>
              </div>

            </div>

            <div className="pet-details-personality">
              <h5>Personality</h5>

              <p>
                {Array.isArray(pet.personality)
                  ? pet.personality.join(" • ")
                  : pet.personality}
              </p>
            </div>

            <div className="pet-details-actions">

              <button
                className="pet-adopt-btn"
                onClick={() => navigate(`/adopt/${pet.id}`)}
              >
                Adopt Me
              </button>

              <button
                className={`pet-wishlist-btn ${
                  isWishlisted ? "wishlisted" : ""
                }`}
                onClick={addToWishlist}
              >
                <span>{isWishlisted ? "♥" : "♡"}</span>
                {isWishlisted
                  ? "Added to Wishlist"
                  : "Add to Wishlist"}
              </button>

            </div>
          </div>
        </div>

        {/* Uploaded Health Reports */}
        <section className="pet-health-section">

          <div className="pet-health-heading">
            <div>
              <p className="pet-details-subtitle">
                HEALTH & WELLNESS
              </p>

              <h2>Uploaded Health Reports</h2>

              <p>
                Medical documents and reports uploaded for {pet.name}.
              </p>
            </div>

            {uploadedReports.length > 0 && (
              <button
                className="health-download-btn"
                onClick={downloadAllReports}
              >
                📥 Download All Reports
              </button>
            )}
          </div>

          {reportsLoading ? (
            <p className="health-message">
              Loading uploaded reports...
            </p>
          ) : uploadedReports.length > 0 ? (

            <div className="row g-4">

              {uploadedReports.map((report) => (

                <div
                  className="col-md-6 col-lg-4"
                  key={report.id}
                >
                  <div className="health-record-card">

                    <div className="health-record-icon">
                      {report.fileName?.toLowerCase().endsWith(".pdf")
                        ? "📄"
                        : "🖼️"}
                    </div>

                    <h4>
                      {report.fileName || "Pet Report"}
                    </h4>

                    <p>
                      <strong>Document Type:</strong>{" "}
                      {report.documentType || "Pet Document"}
                    </p>

                    <p>
                      <strong>Uploaded:</strong>{" "}
                      {report.uploadedAt
                        ? new Date(report.uploadedAt).toLocaleDateString()
                        : "N/A"}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginTop: "18px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => viewReport(report)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          border: "none",
                          borderRadius: "7px",
                          background: "#765846",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        👁 View
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadReport(report)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          border: "none",
                          borderRadius: "7px",
                          background: "#2e7d32",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        ⬇ Download
                      </button>
                    </div>

                  </div>
                </div>

              ))}

            </div>

          ) : (

            <p className="health-message">
              No uploaded reports available for {pet.name}.
              Please upload documents from Pet Documents.
            </p>

          )}

        </section>

      </div>
    </div>
  );
}

export default PetDetails;

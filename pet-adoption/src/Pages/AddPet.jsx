
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  showSuccess,
  showError,
  showWarning,
} from "../utils/sweetAlert";

const API = "http://localhost:3000";

function AddPet() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("pawhavenUser") || "null"
  );

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "Male",
    location: "",
    vaccinated: "No",
    personality: "",
    about: "",
  });

  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [documents, setDocuments] = useState({
    vaccinationCertificate: null,
    healthReport: null,
    petLicense: null,
    otherDocument: null,
  });

  const documentFields = [
    {
      name: "vaccinationCertificate",
      label: "Vaccination Certificate",
      icon: "💉",
    },
    {
      name: "healthReport",
      label: "Medical / Health Report",
      icon: "🩺",
    },
    {
      name: "petLicense",
      label: "Pet License",
      icon: "📋",
    },
    {
      name: "otherDocument",
      label: "Other Documents",
      icon: "📄",
    },
  ];

  // Read file as Base64
  const readFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);

      reader.onerror = () =>
        reject(new Error(`Unable to read ${file.name}`));

      reader.readAsDataURL(file);
    });

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Pet image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showWarning("Invalid Image", "Please select a valid pet image.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showWarning("Image Too Large", "Pet image size should be below 2 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      setError("");
    };

    reader.onerror = () => {
      showError("Upload Failed", "Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  // Document upload selection
  const handleDocumentChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      showWarning(
        "Invalid Document",
        "Only PDF, JPG, PNG and WEBP files are allowed."
      );
      e.target.value = "";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showWarning(
        "File Too Large",
        "Each document should be below 3 MB."
      );
      e.target.value = "";
      return;
    }

    setDocuments((previous) => ({
      ...previous,
      [name]: file,
    }));
  };

  // Remove selected document
  const removeDocument = (documentType) => {
    setDocuments((previous) => ({
      ...previous,
      [documentType]: null,
    }));

    const input = document.querySelector(
      `input[name="${documentType}"]`
    );

    if (input) {
      input.value = "";
    }
  };

  // Save pet and attached documents
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      showWarning(
        "Login Required",
        "Please login again to upload a pet."
      );
      return;
    }

    if (!image) {
      showWarning(
        "Pet Image Required",
        "Please select a pet image."
      );
      return;
    }

    if (
      formData.age === "" ||
      !Number.isFinite(Number(formData.age)) ||
      Number(formData.age) < 0
    ) {
      showWarning("Invalid Age", "Please enter a valid pet age.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const newPet = {
        ...formData,
        age: Number(formData.age),
        vaccinated: formData.vaccinated === "Yes",

        personality: formData.personality
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        image,
        status: "Available",
        ownerId: user.id,
        ownerName: user.name || user.username || "Pet Owner",
        uploadedBy: "user",
      };

      // Save pet
      const response = await fetch(`${API}/pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPet),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Pet upload failed (${response.status}): ${errorText}`
        );
      }

      const savedPet = await response.json();

      // Upload selected documents
      const selectedDocuments = Object.entries(documents).filter(
        ([, file]) => file !== null
      );

      const failedUploads = [];

      for (const [documentType, file] of selectedDocuments) {
        try {
          const fileData = await readFile(file);

          const documentData = {
            petId: savedPet.id,
            petName: savedPet.name,
            ownerId: user.id,
            documentType,
            fileName: file.name,
            fileData,
            uploadedAt: new Date().toISOString(),
          };

          const documentResponse = await fetch(
            `${API}/petDocuments`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(documentData),
            }
          );

          if (!documentResponse.ok) {
            const responseText = await documentResponse.text();

            throw new Error(
              `${file.name}: HTTP ${documentResponse.status} ${responseText}`
            );
          }
        } catch (uploadError) {
          console.error("Document upload failed:", uploadError);
          failedUploads.push(uploadError.message);
        }
      }

      if (failedUploads.length > 0) {
        await showWarning(
          "Pet Added Successfully",
          "Pet details were saved, but some documents could not be uploaded: " +
            failedUploads.join(" | ")
        );

        navigate("/dashboard");
        return;
      }

      await showSuccess(
        "Pet Added Successfully! 🐾",
        selectedDocuments.length > 0
          ? "Your pet and documents have been uploaded successfully."
          : "Your pet has been added successfully."
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Add Pet Error:", err);

      setError(
        err.message || "Pet upload failed. Please try again."
      );

      showError(
        "Upload Failed",
        err.message || "Unable to add your pet."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #e5d6cc",
    borderRadius: "8px",
    marginTop: "7px",
    fontSize: "15px",
    boxSizing: "border-box",
    background: "#fffdfb",
  };

  const labelStyle = {
    display: "block",
    fontWeight: "600",
    marginBottom: "17px",
    color: "#765846",
  };

  return (
    <div
      style={{
        background: "#FFF8F3",
        minHeight: "100vh",
        padding: "35px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "750px",
          margin: "auto",
          background: "#fff",
          padding: "35px",
          borderRadius: "15px",
          boxShadow: "0 5px 25px rgba(120,85,65,0.07)",
          border: "1px solid #F1E5DD",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            border: "none",
            background: "#F3E5DC",
            color: "#765846",
            padding: "10px 17px",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          ← Back to Dashboard
        </button>

        <h1
          style={{
            textAlign: "center",
            color: "#765846",
            marginBottom: "10px",
          }}
        >
          Add Your Pet 🐾
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#A18472",
            marginBottom: "30px",
          }}
        >
          Share your pet with people looking for a loving companion.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Pet Image */}
          <label style={labelStyle}>
            Pet Image *

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={inputStyle}
              required
            />
          </label>

          {image && (
            <img
              src={image}
              alt="Pet preview"
              style={{
                width: "180px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            />
          )}

          {/* Pet Name */}
          <label style={labelStyle}>
            Pet Name *

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter pet name"
              style={inputStyle}
              required
            />
          </label>

          {/* Pet Type */}
          <label style={labelStyle}>
            Pet Type *

            <input
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Dog, Cat, Rabbit, Parrot..."
              style={inputStyle}
              required
            />
          </label>

          {/* Breed */}
          <label style={labelStyle}>
            Breed *

            <input
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder="Enter breed"
              style={inputStyle}
              required
            />
          </label>

          {/* Age */}
          <label style={labelStyle}>
            Age *

            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter pet age"
              min="0"
              step="1"
              style={inputStyle}
              required
            />
          </label>

          {/* Gender */}
          <label style={labelStyle}>
            Gender *

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          {/* Location */}
          <label style={labelStyle}>
            Location *

            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter city or location"
              style={inputStyle}
              required
            />
          </label>

          {/* Vaccination */}
          <label style={labelStyle}>
            Vaccination Status *

            <select
              name="vaccinated"
              value={formData.vaccinated}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Yes">Vaccinated</option>
              <option value="No">Not Vaccinated</option>
            </select>
          </label>

          {/* Personality */}
          <label style={labelStyle}>
            Personality

            <input
              name="personality"
              value={formData.personality}
              onChange={handleChange}
              placeholder="Friendly, Playful, Calm"
              style={inputStyle}
            />
          </label>

          {/* About */}
          <label style={labelStyle}>
            About Your Pet *

            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell us about your pet..."
              rows="5"
              style={inputStyle}
              required
            />
          </label>

          {/* Pet Documents */}
          <div
            style={{
              marginTop: "30px",
              padding: "22px",
              background: "#FFF8F3",
              border: "1px solid #EAD8CC",
              borderRadius: "12px",
            }}
          >
            <h2
              style={{
                color: "#765846",
                marginTop: 0,
                fontSize: "21px",
              }}
            >
              📁 Pet Documents
            </h2>

            <p
              style={{
                color: "#A18472",
                fontSize: "14px",
                marginBottom: "22px",
              }}
            >
              Upload certificates and other documents related to your pet.
              All documents are optional.
            </p>

            {documentFields.map((field) => (
              <div
                key={field.name}
                style={{ marginBottom: "22px" }}
              >
                <label style={labelStyle}>
                  {field.icon} {field.label} (Optional)

                  <input
                    type="file"
                    name={field.name}
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleDocumentChange}
                    style={inputStyle}
                  />
                </label>

                {documents[field.name] && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      background: "#F0F7F0",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      marginTop: "-10px",
                    }}
                  >
                    <p
                      style={{
                        color: "#63866b",
                        fontSize: "13px",
                        margin: 0,
                        overflowWrap: "anywhere",
                        flex: 1,
                      }}
                    >
                      ✓ {documents[field.name].name}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeDocument(field.name)}
                      title="Remove selected document"
                      style={{
                        width: "28px",
                        height: "28px",
                        border: "none",
                        borderRadius: "50%",
                        background: "#FCE4E4",
                        color: "#C0392B",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ))}

            <p
              style={{
                fontSize: "12px",
                color: "#A18472",
                marginBottom: 0,
              }}
            >
              Accepted formats: PDF, JPG, PNG, WEBP.
              Maximum 3 MB per document.
            </p>
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                color: "#c0392b",
                background: "#fff0ed",
                padding: "12px",
                borderRadius: "8px",
                margin: "15px 0",
                overflowWrap: "anywhere",
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "20px",
              background: "#D9B8A7",
              color: "#604735",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Uploading..." : "Upload Pet for Adoption"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPet;

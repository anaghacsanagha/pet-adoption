
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  showSuccess,
  showError,
  showWarning,
} from "../utils/sweetAlert";

const API = "https://pawhaven-server.onrender.com";

function AddPet() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("pawhavenUser") || "null"
  );

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
    page: isDark ? "#181818" : "#FFF8F3",
    card: isDark ? "#292929" : "#ffffff",
    text: isDark ? "#f5f0eb" : "#765846",
    muted: isDark ? "#c0b8b0" : "#A18472",
    input: isDark ? "#353535" : "#fffdfb",
    border: isDark ? "#505050" : "#e5d6cc",
    soft: isDark ? "#353535" : "#FFF8F3",
    button: isDark ? "#789477" : "#D9B8A7",
    buttonText: isDark ? "#ffffff" : "#604735",
    selected: isDark ? "#29432e" : "#F0F7F0",
    selectedText: isDark ? "#b7d9b5" : "#63866b",
  };

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

  const readFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () =>
        reject(new Error(`Unable to read ${file.name}`));

      reader.readAsDataURL(file);
    });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

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
    border: `1px solid ${theme.border}`,
    borderRadius: "8px",
    marginTop: "7px",
    marginBottom: "0",
    fontSize: "15px",
    boxSizing: "border-box",
    background: theme.input,
    color: theme.text,
    colorScheme: isDark ? "dark" : "light",
    outline: "none",
    transition: "0.3s",
  };

  const labelStyle = {
    display: "block",
    fontWeight: "600",
    marginBottom: "17px",
    color: theme.text,
  };

  return (
    <div
      style={{
        background: theme.page,
        minHeight: "100vh",
        padding: "35px 20px",
        color: theme.text,
        transition: "0.3s",
      }}
    >
      <style>{`
        .add-pet-form input::placeholder,
        .add-pet-form textarea::placeholder {
          color: ${theme.muted};
          opacity: 0.8;
        }

        .add-pet-form input,
        .add-pet-form textarea,
        .add-pet-form select {
          color: ${theme.text} !important;
        }

        .add-pet-form input:focus,
        .add-pet-form textarea:focus,
        .add-pet-form select:focus {
          border-color: ${theme.button} !important;
          box-shadow: 0 0 0 2px ${isDark ? "rgba(120,148,119,0.2)" : "rgba(217,184,167,0.2)"};
        }

        .add-pet-form input[type="file"]::file-selector-button {
          background: ${theme.soft};
          color: ${theme.text};
          border: 1px solid ${theme.border};
          border-radius: 5px;
          padding: 7px 10px;
          margin-right: 10px;
          cursor: pointer;
        }

        .add-pet-form select option {
          background: ${theme.card};
          color: ${theme.text};
        }
      `}</style>

      <div
        style={{
          maxWidth: "750px",
          margin: "auto",
          background: theme.card,
          padding: "35px",
          borderRadius: "15px",
          boxShadow: isDark
            ? "0 5px 25px rgba(0,0,0,0.25)"
            : "0 5px 25px rgba(120,85,65,0.07)",
          border: `1px solid ${theme.border}`,
          transition: "0.3s",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            border: "none",
            background: theme.soft,
            color: theme.text,
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
            color: theme.text,
            marginBottom: "10px",
          }}
        >
          Add Your Pet 🐾
        </h1>

        <p
          style={{
            textAlign: "center",
            color: theme.muted,
            marginBottom: "30px",
          }}
        >
          Share your pet with people looking for a loving companion.
        </p>

        <form className="add-pet-form" onSubmit={handleSubmit}>
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

          <div
            style={{
              marginTop: "30px",
              padding: "22px",
              background: theme.soft,
              border: `1px solid ${theme.border}`,
              borderRadius: "12px",
              transition: "0.3s",
            }}
          >
            <h2
              style={{
                color: theme.text,
                marginTop: 0,
                fontSize: "21px",
              }}
            >
              📁 Pet Documents
            </h2>

            <p
              style={{
                color: theme.muted,
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
                      background: theme.selected,
                      padding: "10px 12px",
                      borderRadius: "8px",
                      marginTop: "-10px",
                    }}
                  >
                    <p
                      style={{
                        color: theme.selectedText,
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
                        background: isDark ? "#553333" : "#FCE4E4",
                        color: isDark ? "#ffaaaa" : "#C0392B",
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
                color: theme.muted,
                marginBottom: 0,
              }}
            >
              Accepted formats: PDF, JPG, PNG, WEBP.
              Maximum 3 MB per document.
            </p>
          </div>

          {error && (
            <p
              style={{
                color: isDark ? "#ffaaaa" : "#c0392b",
                background: isDark ? "#472b2b" : "#fff0ed",
                padding: "12px",
                borderRadius: "8px",
                margin: "15px 0",
                overflowWrap: "anywhere",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "20px",
              background: theme.button,
              color: theme.buttonText,
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "0.3s",
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

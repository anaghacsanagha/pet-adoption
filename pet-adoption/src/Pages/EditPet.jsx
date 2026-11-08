
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  showConfirm,
  showSuccess,
  showError,
} from "../utils/sweetAlert";

const API = "https://pawhaven-server.onrender.com";

function EditPet({ petId, onBack, onSaved }) {
  const id = petId;
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("pawhavenUser") || "null"
  );

  const userId = user?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  const [newImage, setNewImage] = useState("");

  const [documents, setDocuments] = useState({
    vaccinationCertificate: null,
    healthReport: null,
    petLicense: null,
    otherDocument: null,
  });

  const [existingDocuments, setExistingDocuments] = useState([]);

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

  // Load pet details and documents
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!id) {
      setError("Pet ID is missing.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const petResponse = await fetch(`${API}/pets/${id}`);

        if (!petResponse.ok) {
          throw new Error("Pet not found.");
        }

        const pet = await petResponse.json();

        if (String(pet.ownerId) !== String(userId)) {
          throw new Error("You can only edit your own pets.");
        }

        setFormData({
          name: pet.name || "",
          type: pet.type || "",
          breed: pet.breed || "",
          age: pet.age ?? "",
          gender: pet.gender || "Male",
          location: pet.location || "",
          vaccinated:
            pet.vaccinated === true ||
            pet.vaccinated === "Yes"
              ? "Yes"
              : "No",
          personality: Array.isArray(pet.personality)
            ? pet.personality.join(", ")
            : pet.personality || "",
          about: pet.about || "",
        });

        setImage(pet.image || "");

        const docResponse = await fetch(
          `${API}/petDocuments`
        );

        if (!docResponse.ok) {
          throw new Error("Unable to load pet documents.");
        }

        const allDocuments = await docResponse.json();

        setExistingDocuments(
          allDocuments.filter(
            (doc) =>
              String(doc.petId) === String(id) &&
              String(doc.ownerId) === String(userId)
          )
        );
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Pet image selection
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (!file.type.startsWith("image/")) {
      await showWarning(
        "Invalid Image",
        "Please select a valid pet image."
      );
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      await showWarning(
        "Image Too Large",
        "Pet image size should be below 2 MB."
      );
      e.target.value = "";
      return;
    }

    try {
      const imageData = await readFile(file);
      setNewImage(imageData);
    } catch (err) {
      setError(err.message);
      await showError("Image Error", err.message);
    }
  };

  // Document selection
  const handleDocumentChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    setError("");
    setSuccess("");

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      await showWarning(
        "Invalid File",
        "Only PDF, JPG, PNG and WEBP files are allowed."
      );
      e.target.value = "";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      await showWarning(
        "File Too Large",
        "Each document should be below 3 MB."
      );
      e.target.value = "";
      return;
    }

    setDocuments((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  // Delete existing document
  const deleteDocument = async (documentId) => {
    const result = await showConfirm(
      "Delete Document?",
      "Are you sure you want to delete this document?"
    );

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `${API}/petDocuments/${documentId}`
      );

      if (!response.ok) {
        throw new Error("Document not found.");
      }

      const document = await response.json();

      if (
        String(document.ownerId) !== String(userId) ||
        String(document.petId) !== String(id)
      ) {
        throw new Error("You cannot delete this document.");
      }

      const deleteResponse = await fetch(
        `${API}/petDocuments/${documentId}`,
        { method: "DELETE" }
      );

      if (!deleteResponse.ok) {
        throw new Error("Document deletion failed.");
      }

      setExistingDocuments((prev) =>
        prev.filter(
          (doc) => String(doc.id) !== String(documentId)
        )
      );

      setSuccess("Document deleted successfully! 🐾");
      setError("");

      await showSuccess(
        "Document Deleted!",
        "The document has been deleted successfully."
      );
    } catch (err) {
      setError(err.message);
      await showError("Delete Failed", err.message);
    }
  };

  // Save pet details and documents
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!userId) {
      navigate("/login");
      return;
    }

    if (
      formData.age === "" ||
      !Number.isFinite(Number(formData.age)) ||
      Number(formData.age) < 0
    ) {
      setError("Please enter a valid pet age.");
      await showWarning(
        "Invalid Age",
        "Please enter a valid pet age."
      );
      return;
    }

    try {
      setSaving(true);

      // Verify pet ownership
      const checkResponse = await fetch(`${API}/pets/${id}`);

      if (!checkResponse.ok) {
        throw new Error("Pet not found.");
      }

      const existingPet = await checkResponse.json();

      if (String(existingPet.ownerId) !== String(userId)) {
        throw new Error("You cannot edit another user's pet.");
      }

      // Prepare updated pet
      const updatedPet = {
        ...existingPet,
        ...formData,
        age: Number(formData.age),
        vaccinated: formData.vaccinated === "Yes",
        personality: formData.personality
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        image: newImage || image,
      };

      // Update pet
      const updateResponse = await fetch(`${API}/pets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPet),
      });

      if (!updateResponse.ok) {
        const text = await updateResponse.text();
        throw new Error(`Pet update failed: ${text}`);
      }

      // Upload selected documents
      const selectedDocuments = Object.entries(documents).filter(
        ([, file]) => file !== null
      );

      const failedUploads = [];

      for (const [documentType, file] of selectedDocuments) {
        try {
          const fileData = await readFile(file);

          const documentData = {
            petId: existingPet.id,
            petName: updatedPet.name,
            ownerId: userId,
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
            const responseText =
              await documentResponse.text();

            throw new Error(
              `${file.name}: HTTP ${documentResponse.status} ${responseText}`
            );
          }

          const savedDocument =
            await documentResponse.json();

          setExistingDocuments((prev) => [
            ...prev,
            savedDocument,
          ]);
        } catch (uploadError) {
          console.error(
            "Document upload failed:",
            uploadError
          );

          failedUploads.push(uploadError.message);
        }
      }

      setDocuments({
        vaccinationCertificate: null,
        healthReport: null,
        petLicense: null,
        otherDocument: null,
      });

      if (failedUploads.length > 0) {
        const message =
          "Pet details updated, but some documents failed to upload: " +
          failedUploads.join(" | ");

        setError(message);

        await showWarning(
          "Partially Updated",
          message
        );

        return;
      }

      const successMessage =
        selectedDocuments.length > 0
          ? "Pet details and documents updated successfully! 🐾"
          : "Pet details updated successfully! 🐾";

      setSuccess(successMessage);

      await showSuccess(
        "Pet Updated Successfully! 🐾",
        successMessage
      );

      onSaved();
    } catch (err) {
      console.error("Edit Pet Error:", err);

      setError(err.message || "Unable to update pet.");

      await showError(
        "Update Failed",
        err.message || "Unable to update pet."
      );
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", padding: "50px" }}>
        Loading Pet Details...
      </h2>
    );
  }

  if (error && !formData.name) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "#765846" }}>{error}</h2>

        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "12px 20px",
            background: "#765846",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ← Back to My Adoption Posts
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        padding: "10px 0 30px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "750px",
          margin: "auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 5px 25px rgba(120,85,65,0.07)",
          border: "1px solid #F1E5DD",
          boxSizing: "border-box",
        }}
      >
        <button
          type="button"
          onClick={onBack}
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
          ← Back to My Adoption Posts
        </button>

        <h1
          style={{
            textAlign: "center",
            color: "#765846",
            fontSize: "27px",
          }}
        >
          Edit Pet Details 🐾
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#A18472",
            marginBottom: "30px",
          }}
        >
          Update your pet's information and documents.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>
            Pet Image (Optional)

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={inputStyle}
            />
          </label>

          {(newImage || image) && (
            <img
              src={newImage || image}
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
              style={inputStyle}
              required
            />
          </label>

          <label style={labelStyle}>
            Age *

            <input
              type="number"
              name="age"
              min="0"
              step="1"
              value={formData.age}
              onChange={handleChange}
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
              style={inputStyle}
              placeholder="Friendly, Playful, Active"
            />
          </label>

          <label style={labelStyle}>
            About Your Pet *

            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
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
            <h2 style={{ color: "#765846", marginTop: 0 }}>
              📁 Pet Documents
            </h2>

            <p style={{ color: "#A18472", fontSize: "14px" }}>
              Documents belonging to {formData.name || "your pet"}.
              View existing documents or upload new ones.
            </p>

            {documentFields.map((field) => {
              const savedDocuments = existingDocuments.filter(
                (doc) => doc.documentType === field.name
              );

              return (
                <div
                  key={field.name}
                  style={{ marginBottom: "22px" }}
                >
                  <label style={labelStyle}>
                    {field.icon} {field.label} (Optional)
                  </label>

                  {savedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        background: "#f4eee9",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <p style={{ overflowWrap: "anywhere" }}>
                        📄 {doc.fileName}
                      </p>

                      <a
                        href={doc.fileData}
                        download={doc.fileName}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#2e7d32",
                          marginRight: "15px",
                        }}
                      >
                        View / Download
                      </a>

                      <button
                        type="button"
                        onClick={() => deleteDocument(doc.id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#c0392b",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}

                  <input
                    type="file"
                    name={field.name}
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleDocumentChange}
                    style={inputStyle}
                  />

                  {documents[field.name] && (
                    <small style={{ color: "#63866b" }}>
                      Selected: {documents[field.name].name}
                    </small>
                  )}
                </div>
              );
            })}

            <p style={{ fontSize: "12px", color: "#A18472" }}>
              PDF, JPG, PNG, WEBP. Maximum 3 MB per file.
            </p>
          </div>

          {error && (
            <p
              style={{
                color: "#c0392b",
                background: "#fff0ed",
                padding: "12px",
                borderRadius: "8px",
                overflowWrap: "anywhere",
              }}
            >
              {error}
            </p>
          )}

          {success && (
            <p
              style={{
                color: "#24743a",
                background: "#edf8ef",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              {success}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                minWidth: "130px",
                padding: "13px",
                background: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={onBack}
              disabled={saving}
              style={{
                flex: 1,
                minWidth: "130px",
                padding: "13px",
                background: "#777",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPet;


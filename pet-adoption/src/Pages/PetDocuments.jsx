
import React, { useEffect, useState } from "react";

function PetDocuments() {
  const user = JSON.parse(
    localStorage.getItem("pawhavenUser") || "null"
  );

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch logged-in user's pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/pets"
        );

        if (!response.ok) {
          throw new Error("Unable to fetch pets.");
        }

        const data = await response.json();

        const myPets = data.filter(
          (pet) =>
            String(pet.ownerId) === String(user?.id)
        );

        setPets(myPets);
      } catch (error) {
        console.error("Pet Fetch Error:", error);
        setMessage(error.message);
      } finally {
        setFetching(false);
      }
    };

    fetchPets();
  }, [user?.id]);

  // Select and validate file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setMessage("");
    setSuccess(false);

    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage(
        "Only PDF, JPG, PNG and WEBP files are allowed."
      );
      setFile(null);
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 3 * 1024 * 1024) {
      setMessage("File size should be less than 3 MB.");
      setFile(null);
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  // Convert file to Base64
  const readFile = (selectedFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);

      reader.onerror = () =>
        reject(new Error("Unable to read file."));

      reader.readAsDataURL(selectedFile);
    });
  };

  // Upload document
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccess(false);

    if (!user?.id) {
      setMessage("Please login first.");
      return;
    }

    if (!selectedPet) {
      setMessage("Please select your pet.");
      return;
    }

    if (!file) {
      setMessage("Please choose a document.");
      return;
    }

    try {
      setLoading(true);

      const fileData = await readFile(file);

      const documentData = {
        petId: String(selectedPet),
        ownerId: user.id,
        documentType: "Pet Document",
        fileName: file.name,
        fileData: fileData,
        uploadedAt: new Date().toISOString(),
      };

      console.log("Uploading document:", {
        petId: documentData.petId,
        ownerId: documentData.ownerId,
        fileName: documentData.fileName,
        fileSize: file.size,
      });

      const response = await fetch(
        "http://localhost:3000/petDocuments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(documentData),
        }
      );

      const responseText = await response.text();

      console.log("Upload Status:", response.status);
      console.log("Upload Response:", responseText);

      if (!response.ok) {
        throw new Error(
          `Upload failed (${response.status}): ${responseText}`
        );
      }

      const savedDocument = JSON.parse(responseText);

      console.log("Document uploaded successfully:", savedDocument);

      setSuccess(true);
      setMessage("Document uploaded successfully!");

      setFile(null);
      setSelectedPet("");

      e.target.reset();

    } catch (error) {
      console.error("Document Upload Error:", error);

      setSuccess(false);
      setMessage(
        error.message || "Something went wrong during upload."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.heading}>
          📄 Add Your Pet Documents
        </h2>

        <p style={styles.description}>
          Keep your pet's important documents safe in one place.
        </p>

        {fetching ? (
          <p>Loading your pets...</p>
        ) : pets.length === 0 ? (
          <p style={styles.message}>
            No pets found for your account. Add your pet first.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>

            <label style={styles.label}>
              Select Your Pet
            </label>

            <select
              value={selectedPet}
              onChange={(e) =>
                setSelectedPet(e.target.value)
              }
              style={styles.input}
              required
            >
              <option value="">Choose your pet</option>

              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>

            <label style={styles.label}>
              Upload Document
            </label>

            <label style={styles.uploadBox}>
              <span style={styles.uploadIcon}>📁</span>

              <strong style={styles.uploadTitle}>
                + Add Documents
              </strong>

              <span style={styles.uploadText}>
                Click here to choose your file
              </span>

              <span style={styles.hint}>
                PDF, JPG, PNG, WEBP · Maximum 3 MB
              </span>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>

            {file && (
              <p style={styles.fileName}>
                Selected: {file.name}
              </p>
            )}

            {message && (
              <p
                style={{
                  ...styles.message,
                  color: success ? "green" : "#B54747",
                }}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.uploadButton,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    padding: "15px 0",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "850px",
    minHeight: "450px",
    margin: "0 auto",
    background: "#FFFFFF",
    padding: "35px",
    borderRadius: "16px",
    border: "1px solid #F1E5DD",
    boxShadow: "0 5px 20px rgba(120,85,65,0.09)",
    color: "#765846",
    boxSizing: "border-box",
  },

  heading: {
    fontSize: "27px",
    color: "#765846",
    marginBottom: "10px",
  },

  description: {
    color: "#A18472",
    marginBottom: "30px",
  },

  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "25px",
    border: "1px solid #EAD8CC",
    borderRadius: "8px",
    boxSizing: "border-box",
  },

  uploadBox: {
    width: "100%",
    minHeight: "220px",
    border: "2px dashed #C8A995",
    borderRadius: "12px",
    background: "#FFF8F3",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    padding: "25px",
    boxSizing: "border-box",
  },

  uploadIcon: {
    fontSize: "42px",
  },

  uploadTitle: {
    fontSize: "22px",
  },

  uploadText: {
    color: "#A18472",
  },

  hint: {
    fontSize: "13px",
    color: "#A18472",
  },

  fileName: {
    marginTop: "15px",
    overflowWrap: "anywhere",
  },

  message: {
    marginTop: "15px",
    fontWeight: "500",
    overflowWrap: "anywhere",
  },

  uploadButton: {
    width: "100%",
    marginTop: "20px",
    padding: "16px",
    background: "#765846",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "9px",
    fontSize: "17px",
    fontWeight: "bold",
  },
};

export default PetDocuments;

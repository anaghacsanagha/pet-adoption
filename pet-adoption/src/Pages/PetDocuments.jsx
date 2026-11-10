
import React, { useEffect, useState } from "react";
import {
  showConfirm,
  showSuccess,
  showError,
  showWarning,
} from "../utils/sweetAlert";

const API = "https://pawhaven-server.onrender.com";

function PetDocuments() {
  const user = JSON.parse(
    localStorage.getItem("pawhavenUser") || "null"
  );

  const [documents, setDocuments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const [isDark, setIsDark] = useState(
    () =>
      document
        .querySelector(".pawhaven-app")
        ?.classList.contains("dark-mode") || false
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
    background: isDark ? "#303030" : "#FFFFFF",
    section: isDark ? "#252525" : "#FFF8F3",
    item: isDark ? "#292929" : "#FFFCFA",
    input: isDark ? "#252525" : "#FFFFFF",
    text: isDark ? "#F5EEE7" : "#765846",
    muted: isDark ? "#BDB0A5" : "#A18472",
    border: isDark ? "#49413C" : "#F1E5DD",
    formBorder: isDark ? "#51443D" : "#EAD8CC",
    divider: isDark ? "#49413C" : "#F0E3DA",
    cancelBg: isDark ? "#51443D" : "#EFE5DF",
    cancelText: isDark ? "#F5EEE7" : "#765846",
    viewBg: isDark ? "#304536" : "#E8F0E6",
    viewText: isDark ? "#B9D9B5" : "#557653",
    deleteBg: isDark ? "#512F2F" : "#FBEAEA",
    deleteText: isDark ? "#FFAAAA" : "#B54747",
  };

  const styles = {
    container: {
      width: "100%",
      padding: "15px 0",
      boxSizing: "border-box",
    },

    card: {
      width: "100%",
      maxWidth: "950px",
      margin: "0 auto",
      background: theme.background,
      padding: "30px",
      borderRadius: "16px",
      border: `1px solid ${theme.border}`,
      boxShadow: isDark
        ? "0 5px 20px rgba(0,0,0,0.25)"
        : "0 5px 20px rgba(120,85,65,0.09)",
      color: theme.text,
      boxSizing: "border-box",
      transition: "all 0.3s ease",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "15px",
      flexWrap: "wrap",
      marginBottom: "25px",
    },

    heading: {
      fontSize: "27px",
      color: theme.text,
      margin: "0 0 10px",
    },

    description: {
      color: theme.muted,
      margin: 0,
      lineHeight: 1.6,
    },

    addButton: {
      padding: "12px 20px",
      background: "#789477",
      color: "#FFFFFF",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
      fontSize: "14px",
      cursor: "pointer",
    },

    form: {
      marginBottom: "25px",
      padding: "22px",
      borderRadius: "10px",
      background: theme.section,
      border: `1px solid ${theme.formBorder}`,
    },

    formHeading: {
      margin: "0 0 18px",
      fontSize: "19px",
      color: theme.text,
    },

    fileInput: {
      width: "100%",
      padding: "13px",
      background: theme.input,
      color: theme.text,
      border: `1px dashed ${isDark ? "#81736B" : "#C8A995"}`,
      borderRadius: "8px",
      boxSizing: "border-box",
    },

    fileName: {
      marginTop: "10px",
      overflowWrap: "anywhere",
      fontSize: "14px",
      color: theme.text,
    },

    buttonGroup: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      marginTop: "15px",
    },

    uploadButton: {
      padding: "12px 18px",
      background: "#789477",
      color: "#FFFFFF",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
      cursor: "pointer",
    },

    cancelButton: {
      padding: "12px 18px",
      background: theme.cancelBg,
      color: theme.cancelText,
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
      cursor: "pointer",
    },

    hint: {
      color: theme.muted,
      fontSize: "12px",
      marginBottom: 0,
      marginTop: "12px",
    },

    documentSection: {
      borderTop: `1px solid ${theme.divider}`,
      paddingTop: "20px",
    },

    sectionHeading: {
      color: theme.text,
      fontSize: "19px",
      marginBottom: "15px",
    },

    emptyBox: {
      textAlign: "center",
      padding: "35px 15px",
      background: theme.item,
      color: theme.text,
      border: `1px dashed ${theme.formBorder}`,
      borderRadius: "10px",
    },

    emptyIcon: {
      fontSize: "35px",
    },

    emptySubtext: {
      color: theme.muted,
      fontSize: "13px",
    },

    documentList: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },

    documentItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
      padding: "15px",
      background: theme.item,
      border: `1px solid ${theme.border}`,
      borderRadius: "9px",
    },

    documentDetails: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      minWidth: 0,
      flex: 1,
    },

    documentIcon: {
      fontSize: "27px",
    },

    documentName: {
      display: "block",
      fontSize: "14px",
      overflowWrap: "anywhere",
      color: theme.text,
    },

    date: {
      margin: "5px 0 0",
      fontSize: "11px",
      color: theme.muted,
    },

    actions: {
      display: "flex",
      gap: "7px",
    },

    viewButton: {
      padding: "7px 12px",
      background: theme.viewBg,
      color: theme.viewText,
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    },

    deleteButton: {
      padding: "7px 12px",
      background: theme.deleteBg,
      color: theme.deleteText,
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    },

    message: {
      marginTop: "12px",
      fontWeight: "500",
      overflowWrap: "anywhere",
    },

    info: {
      color: theme.muted,
    },
  };

  // Fetch only manually uploaded documents
  const fetchDocuments = async () => {
    try {
      setFetching(true);

      const response = await fetch(`${API}/petDocuments`);

      if (!response.ok) {
        throw new Error("Unable to fetch documents.");
      }

      const data = await response.json();

      setDocuments(
        data.filter(
          (doc) =>
            String(doc.ownerId) === String(user?.id) &&
            !doc.petId &&
            !doc.petName &&
            !doc.documentType
        )
      );
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      await showError("Unable to Load Documents", error.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Select document
  const handleFileChange = async (e) => {
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
      setMessage("Only PDF, JPG, PNG and WEBP files are allowed.");
      setFile(null);
      e.target.value = "";

      await showWarning(
        "Invalid File",
        "Only PDF, JPG, PNG and WEBP files are allowed."
      );
      return;
    }

    if (selectedFile.size > 3 * 1024 * 1024) {
      setMessage("File size should be less than 3 MB.");
      setFile(null);
      e.target.value = "";

      await showWarning(
        "File Too Large",
        "File size should be less than 3 MB."
      );
      return;
    }

    setFile(selectedFile);
  };

  // Convert file to Base64
  const readFile = (selectedFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Unable to read file."));

      reader.readAsDataURL(selectedFile);
    });
  };

  // Upload manually added document
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccess(false);

    if (!user?.id) {
      setMessage("Please login first.");
      await showWarning("Please Login", "Please login first.");
      return;
    }

    if (!file) {
      setMessage("Please choose a document.");
      await showWarning("No File Selected", "Please choose a document.");
      return;
    }

    try {
      setLoading(true);

      const fileData = await readFile(file);

      const documentData = {
        ownerId: user.id,
        fileName: file.name,
        fileData,
        uploadedAt: new Date().toISOString(),
      };

      const response = await fetch(`${API}/petDocuments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documentData),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          `Upload failed (${response.status}): ${responseText}`
        );
      }

      const savedDocument = JSON.parse(responseText);

      setDocuments((prev) => [...prev, savedDocument]);

      setFile(null);
      setSuccess(true);
      setMessage("Document uploaded successfully!");

      await showSuccess(
        "Document Uploaded!",
        "Your document has been uploaded successfully."
      );

      setShowForm(false);
      setMessage("");
      setSuccess(false);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Document upload failed.");

      await showError(
        "Upload Failed",
        error.message || "Document upload failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // View document
  const handleView = async (doc) => {
    if (!doc.fileData) {
      await showError(
        "File Not Available",
        "Document file is not available."
      );
      return;
    }

    const newWindow = window.open();

    if (newWindow) {
      const iframe = newWindow.document.createElement("iframe");

      iframe.src = doc.fileData;
      iframe.style.width = "100%";
      iframe.style.height = "100vh";
      iframe.style.border = "none";

      newWindow.document.body.style.margin = "0";
      newWindow.document.body.appendChild(iframe);
    } else {
      await showWarning(
        "Pop-up Blocked",
        "Please allow pop-ups to view the document."
      );
    }
  };

  // Delete document
  const handleDelete = async (doc) => {
    if (String(doc.ownerId) !== String(user?.id)) {
      await showWarning(
        "Not Allowed",
        "You cannot delete this document."
      );
      return;
    }

    const confirmDelete = await showConfirm(
      "Delete Document?",
      `Are you sure you want to delete ${doc.fileName}?`
    );

    if (!confirmDelete.isConfirmed) return;

    try {
      const response = await fetch(
        `${API}/petDocuments/${doc.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Unable to delete document.");
      }

      setDocuments((prev) =>
        prev.filter(
          (item) => String(item.id) !== String(doc.id)
        )
      );

      await showSuccess(
        "Document Deleted",
        "Your document was deleted successfully."
      );
    } catch (error) {
      await showError("Delete Failed", error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.heading}>📄 Pet Documents</h2>
            <p style={styles.description}>
              Upload and manage your important documents in one place.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              style={styles.addButton}
              onClick={() => {
                setShowForm(true);
                setFile(null);
                setMessage("");
                setSuccess(false);
              }}
            >
              + Add Document
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h3 style={styles.formHeading}>
              Upload New Document
            </h3>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              style={styles.fileInput}
            />

            {file && (
              <p style={styles.fileName}>
                Selected: {file.name}
              </p>
            )}

            {message && (
              <p
                style={{
                  ...styles.message,
                  color: success
                    ? "#4caf50"
                    : isDark
                    ? "#ff9999"
                    : "#B54747",
                }}
              >
                {message}
              </p>
            )}

            <div style={styles.buttonGroup}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.uploadButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Uploading..." : "Upload Document"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFile(null);
                  setMessage("");
                  setSuccess(false);
                }}
                disabled={loading}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>

            <p style={styles.hint}>
              PDF, JPG, PNG, WEBP · Maximum 3 MB
            </p>
          </form>
        )}

        <div style={styles.documentSection}>
          <h3 style={styles.sectionHeading}>
            Uploaded Documents
          </h3>

          {fetching ? (
            <p style={styles.info}>Loading documents...</p>
          ) : documents.length === 0 ? (
            <div style={styles.emptyBox}>
              <span style={styles.emptyIcon}>📁</span>
              <p>No documents uploaded yet.</p>
              <p style={styles.emptySubtext}>
                Click Add Document to upload your first document.
              </p>
            </div>
          ) : (
            <div style={styles.documentList}>
              {documents.map((doc) => (
                <div key={doc.id} style={styles.documentItem}>
                  <div style={styles.documentDetails}>
                    <span style={styles.documentIcon}>
                      {doc.fileName?.toLowerCase().endsWith(".pdf")
                        ? "📕"
                        : "🖼️"}
                    </span>

                    <div style={{ minWidth: 0 }}>
                      <strong style={styles.documentName}>
                        {doc.fileName}
                      </strong>

                      <p style={styles.date}>
                        {doc.uploadedAt
                          ? new Date(doc.uploadedAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div style={styles.actions}>
                    <button
                      type="button"
                      onClick={() => handleView(doc)}
                      style={styles.viewButton}
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(doc)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PetDocuments;

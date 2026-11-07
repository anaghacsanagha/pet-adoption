
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SectionTitle from "../Components/SectionTitle";
import AdoptionForm from "../Components/AdoptionForm";

function AdoptionRequest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("pawhavenUser"));

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    livingType: "",
    experience: "",
    reason: "",
    agree: false,
  });

  // Fetch selected pet from JSON Server
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/pets/${id}`
        );

        if (!response.ok) {
          throw new Error("Pet not found");
        }

        const data = await response.json();
        setPet(data);
      } catch (error) {
        console.error("Error fetching pet:", error);
        setPet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  // Submit adoption request to JSON Server
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to submit an adoption request.");
      navigate("/login");
      return;
    }

    if (!formData.agree) {
      alert("Please accept the adoption terms.");
      return;
    }

    setSubmitting(true);

    const newRequest = {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      petId: pet.id,
      petName: pet.name,
      petImage: pet.image,
      formData: formData,
      status: "Pending",
      date: new Date().toLocaleDateString(),
    };

    try {
      const response = await fetch(
        "http://localhost:3000/adoptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRequest),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit adoption request");
      }

      alert("Your adoption request has been submitted successfully!");

      navigate("/my-adoptions");
    } catch (error) {
      console.error("Adoption submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading pet details...</div>;
  }

  if (!pet) {
    return (
      <div className="adoption-not-found">
        <h2>Pet Not Found 🐾</h2>
        <Link to="/pets">Browse Pets</Link>
      </div>
    );
  }

  return (
    <div className="adoption-request-page">
      <div className="container">
        <SectionTitle
          subtitle="START YOUR ADOPTION JOURNEY"
          title="Adoption Application"
          description={`Complete the form below to apply for adopting ${pet.name}.`}
        />

        <div className="adoption-request-layout">
          <div className="adoption-pet-summary">
            <img src={pet.image} alt={pet.name} />

            <div>
              <span>YOU ARE APPLYING TO ADOPT</span>
              <h3>{pet.name}</h3>
              <p>
                {pet.breed} • {pet.age}
              </p>
              <p>{pet.location}</p>
            </div>
          </div>

          <div className="adoption-form-wrapper">
            <AdoptionForm
              pet={pet}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
            />

            {submitting && (
              <p className="text-center mt-3">
                Submitting your adoption request...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdoptionRequest;

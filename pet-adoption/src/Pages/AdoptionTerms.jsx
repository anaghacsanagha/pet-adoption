
import React from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../Components/SectionTitle";

function AdoptionTerms() {
  const terms = [
    {
      number: "01",
      title: "Age Requirement",
      description:
        "The applicant must be at least 18 years old and capable of taking responsibility for a pet."
    },
    {
      number: "02",
      title: "Safe Living Environment",
      description:
        "The adopter must provide a safe, clean and comfortable environment for the adopted pet."
    },
    {
      number: "03",
      title: "Proper Food and Nutrition",
      description:
        "The adopter must provide nutritious food and fresh drinking water according to the pet's needs."
    },
    {
      number: "04",
      title: "Medical Care",
      description:
        "Regular veterinary checkups, vaccinations and necessary medical treatments must be provided."
    },
    {
      number: "05",
      title: "Love and Attention",
      description:
        "Pets must be treated with kindness, patience and care. They should never be abandoned or abused."
    },
    {
      number: "06",
      title: "Adoption Application",
      description:
        "All information provided in the adoption application must be accurate and genuine."
    },
    {
      number: "07",
      title: "Family Approval",
      description:
        "All household members should be comfortable with the decision to adopt a pet."
    },
    {
      number: "08",
      title: "Long-term Responsibility",
      description:
        "Adopting a pet means accepting responsibility for its wellbeing throughout its lifetime."
    }
  ];

  return (
    <div className="adoption-terms-page">

      <section className="terms-hero">
        <div className="container">
          <p>PAWHAVEN ADOPTION GUIDELINES</p>
          <h1>Adoption Terms & Conditions</h1>
          <span>
            Every pet deserves a loving, safe and forever home.
          </span>
        </div>
      </section>

      <div className="container section-padding">

        <SectionTitle
          subtitle="BE A RESPONSIBLE PET PARENT"
          title="Before You Adopt"
          description="Please read and understand these guidelines before submitting an adoption application."
        />

        <div className="terms-list">
          {terms.map((term) => (
            <div className="terms-card" key={term.number}>
              <div className="terms-number">
                {term.number}
              </div>

              <div>
                <h4>{term.title}</h4>
                <p>{term.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="terms-note">
          <h3>Our Promise ❤️</h3>
          <p>
            PawHaven believes every animal deserves love,
            respect and protection. We encourage responsible
            adoption and lifelong care.
          </p>

          <Link to="/pets" className="terms-button">
            Find Your New Friend
          </Link>
        </div>

      </div>
    </div>
  );
}

export default AdoptionTerms;


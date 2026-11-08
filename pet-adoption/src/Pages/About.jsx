
import React from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../Components/SectionTitle";

function About() {
  const features = [
    {
      icon: "🐶",
      title: "Rescue & Care",
      description:
        "We believe every animal deserves kindness, protection and a chance at a better life."
    },
    {
      icon: "🏡",
      title: "Find Loving Homes",
      description:
        "We help connect adorable pets with families who can give them a safe and loving home."
    },
    {
      icon: "❤️",
      title: "Responsible Adoption",
      description:
        "We encourage thoughtful adoption and lifelong commitment towards pets."
    }
  ];

  return (
    <div className="about-page">

      <section className="about-hero">
        <div className="container">
          <p>WELCOME TO PAWHAVEN</p>
          <h1>Every Paw Deserves a Loving Home</h1>
          <span>
            Connecting loving families with adorable pets,
            one adoption at a time.
          </span>
        </div>
      </section>

      <section className="container section-padding">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <img
              className="about-main-image"
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=900"
              alt="Happy dog with its owner"
            />
          </div>

          <div className="col-lg-6">
            <p className="about-subtitle">OUR STORY</p>
            <h2>Making a Difference in Every Little Life</h2>

            <p className="about-description">
              PawHaven is a pet adoption platform created to
              help homeless and abandoned pets find caring
              and responsible families.
            </p>

            <p className="about-description">
              Our goal is to make pet adoption simple and
              meaningful. We want every pet to experience
              love, safety and happiness in their forever home.
            </p>

            <Link to="/pets" className="about-button">
              Explore Pets
            </Link>
          </div>
        </div>
      </section>

      <section className="about-mission-section">
        <div className="container section-padding">
          <SectionTitle
            subtitle="WHAT WE BELIEVE"
            title="Our Mission & Values"
            description="Our purpose is to create a world where every pet has a loving home."
          />

          <div className="row g-4 mt-3">
            {features.map((feature, index) => (
              <div className="col-lg-4 col-md-6" key={index}>
                <div className="about-feature-card">
                  <div>{feature.icon}</div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container">
          <h2>Be a Part of Their Happy Story</h2>
          <p>
            Your love can change a pet's life forever.
          </p>
          <Link to="/pets">Adopt a Pet</Link>
        </div>
      </section>

    </div>
  );
}

export default About;




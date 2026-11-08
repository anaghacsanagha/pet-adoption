
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { pets } from "../data/pets";
import PetCard from "../Components/PetCard";
import SectionTitle from "../Components/SectionTitle";
import gsap from "gsap";

function Home() {
  const user = JSON.parse(localStorage.getItem("pawhavenUser") || "{}");

  useEffect(() => {
    const animation = gsap.fromTo(
      ".home-hero-content > *",
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out"
      }
    );

    return () => animation.kill();
  }, []);

  const featuredPets = pets.slice(0, 3);

  return (
    <>
      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="home-hero-container">

          <div className="home-hero-content">
            <span className="home-welcome-tag">
              🐾 Welcome to PawHaven
            </span>

            <h1>
              Hello, {user.name || "Pet Lover"}!
              <br />
              Find Your <span>Forever Friend.</span>
            </h1>

            <p>
              Every pet deserves a loving home. Explore our adorable
              pets and find a companion who will fill your life with joy.
            </p>

            <div className="home-hero-buttons">
              <Link to="/pets" className="home-primary-btn">
                Explore Pets →
              </Link>

              <Link to="/about" className="home-secondary-btn">
                About Us
              </Link>
            </div>

            <div className="home-mini-stats">
              <div>
                <h3>100+</h3>
                <p>Happy Families</p>
              </div>

              <div>
                <h3>50+</h3>
                <p>Lovely Pets</p>
              </div>

              <div>
                <h3>100%</h3>
                <p>Pure Love</p>
              </div>
            </div>
          </div>

          <div className="home-hero-image">
            <img
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=1000"
              alt="Golden retriever dog"
            />

            <div className="home-image-note">
              <span>❤️</span>
              <div>
                <h4>Love begins here</h4>
                <p>Adopt. Love. Repeat.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="home-categories section-padding">
        <div className="container-custom">

          <SectionTitle
            subtitle="Find Your Companion"
            title="Who Are You Looking For?"
            description="Choose your favourite companion and start your adoption journey."
          />

          <div className="home-category-grid">

            <Link to="/pets?type=Dog" className="home-category-card">
              <div className="category-icon">🐶</div>
              <h3>Dogs</h3>
              <p>Loyal friends with endless love.</p>
              <span>Explore Dogs →</span>
            </Link>

            <Link to="/pets?type=Cat" className="home-category-card">
              <div className="category-icon">🐱</div>
              <h3>Cats</h3>
              <p>Lovely companions full of charm.</p>
              <span>Explore Cats →</span>
            </Link>

            <Link to="/pets" className="home-category-card">
              <div className="category-icon">🐾</div>
              <h3>All Pets</h3>
              <p>Discover your perfect companion.</p>
              <span>View All Pets →</span>
            </Link>

          </div>
        </div>
      </section>

      {/* FEATURED PETS */}
      <section className="home-featured section-padding">
        <div className="container-custom">

          <SectionTitle
            subtitle="Meet Our Lovely Friends"
            title="Pets Waiting For You"
            description="These adorable companions are ready to find their forever homes."
          />

          <div className="home-pet-grid">
            {featuredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>

          <div className="home-view-all">
            <Link to="/pets" className="home-primary-btn">
              View All Pets →
            </Link>
          </div>

        </div>
      </section>

      {/* ADOPTION PROCESS */}
      <section className="home-process section-padding">
        <div className="container-custom">

          <SectionTitle
            subtitle="Simple & Meaningful"
            title="How Adoption Works"
            description="A few simple steps to welcome a new family member."
          />

          <div className="home-process-grid">

            <div className="home-process-card">
              <span>01</span>
              <div className="process-icon">🔍</div>
              <h3>Explore Pets</h3>
              <p>Browse our lovely pets and find the one you connect with.</p>
            </div>

            <div className="home-process-card">
              <span>02</span>
              <div className="process-icon">📝</div>
              <h3>Apply for Adoption</h3>
              <p>Fill out the adoption request form with your details.</p>
            </div>

            <div className="home-process-card">
              <span>03</span>
              <div className="process-icon">🏡</div>
              <h3>Welcome Home</h3>
              <p>Complete the adoption process and welcome your new friend.</p>
            </div>

          </div>

        </div>
      </section>

      {/* CARE BANNER */}
      <section className="home-care-section">
        <div className="container-custom">
          <div className="home-care-banner">

            <div>
              <span>🐾 A Little More Love</span>
              <h2>Good Care Makes Happy Pets</h2>
              <p>
                Learn about feeding, grooming, health and everyday
                care to keep your companion happy and healthy.
              </p>

              <Link to="/care-feeding" className="home-primary-btn">
                Explore Pet Care →
              </Link>
            </div>

            <img
              src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800"
              alt="Dog enjoying care"
            />

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="home-final-cta">
        <div className="container-custom">
          <span>❤️ Make a Difference Today</span>
          <h2>Your New Best Friend Is Waiting!</h2>
          <p>
            Open your heart and home to a pet. A little love can
            change two lives forever.
          </p>

          <Link to="/pets" className="home-cta-btn">
            Find Your Friend →
          </Link>
        </div>
      </section>

    </>
  );
}

export default Home;


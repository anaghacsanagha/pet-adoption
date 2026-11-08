
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

import Header from "../Components/Header";
import Footer from "../Components/Footer";
import SectionTitle from "../Components/SectionTitle";
import { pets } from "../data/pets";

function Landing() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });

      gsap.from(".hero-image", {
        x: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const featuredPets = pets.slice(0, 4);

  return (
    <>
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="landing-hero" ref={heroRef}>
          <div className="landing-hero-container">
            <div className="hero-content">
              <span className="hero-tag">🐾 A little love changes everything</span>

              <h1>
                Find Your <span>Forever</span> Friend
              </h1>

              <p>
                Every pet deserves a loving home. Meet your new best friend
                and give them the happy life they have been waiting for.
              </p>

              <div className="hero-buttons">
                <Link to="/register" className="primary-btn">
                  Register Now <span>→</span>
                </Link>

                <Link to="/login" className="secondary-btn">
                  Login
                </Link>
              </div>

              <div className="hero-trust">
                <span>❤️ Love</span>
                <span>🐶 Care</span>
                <span>🏡 Forever Home</span>
              </div>
            </div>

            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=1000"
                alt="Happy Golden Retriever dog"
              />

              <div className="hero-image-note">
                <span>🐾</span>
                <div>
                  <strong>Adopt. Don't Shop.</strong>
                  <small>Make a friend for life</small>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-decoration hero-decoration-one"></div>
          <div className="hero-decoration hero-decoration-two"></div>
        </section>

        {/* INTRO SECTION */}
        <section className="landing-intro section-padding">
          <SectionTitle
            subtitle="Welcome to PawHaven"
            title="A New Beginning Starts With You"
            description="We believe every animal deserves kindness, care and a place to call home. Find a companion who will fill your days with happiness."
          />

          <div className="intro-highlights">
            <div className="intro-highlight" data-aos="fade-up">
              <span>🐕</span>
              <h3>Find a Friend</h3>
              <p>Discover lovely pets waiting for a caring family.</p>
            </div>

            <div className="intro-highlight" data-aos="fade-up" data-aos-delay="100">
              <span>🏡</span>
              <h3>Give a Home</h3>
              <p>Give an animal a safe place and a fresh start.</p>
            </div>

            <div className="intro-highlight" data-aos="fade-up" data-aos-delay="200">
              <span>❤️</span>
              <h3>Share Love</h3>
              <p>Build a beautiful bond that lasts a lifetime.</p>
            </div>
          </div>
        </section>

        {/* FEATURED PETS */}
        <section className="landing-featured section-padding">
          <div className="landing-section-container">
            <SectionTitle
              subtitle="Meet your new best friend"
              title="Pets Waiting for You"
              description="These adorable companions are ready to find their forever homes."
            />

            <div className="landing-pet-grid">
              {featuredPets.map((pet, index) => (
                <article
                  className="landing-pet-card"
                  key={pet.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="landing-pet-image">
                    <img src={pet.image} alt={pet.name} />
                    <span>{pet.type}</span>
                  </div>

                  <div className="landing-pet-content">
                    <h3>{pet.name}</h3>
                    <p>{pet.breed}</p>
                    <div className="landing-pet-meta">
                      <span>🎂 {pet.age}</span>
                      <span>📍 {pet.location}</span>
                    </div>
                    <Link to="/register" className="landing-pet-link">
                      Meet {pet.name} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="landing-center-button">
              <Link to="/register" className="primary-btn">
                Explore All Pets →
              </Link>
            </div>
          </div>
        </section>

        {/* WHY ADOPT */}
        <section className="landing-why section-padding">
          <div className="landing-why-container">
            <div className="why-image" data-aos="fade-right">
              <img
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900"
                alt="Person spending time with a dog"
              />
            </div>

            <div className="why-content" data-aos="fade-left">
              <span className="section-subtitle">Why adoption matters</span>
              <h2>Adoption Is More Than Bringing a Pet Home</h2>
              <p>
                It is about giving a second chance, building trust and
                creating a friendship filled with unconditional love.
              </p>

              <ul>
                <li>✓ Give a homeless pet a loving family.</li>
                <li>✓ Make space for another animal in need.</li>
                <li>✓ Experience a special bond and companionship.</li>
                <li>✓ Choose kindness and responsible pet care.</li>
              </ul>

              <Link to="/register" className="primary-btn">
                Start Your Adoption Journey
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="landing-process section-padding">
          <div className="landing-section-container">
            <SectionTitle
              subtitle="Simple steps"
              title="How Adoption Works"
              description="Your new best friend could be just a few steps away."
            />

            <div className="process-grid">
              <div className="process-card" data-aos="fade-up">
                <span className="process-number">01</span>
                <div className="process-icon">🔍</div>
                <h3>Explore Pets</h3>
                <p>Browse adorable pets and find the companion you love.</p>
              </div>

              <div className="process-card" data-aos="fade-up" data-aos-delay="100">
                <span className="process-number">02</span>
                <div className="process-icon">💌</div>
                <h3>Send a Request</h3>
                <p>Fill out the adoption application with your details.</p>
              </div>

              <div className="process-card" data-aos="fade-up" data-aos-delay="200">
                <span className="process-number">03</span>
                <div className="process-icon">🏡</div>
                <h3>Welcome Home</h3>
                <p>Prepare a safe and loving home for your new friend.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CARE SECTION */}
        <section className="landing-care section-padding">
          <div className="care-banner" data-aos="zoom-in">
            <div>
              <span className="section-subtitle">A happy pet is a healthy pet</span>
              <h2>Love Them, Care for Them, Every Day.</h2>
              <p>
                Learn about nutrition, grooming, exercise and responsible
                pet parenting.
              </p>
              <Link to="/register" className="primary-btn">
                Join PawHaven →
              </Link>
            </div>

            <div className="care-banner-image">
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800"
                alt="Two happy dogs"
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="landing-cta">
          <div data-aos="fade-up">
            <span>🐾 Your best friend is waiting</span>
            <h2>Ready to Make a Difference?</h2>
            <p>Open your heart and home to a pet who needs you.</p>

            <Link to="/register" className="cta-button">
              Create Your Account →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Landing;


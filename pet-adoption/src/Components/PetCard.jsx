
import React from "react";
import { Link } from "react-router-dom";

function PetCard({ pet }) {
  return (
    <div className="pet-card" data-aos="fade-up">

      <div className="pet-card-image">
        <img src={pet.image} alt={pet.name} />

        {/* Wishlist button intentionally disabled */}

        {/* <button
          className="wishlist-heart"
          onClick={toggleWishlist}
          aria-label="Toggle wishlist"
        >
          ♡
        </button> */}

        <span className="pet-type-badge">
          {pet.type}
        </span>
      </div>

      <div className="pet-card-content">

        <div className="pet-card-heading">
          <h3>{pet.name}</h3>
          <span>{pet.age}</span>
        </div>

        <p className="pet-breed">
          {pet.breed}
        </p>

        <div className="pet-card-info">
          <span>⚥ {pet.gender}</span>
          <span>📍 {pet.location}</span>
        </div>

        {pet.ownerName && (
          <p className="pet-owner-name">
            <span>Posted by:</span> {pet.ownerName}
          </p>
        )}

        <div className="pet-card-buttons">

          <Link
            to={`/pet/${pet.id}`}
            className="pet-view-btn"
          >
            View More
          </Link>

          <Link
            to={`/adopt/${pet.id}`}
            className="pet-adopt-btn"
          >
            Adopt Me
          </Link>

        </div>

      </div>
    </div>
  );
}

export default PetCard;

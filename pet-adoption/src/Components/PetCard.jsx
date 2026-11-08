
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function getWishlistIds() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("pawhavenWishlist") || "[]"
    );

    return saved.map((item) =>
      String(typeof item === "object" ? item.id : item)
    );
  } catch {
    return [];
  }
}

function PetCard({ pet }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkWishlist = () => {
      const ids = getWishlistIds();
      setIsSaved(ids.includes(String(pet.id)));
    };

    checkWishlist();

    window.addEventListener("wishlistUpdated", checkWishlist);
    window.addEventListener("storage", checkWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", checkWishlist);
      window.removeEventListener("storage", checkWishlist);
    };
  }, [pet.id]);

  const toggleWishlist = () => {
    const savedIds = getWishlistIds();
    const petId = String(pet.id);

    let updatedIds;

    if (savedIds.includes(petId)) {
      updatedIds = savedIds.filter((id) => id !== petId);
      setIsSaved(false);
    } else {
      updatedIds = [...savedIds, petId];
      setIsSaved(true);
    }

    localStorage.setItem(
      "pawhavenWishlist",
      JSON.stringify(updatedIds)
    );

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <div className="pet-card" data-aos="fade-up">
      <div className="pet-card-image">
        <img src={pet.image} alt={pet.name} />

        {/* <button
          type="button"
          className={`wishlist-heart ${isSaved ? "active" : ""}`}
          onClick={toggleWishlist}
          aria-label={
            isSaved ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={isSaved}
          title={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {isSaved ? "♥" : "♡"}
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


import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pets } from "../data/pets";
import SectionTitle from "../Components/SectionTitle";
import PetCard from "../Components/PetCard";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const loadWishlist = () => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("pawhavenWishlist")) || [];

    // Get the latest pet details from pets.js
    const updatedWishlist = savedWishlist
      .map((item) => pets.find((pet) => pet.id === item.id))
      .filter(Boolean);

    setWishlist(updatedWishlist);
  };

  useEffect(() => {
    loadWishlist();

    window.addEventListener("wishlistUpdated", loadWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
    };
  }, []);

  const removeItem = (id) => {
    const updatedWishlist = wishlist.filter(
      (pet) => pet.id !== id
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "pawhavenWishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const clearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      setWishlist([]);

      localStorage.removeItem("pawhavenWishlist");

      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  };

  return (
    <div className="wishlist-page">
      <div className="container">
        <SectionTitle
          subtitle="YOUR FAVOURITES"
          title="My Wishlist ❤️"
          description="All the lovely pets you have saved in one place."
        />

        {wishlist.length > 0 ? (
          <>
            <div className="wishlist-top">
              <p>
                You have saved <strong>{wishlist.length}</strong> pet(s).
              </p>

              <button
                className="wishlist-clear-btn"
                onClick={clearWishlist}
              >
                Clear Wishlist
              </button>
            </div>

            <div className="row g-4">
              {wishlist.map((pet) => (
                <div className="col-lg-4 col-md-6" key={pet.id}>
                  <div className="wishlist-card">
                    <PetCard pet={pet} />

                    <div className="wishlist-actions">
                      <button
                        onClick={() => navigate(`/pet/${pet.id}`)}
                      >
                        View Details
                      </button>

                      <button
                        className="wishlist-remove-btn"
                        onClick={() => removeItem(pet.id)}
                      >
                        Remove ♡
                      </button>

                      <Link to={`/adopt/${pet.id}`}>
                        Adopt Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">♡</div>

            <h3>Your Wishlist is Empty</h3>

            <p>
              You haven't saved any pets yet. Find a lovely companion
              and add them to your wishlist!
            </p>

            <Link to="/pets" className="wishlist-browse-btn">
              Explore Pets
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;

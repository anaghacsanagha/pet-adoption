
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pets as staticPets } from "../data/pets";
import SectionTitle from "../Components/SectionTitle";
import PetCard from "../Components/PetCard";
import {
  showConfirm,
  showSuccess,
} from "../utils/sweetAlert";

const API = "https://pawhaven-server.onrender.com";

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

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadWishlist = useCallback(async () => {
    try {
      const savedIds = getWishlistIds();

      if (savedIds.length === 0) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      let allPets = [];

      try {
        const response = await fetch(`${API}/pets`);

        if (!response.ok) {
          throw new Error("Unable to load pets.");
        }

        allPets = await response.json();
      } catch (error) {
        console.error("Server pet loading error:", error);
        allPets = staticPets || [];
      }

      const updatedWishlist = savedIds
        .map((id) =>
          allPets.find((pet) => String(pet.id) === id)
        )
        .filter(Boolean);

      setWishlist(updatedWishlist);
    } catch (error) {
      console.error("Wishlist loading error:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();

    window.addEventListener("wishlistUpdated", loadWishlist);
    window.addEventListener("storage", loadWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
      window.removeEventListener("storage", loadWishlist);
    };
  }, [loadWishlist]);

  const removeItem = (id) => {
    const updatedIds = getWishlistIds().filter(
      (savedId) => savedId !== String(id)
    );

    localStorage.setItem(
      "pawhavenWishlist",
      JSON.stringify(updatedIds)
    );

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const clearWishlist = async () => {
    const result = await showConfirm(
      "Clear Wishlist?",
      "Are you sure you want to remove all saved pets from your wishlist?"
    );

    if (!result.isConfirmed) return;

    localStorage.removeItem("pawhavenWishlist");

    setWishlist([]);

    window.dispatchEvent(new Event("wishlistUpdated"));

    await showSuccess(
      "Wishlist Cleared",
      "All saved pets have been removed."
    );
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <h3 style={{ textAlign: "center", padding: "50px" }}>
            Loading Wishlist...
          </h3>
        </div>
      </div>
    );
  }

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
                You have saved{" "}
                <strong>{wishlist.length}</strong> pet(s).
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
                        type="button"
                        onClick={() => navigate(`/pet/${pet.id}`)}
                      >
                        View Details
                      </button>

                      <button
                        type="button"
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


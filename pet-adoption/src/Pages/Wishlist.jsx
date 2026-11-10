
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
  const [isDark, setIsDark] = useState(
    () => document.querySelector(".pawhaven-app")?.classList.contains("dark-mode") || false
  );

  const navigate = useNavigate();

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
    background: isDark ? "#242424" : "#fffaf5",
    card: isDark ? "#303030" : "#ffffff",
    text: isDark ? "#f5eee7" : "#493b35",
    muted: isDark ? "#c0b5aa" : "#81736b",
    border: isDark ? "#4a4a4a" : "#eadfd5",
  };

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

  const actionButton = {
    border: "none",
    borderRadius: "7px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: "500",
    textDecoration: "none",
    textAlign: "center",
    display: "inline-block",
  };

  if (loading) {
    return (
      <div
        className="wishlist-page"
        style={{ background: theme.background, color: theme.text, minHeight: "70vh" }}
      >
        <div className="container">
          <h3 style={{ textAlign: "center", padding: "50px" }}>
            Loading Wishlist...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div
      className="wishlist-page"
      style={{
        background: theme.background,
        color: theme.text,
        minHeight: "70vh",
        paddingBottom: "40px",
        transition: "all 0.3s ease",
      }}
    >
      <div className="container">
        <SectionTitle
          subtitle="YOUR FAVOURITES"
          title="My Wishlist ❤️"
          description="All the lovely pets you have saved in one place."
        />

        {wishlist.length > 0 ? (
          <>
            <div
              className="wishlist-top"
              style={{
                background: theme.card,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: "10px",
                padding: "15px 20px",
                marginBottom: "25px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <p style={{ margin: 0, color: theme.text }}>
                You have saved <strong>{wishlist.length}</strong> pet(s).
              </p>

              <button
                className="wishlist-clear-btn"
                onClick={clearWishlist}
                style={{
                  ...actionButton,
                  background: "#c62828",
                  color: "#ffffff",
                }}
              >
                Clear Wishlist
              </button>
            </div>

            <div className="row g-4">
              {wishlist.map((pet) => (
                <div className="col-lg-4 col-md-6" key={pet.id}>
                  <div
                    className="wishlist-card"
                    style={{
                      background: theme.card,
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                      borderRadius: "12px",
                      padding: "12px",
                      height: "100%",
                      boxShadow: isDark
                        ? "0 3px 12px rgba(0,0,0,0.25)"
                        : "0 3px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    <PetCard pet={pet} />

                    <div
                      className="wishlist-actions"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginTop: "12px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => navigate(`/pet/${pet.id}`)}
                        style={{
                          ...actionButton,
                          flex: 1,
                          background: "#765846",
                          color: "#ffffff",
                        }}
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        className="wishlist-remove-btn"
                        onClick={() => removeItem(pet.id)}
                        style={{
                          ...actionButton,
                          flex: 1,
                          background: isDark ? "#583333" : "#f5dede",
                          color: isDark ? "#ffcccc" : "#a32121",
                        }}
                      >
                        Remove ♡
                      </button>

                      <Link
                        to={`/adopt/${pet.id}`}
                        style={{
                          ...actionButton,
                          width: "100%",
                          background: "#789477",
                          color: "#ffffff",
                        }}
                      >
                        Adopt Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div
            className="wishlist-empty"
            style={{
              background: theme.card,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: "14px",
              textAlign: "center",
              padding: "50px 20px",
              margin: "30px 0",
            }}
          >
            <div
              className="wishlist-empty-icon"
              style={{
                fontSize: "55px",
                color: isDark ? "#e9b5b5" : "#e9c4bd",
              }}
            >
              ♡
            </div>

            <h3 style={{ color: theme.text }}>
              Your Wishlist is Empty
            </h3>

            <p style={{ color: theme.muted }}>
              You haven't saved any pets yet. Find a lovely companion
              and add them to your wishlist!
            </p>

            <Link
              to="/pets"
              className="wishlist-browse-btn"
              style={{
                ...actionButton,
                background: "#789477",
                color: "#ffffff",
                marginTop: "10px",
              }}
            >
              Explore Pets
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;

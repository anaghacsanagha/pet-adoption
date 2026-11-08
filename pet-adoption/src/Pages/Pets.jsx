
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import PetCard from "../Components/PetCard";
import SearchBar from "../Components/SearchBar";
import PetFilter from "../Components/PetFilter";
import SectionTitle from "../Components/SectionTitle";

function Pets() {
  const [searchParams] = useSearchParams();

  const initialType = searchParams.get("type") || "All";

  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    type: initialType,
    gender: "All",
    location: "All",
    vaccinated: "All"
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:3000/pets");

        if (!response.ok) {
          throw new Error("Failed to fetch pets");
        }

        const data = await response.json();
        setPets(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error(err);
        setError("Unable to load pets. Please start the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Search and filters
  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const searchText = search.toLowerCase().trim();

      // Search filter
      const matchesSearch =
        !searchText ||
        [
          pet.name,
          pet.breed,
          pet.type,
          pet.location
        ].some((value) =>
          String(value || "").toLowerCase().includes(searchText)
        );

      // Pet type filter
      const matchesType =
        filters.type === "All" ||
        String(pet.type || "").toLowerCase() ===
          filters.type.toLowerCase();

      // Gender filter
      const matchesGender =
        filters.gender === "All" ||
        String(pet.gender || "").toLowerCase() ===
          filters.gender.toLowerCase();

      // Place filter
      const matchesLocation =
        filters.location === "All" ||
        String(pet.location || "").toLowerCase() ===
          filters.location.toLowerCase();

      // Vaccination filter
      const isVaccinated =
        pet.vaccinated === true ||
        String(pet.vaccinated).toLowerCase() === "yes";

      const matchesVaccination =
        filters.vaccinated === "All" ||
        (filters.vaccinated === "Yes" && isVaccinated) ||
        (filters.vaccinated === "No" && !isVaccinated);

      return (
        matchesSearch &&
        matchesType &&
        matchesGender &&
        matchesLocation &&
        matchesVaccination
      );
    });
  }, [pets, search, filters]);

  // Reset all filters
  const resetFilters = () => {
    setSearch("");

    setFilters({
      type: "All",
      gender: "All",
      location: "All",
      vaccinated: "All"
    });
  };

  return (
    <div className="pets-page">

      {/* PAGE HERO */}
      <section className="pets-page-hero">
        <div className="container-custom">
          <span>🐾 Find Your Companion</span>

          <h1>Meet Your New Best Friend</h1>

          <p>
            Explore our adorable pets and discover the perfect
            companion waiting for a loving home.
          </p>
        </div>
      </section>

      {/* PET LISTING */}
      <section className="pets-listing-section section-padding">
        <div className="container-custom">

          <SectionTitle
            subtitle="Our Lovely Pets"
            title="Find Your Forever Friend"
            description="Use the search and filters to find a pet that matches your lifestyle."
          />

          {/* SEARCH */}
          <div className="pets-search-wrapper">
            <SearchBar
              search={search}
              setSearch={setSearch}
            />
          </div>

          {/* FILTERS */}
          <PetFilter
            filters={filters}
            setFilters={setFilters}
            pets={pets}
          />

          {/* RESULTS */}
          <div className="pets-results-heading">
            <div>
              <h3>Available Pets</h3>
              <p>{filteredPets.length} pets found</p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="pets-reset-btn"
            >
              Reset Filters
            </button>
          </div>

          {loading ? (
            <div className="pets-empty">
              <h3>Loading Pets...</h3>
            </div>
          ) : error ? (
            <div className="pets-empty">
              <h3>{error}</h3>
            </div>
          ) : filteredPets.length > 0 ? (
            <div className="pets-grid">
              {filteredPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                />
              ))}
            </div>
          ) : (
            <div className="pets-empty">
              <span>🐾</span>

              <h3>No Pets Found</h3>

              <p>
                No pets match all your selected filters.
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}

export default Pets;

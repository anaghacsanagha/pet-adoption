import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import PetCard from "../Components/PetCard";
import SearchBar from "../Components/SearchBar";
import PetFilter from "../Components/PetFilter";
import SectionTitle from "../Components/SectionTitle";

// Convert pet age into months
function getAgeInMonths(age) {
  if (age === undefined || age === null || age === "") {
    return null;
  }

  const value = String(age).toLowerCase().trim();
  const number = parseFloat(value);

  if (Number.isNaN(number)) {
    return null;
  }

  if (value.includes("month")) {
    return number;
  }

  if (value.includes("year")) {
    return number * 12;
  }

  // Plain number is treated as years
  return number * 12;
}

function Pets() {
  const [searchParams] = useSearchParams();

  const initialType = searchParams.get("type") || "All";

  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    type: initialType,
    gender: "All",
    ageGroup: "All",
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

  // All filters work together
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
        pet.type === filters.type;

      // Gender filter
      const matchesGender =
        filters.gender === "All" ||
        pet.gender?.toLowerCase() === filters.gender.toLowerCase();

      // Age filter
      const ageInMonths = getAgeInMonths(pet.age);

      let matchesAge = true;

      if (filters.ageGroup !== "All") {
        if (ageInMonths === null) {
          matchesAge = false;
        } else {
          switch (filters.ageGroup) {
            case "0-3":
              matchesAge = ageInMonths >= 0 && ageInMonths < 3;
              break;

            case "3-6":
              matchesAge = ageInMonths >= 3 && ageInMonths < 6;
              break;

            case "6-12":
              matchesAge = ageInMonths >= 6 && ageInMonths < 12;
              break;

            case "12-24":
              matchesAge = ageInMonths >= 12 && ageInMonths < 24;
              break;

            case "24-60":
              matchesAge = ageInMonths >= 24 && ageInMonths < 60;
              break;

            case "60+":
              matchesAge = ageInMonths >= 60;
              break;

            default:
              matchesAge = true;
          }
        }
      }

      // Vaccination filter
      const matchesVaccination =
        filters.vaccinated === "All" ||
        (filters.vaccinated === "Yes" && pet.vaccinated === true) ||
        (filters.vaccinated === "No" && pet.vaccinated === false);

      return (
        matchesSearch &&
        matchesType &&
        matchesGender &&
        matchesAge &&
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
      ageGroup: "All",
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

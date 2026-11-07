
import React, { useMemo } from "react";

function getAgeInMonths(age) {
  if (age === undefined || age === null || age === "") {
    return null;
  }

  const value = String(age).toLowerCase().trim();

  // Supports formats like "2 years", "6 months", "1 year"
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

  // If age is only a number, treat it as years
  return number * 12;
}

function PetFilter({ filters, setFilters, pets = [] }) {
  const petTypes = useMemo(() => {
    return [
      ...new Set(
        pets.map((pet) => pet.type).filter(Boolean)
      )
    ].sort();
  }, [pets]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: "All",
      gender: "All",
      ageGroup: "All",
      vaccinated: "All"
    });
  };

  return (
    <div className="pet-filter">

      {/* PET TYPE */}
      <div className="filter-group">
        <label>Pet Type</label>

        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
        >
          <option value="All">All Pets</option>

          {petTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* GENDER */}
      <div className="filter-group">
        <label>Gender</label>

        <select
          name="gender"
          value={filters.gender}
          onChange={handleChange}
        >
          <option value="All">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* AGE RANGE */}
      <div className="filter-group">
        <label>Age</label>

        <select
          name="ageGroup"
          value={filters.ageGroup}
          onChange={handleChange}
        >
          <option value="All">All Ages</option>
          <option value="0-3">0 - 3 Months</option>
          <option value="3-6">3 - 6 Months</option>
          <option value="6-12">6 - 12 Months</option>
          <option value="12-24">1 - 2 Years</option>
          <option value="24-60">2 - 5 Years</option>
          <option value="60+">5+ Years</option>
        </select>
      </div>

      {/* VACCINATION */}
      <div className="filter-group">
        <label>Vaccination</label>

        <select
          name="vaccinated"
          value={filters.vaccinated}
          onChange={handleChange}
        >
          <option value="All">All</option>
          <option value="Yes">Vaccinated</option>
          <option value="No">Not Vaccinated</option>
        </select>
      </div>

      {/* RESET */}
      <button
        type="button"
        className="filter-reset"
        onClick={resetFilters}
      >
        Reset Filters
      </button>

    </div>
  );
}

export default PetFilter;


import React, { useMemo } from "react";

function PetFilter({ filters, setFilters, pets = [] }) {
  const petTypes = useMemo(() => {
    return [...new Set(pets.map((pet) => pet.type).filter(Boolean))].sort();
  }, [pets]);

  const locations = useMemo(() => {
    return [...new Set(pets.map((pet) => pet.location).filter(Boolean))].sort();
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
      location: "All",
      vaccinated: "All"
    });
  };

  return (
    <div className="pet-filter">

      <div className="filter-group">
        <label>Pet Type</label>
        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="All">All Pets</option>
          {petTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Gender</label>
        <select name="gender" value={filters.gender} onChange={handleChange}>
          <option value="All">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Place</label>
        <select
          name="location"
          value={filters.location}
          onChange={handleChange}
        >
          <option value="All">All Places</option>
          {locations.map((place) => (
            <option key={place} value={place}>{place}</option>
          ))}
        </select>
      </div>

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

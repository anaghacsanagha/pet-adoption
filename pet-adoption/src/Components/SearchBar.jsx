
import React from "react";

function SearchBar({ search, setSearch }) {
  return (
    <div className="pet-search">
      <span>🔍</span>
      <input
        type="text"
        placeholder="Search pets by name or breed..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <button onClick={() => setSearch("")}>✕</button>
      )}
    </div>
  );
}

export default SearchBar;


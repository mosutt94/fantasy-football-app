/**
 * SearchBar Component - Search input for filtering players by name
 */

import React from 'react';
import './SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = "Search players..." }) => {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button 
            className="clear-search"
            onClick={() => onChange('')}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

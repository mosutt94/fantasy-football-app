/**
 * PositionFilters Component - Filter buttons for different fantasy positions
 */

import React from 'react';
import './PositionFilters.css';

const PositionFilters = ({ selectedPosition, onPositionChange }) => {
  const positions = [
    { key: '', label: 'All', description: 'All players' },
    { key: 'QB', label: 'QB', description: 'Quarterbacks' },
    { key: 'RB', label: 'RB', description: 'Running Backs' },
    { key: 'WR', label: 'WR', description: 'Wide Receivers' },
    { key: 'TE', label: 'TE', description: 'Tight Ends' },
    { key: 'Flex', label: 'Flex', description: 'RB/WR/TE' },
    { key: 'Superflex', label: 'Superflex', description: 'QB/RB/WR/TE' },
    { key: 'K', label: 'K', description: 'Kickers' },
    { key: 'DST', label: 'DST', description: 'Defense/Special Teams' }
  ];

  return (
    <div className="position-filters">
      <label className="filter-label">Position:</label>
      <div className="position-buttons">
        {positions.map((position) => (
          <button
            key={position.key}
            className={`position-button ${selectedPosition === position.key ? 'active' : ''}`}
            onClick={() => onPositionChange(position.key)}
            title={position.description}
          >
            {position.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PositionFilters;

/**
 * FavoriteButton Component - Star button for favoriting players
 */

import React from 'react';
import './FavoriteButton.css';

const FavoriteButton = ({ isFavorited, onToggle, playerId }) => {
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent row click
    onToggle(playerId, !isFavorited);
  };

  return (
    <button
      className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
      onClick={handleClick}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorited ? '★' : '☆'}
    </button>
  );
};

export default FavoriteButton;

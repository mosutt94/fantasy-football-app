/**
 * PlayerTable Component - Main table for displaying and editing fantasy football players
 */

import React, { useState } from 'react';
import { usePlayers } from '../hooks/usePlayers';
import SearchBar from './SearchBar';
import PositionFilters from './PositionFilters';
import TeamFilter from './TeamFilter';
import PaginationControls from './PaginationControls';
import EditableCell from './EditableCell';
import FavoriteButton from './FavoriteButton';
import './PlayerTable.css';

const PlayerTable = () => {
  const {
    players,
    loading,
    error,
    filters,
    sortConfig,
    availableTeams,
    pagination,
    hasPendingChanges,
    handleSort,
    updateFilter,
    updatePagination,
    addPendingChange,
    savePendingChanges,
    clearPendingChanges,
    refetch,
    toggleFavorite
  } = usePlayers();



  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return '↕️';
    return sortConfig.direction === 'desc' ? '↓' : '↑';
  };

  const handleCellChange = async (playerId, field, value) => {
    // Convert string values to numbers for numeric fields
    let processedValue = value;
    if (field === 'tier' || field === 'auction_value' || field === 'yahoo_value') {
      processedValue = value === '' ? null : parseFloat(value);
    }
    
    // Auto-save immediately
    try {
      const { playerApi } = await import('../services/api');
      await playerApi.updatePlayer(playerId, { [field]: processedValue });
      // Refetch data to update the display without full page reload
      refetch();
    } catch (error) {
      console.error('Failed to save change:', error);
      alert('Failed to save change. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading players...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Players</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="player-table-container">
      <div className="table-header">
        <h1>Fantasy Football Auction Draft</h1>
        <div className="table-controls">
          <SearchBar 
            value={filters.search}
            onChange={(value) => updateFilter('search', value)}
          />
          <PositionFilters 
            selectedPosition={filters.position}
            onPositionChange={(position) => updateFilter('position', position)}
          />
          <TeamFilter 
            teams={availableTeams}
            selectedTeam={filters.team}
            onTeamChange={(team) => updateFilter('team', team)}
          />
          <button
            className={`favorites-filter-btn ${filters.favorites ? 'active' : ''}`}
            onClick={() => updateFilter('favorites', !filters.favorites)}
            title={filters.favorites ? 'Show all players' : 'Show only favorites'}
          >
            {filters.favorites ? '★' : '☆'} Favorites
          </button>
        </div>
      </div>

      <div className="table-actions">
        <PaginationControls 
          pagination={pagination}
          onPaginationChange={updatePagination}
        />
      </div>

      <div className="table-wrapper">
        <table className="player-table">
          <thead>
            <tr>
              <th className="favorite-header">
                ★
              </th>
              <th 
                onClick={() => handleSort('overallRank')}
                className={`sortable ${sortConfig.key === 'overallRank' ? 'sorted' : ''}`}
              >
                Overall Rank {getSortIcon('overallRank')}
              </th>
              <th 
                onClick={() => handleSort('positionRank')}
                className={`sortable ${sortConfig.key === 'positionRank' ? 'sorted' : ''}`}
              >
                Pos Rank {getSortIcon('positionRank')}
              </th>
              <th 
                onClick={() => handleSort('full_name')}
                className={`sortable ${sortConfig.key === 'full_name' ? 'sorted' : ''}`}
              >
                Name {getSortIcon('full_name')}
              </th>
              <th 
                onClick={() => handleSort('position')}
                className={`sortable ${sortConfig.key === 'position' ? 'sorted' : ''}`}
              >
                Position {getSortIcon('position')}
              </th>
              <th 
                onClick={() => handleSort('team')}
                className={`sortable ${sortConfig.key === 'team' ? 'sorted' : ''}`}
              >
                Team {getSortIcon('team')}
              </th>
              <th 
                onClick={() => handleSort('tier')}
                className={`sortable ${sortConfig.key === 'tier' ? 'sorted' : ''}`}
              >
                Tier {getSortIcon('tier')}
              </th>
              <th 
                onClick={() => handleSort('auction_value')}
                className={`sortable ${sortConfig.key === 'auction_value' ? 'sorted' : ''}`}
              >
                Auction Value {getSortIcon('auction_value')}
              </th>
              <th 
                onClick={() => handleSort('yahoo_value')}
                className={`sortable ${sortConfig.key === 'yahoo_value' ? 'sorted' : ''}`}
              >
                Yahoo Value {getSortIcon('yahoo_value')}
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="player-row">
                <td className="favorite-cell">
                  <FavoriteButton
                    isFavorited={player.favorited || false}
                    onToggle={toggleFavorite}
                    playerId={player.id}
                  />
                </td>
                <td className="rank-cell">{player.overallRank}</td>
                <td className="rank-cell">{player.positionRank}</td>
                <td className="name-cell">
                  <div className="player-name">
                    <span className="full-name">{player.full_name}</span>
                  </div>
                </td>
                <td className={`position-cell position-${player.position.toLowerCase()}`}>
                  {player.position}
                </td>
                <td className="team-cell">{player.team || 'N/A'}</td>
                <td>
                  <EditableCell
                    value={player.tier}
                    type="number"
                    onChange={(value) => handleCellChange(player.id, 'tier', value)}
                    placeholder="Tier"
                    min="1"
                    max="20"
                  />
                </td>
                <td>
                  <EditableCell
                    value={player.auction_value}
                    type="number"
                    onChange={(value) => handleCellChange(player.id, 'auction_value', value)}
                    placeholder="$0"
                    min="1"
                    max="200"
                    prefix="$"
                  />
                </td>
                <td>
                  <EditableCell
                    value={player.yahoo_value}
                    type="number"
                    onChange={(value) => handleCellChange(player.id, 'yahoo_value', value)}
                    placeholder="$0"
                    min="1"
                    max="200"
                    prefix="$"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {players.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No players found</h3>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      )}

      <div className="table-footer">
        <div className="table-info">
          Showing {players.length} of {pagination.total} players
        </div>
        <PaginationControls 
          pagination={pagination}
          onPaginationChange={updatePagination}
        />
      </div>
    </div>
  );
};

export default PlayerTable;

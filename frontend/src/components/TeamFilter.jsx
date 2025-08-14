/**
 * TeamFilter Component - Dropdown for filtering players by team
 */

import React from 'react';
import './TeamFilter.css';

const TeamFilter = ({ teams, selectedTeam, onTeamChange }) => {
  return (
    <div className="team-filter">
      <label className="filter-label">Team:</label>
      <select
        className="team-select"
        value={selectedTeam}
        onChange={(e) => onTeamChange(e.target.value)}
      >
        <option value="">All Teams</option>
        {teams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TeamFilter;

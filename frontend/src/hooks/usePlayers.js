/**
 * Custom hook for managing players data and operations
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { playerApi } from '../services/api';

const FANTASY_POSITIONS = ['QB', 'RB', 'WR', 'TE', 'K', 'DST'];

export const usePlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    position: '',
    team: '',
    search: '',
    favorites: false
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'auction_value',
    direction: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 50,
    total: 0
  });
  const [pendingChanges, setPendingChanges] = useState(new Map());

  /**
   * Fetch players from API
   */
  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await playerApi.getPlayers();
      
      // Filter for fantasy-relevant players with auction value >= 1
      const fantasyPlayers = response.data.filter(player => 
        FANTASY_POSITIONS.includes(player.position) && 
        player.auction_value >= 1
      );
      
      setPlayers(fantasyPlayers);
      setPagination(prev => ({ ...prev, total: fantasyPlayers.length }));
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch players:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Filter players based on current filters
   */
  const filteredPlayers = useMemo(() => {
    let filtered = [...players];

    // Position filter (including special filters)
    if (filters.position) {
      if (filters.position === 'Flex') {
        filtered = filtered.filter(p => ['RB', 'WR', 'TE'].includes(p.position));
      } else if (filters.position === 'Superflex') {
        filtered = filtered.filter(p => ['QB', 'RB', 'WR', 'TE'].includes(p.position));
      } else {
        filtered = filtered.filter(p => p.position === filters.position);
      }
    }

    // Team filter
    if (filters.team) {
      filtered = filtered.filter(p => p.team === filters.team);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.full_name?.toLowerCase().includes(searchLower) ||
        p.first_name?.toLowerCase().includes(searchLower) ||
        p.last_name?.toLowerCase().includes(searchLower)
      );
    }

    // Favorites filter
    if (filters.favorites) {
      filtered = filtered.filter(p => p.favorited === true);
    }

    return filtered;
  }, [players, filters]);

  /**
   * Sort players based on current sort configuration
   */
  const sortedPlayers = useMemo(() => {
    if (!sortConfig.key) return filteredPlayers;

    return [...filteredPlayers].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null) aValue = sortConfig.direction === 'desc' ? -Infinity : Infinity;
      if (bValue == null) bValue = sortConfig.direction === 'desc' ? -Infinity : Infinity;

      // Convert to numbers if they're numeric strings
      if (typeof aValue === 'string' && !isNaN(aValue)) aValue = parseFloat(aValue);
      if (typeof bValue === 'string' && !isNaN(bValue)) bValue = parseFloat(bValue);

      // Sort strings alphabetically, numbers numerically
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'desc' ? 1 : -1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'desc' ? -1 : 1;
      }
      return 0;
    });
  }, [filteredPlayers, sortConfig]);

  /**
   * Add rankings to sorted players
   */
  const rankedPlayers = useMemo(() => {
    const positionCounts = {};
    
    return sortedPlayers.map((player, index) => {
      // Overall ranking
      const overallRank = index + 1;
      
      // Position ranking
      if (!positionCounts[player.position]) {
        positionCounts[player.position] = 0;
      }
      positionCounts[player.position]++;
      const positionRank = positionCounts[player.position];

      return {
        ...player,
        overallRank,
        positionRank,
        // Include pending changes if they exist
        ...pendingChanges.get(player.id)
      };
    });
  }, [sortedPlayers, pendingChanges]);

  /**
   * Get paginated players
   */
  const paginatedPlayers = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return rankedPlayers.slice(startIndex, endIndex);
  }, [rankedPlayers, pagination]);

  /**
   * Get unique teams for filter dropdown
   */
  const availableTeams = useMemo(() => {
    const teams = [...new Set(players.map(p => p.team).filter(Boolean))];
    return teams.sort();
  }, [players]);

  /**
   * Update sort configuration
   */
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  /**
   * Update filters
   */
  const updateFilter = useCallback((filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  /**
   * Update pagination
   */
  const updatePagination = useCallback((updates) => {
    setPagination(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Add pending change for a player
   */
  const addPendingChange = useCallback((playerId, changes) => {
    setPendingChanges(prev => {
      const newChanges = new Map(prev);
      const existing = newChanges.get(playerId) || {};
      newChanges.set(playerId, { ...existing, ...changes });
      return newChanges;
    });
  }, []);

  /**
   * Toggle favorite status for a player
   */
  const toggleFavorite = useCallback(async (playerId, isFavorited) => {
    try {
      const { playerApi } = await import('../services/api');
      await playerApi.updatePlayer(playerId, { favorited: isFavorited });
      // Refetch data to update the display
      fetchPlayers();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert('Failed to update favorite status. Please try again.');
    }
  }, [fetchPlayers]);

  /**
   * Remove pending change for a player
   */
  const removePendingChange = useCallback((playerId) => {
    setPendingChanges(prev => {
      const newChanges = new Map(prev);
      newChanges.delete(playerId);
      return newChanges;
    });
  }, []);

  /**
   * Save all pending changes
   */
  const savePendingChanges = useCallback(async () => {
    if (pendingChanges.size === 0) return { success: true, message: 'No changes to save' };

    try {
      setLoading(true);
      
      const updates = Array.from(pendingChanges.entries()).map(([id, data]) => ({
        id,
        data
      }));

      const result = await playerApi.batchUpdatePlayers(updates);
      
      if (result.successful > 0) {
        // Update the players state with successful changes
        setPlayers(prev => prev.map(player => {
          const pendingChange = pendingChanges.get(player.id);
          if (pendingChange) {
            return { ...player, ...pendingChange };
          }
          return player;
        }));
        
        // Clear pending changes
        setPendingChanges(new Map());
      }

      return {
        success: result.failed === 0,
        message: `Saved ${result.successful} changes${result.failed > 0 ? `, ${result.failed} failed` : ''}`,
        details: result
      };

    } catch (err) {
      console.error('Failed to save changes:', err);
      return {
        success: false,
        message: err.message || 'Failed to save changes'
      };
    } finally {
      setLoading(false);
    }
  }, [pendingChanges]);

  /**
   * Clear all pending changes
   */
  const clearPendingChanges = useCallback(() => {
    setPendingChanges(new Map());
  }, []);

  // Fetch players on mount
  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return {
    // Data
    players: paginatedPlayers,
    allPlayers: rankedPlayers,
    loading,
    error,
    
    // Filters and sorting
    filters,
    sortConfig,
    availableTeams,
    
    // Pagination
    pagination: {
      ...pagination,
      total: rankedPlayers.length,
      totalPages: Math.ceil(rankedPlayers.length / pagination.pageSize)
    },
    
    // Pending changes
    pendingChanges,
    hasPendingChanges: pendingChanges.size > 0,
    
    // Actions
    handleSort,
    updateFilter,
    updatePagination,
    addPendingChange,
    removePendingChange,
    savePendingChanges,
    clearPendingChanges,
    refetch: fetchPlayers,
    toggleFavorite
  };
};

/**
 * API service for communicating with the Fantasy Football Auction Draft backend
 */

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('🚨 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('🚨 API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Player API endpoints
 */
export const playerApi = {
  /**
   * Get all players with optional pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (for future pagination)
   * @param {number} params.limit - Items per page (for future pagination)
   * @param {string} params.position - Filter by position
   * @param {string} params.team - Filter by team
   * @returns {Promise} API response with players data
   */
  async getPlayers(params = {}) {
    try {
      const response = await api.get('/players', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch players');
    }
  },

  /**
   * Get a specific player by ID
   * @param {number|string} id - Player ID
   * @returns {Promise} API response with player data
   */
  async getPlayerById(id) {
    try {
      const response = await api.get(`/players/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch player');
    }
  },

  /**
   * Get players by position
   * @param {string} position - Position to filter by (QB, RB, WR, TE, K, DST)
   * @returns {Promise} API response with players data
   */
  async getPlayersByPosition(position) {
    try {
      const response = await api.get(`/players/position/${position}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch players by position');
    }
  },

  /**
   * Update a player's tier, auction_value, and yahoo_value
   * @param {number|string} id - Player ID
   * @param {Object} updates - Fields to update
   * @param {number} updates.tier - Player tier
   * @param {number} updates.auction_value - Auction value
   * @param {number} updates.yahoo_value - Yahoo value
   * @returns {Promise} API response with updated player data
   */
  async updatePlayer(id, updates) {
    try {
      const response = await api.put(`/players/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update player');
    }
  },

  /**
   * Batch update multiple players
   * @param {Array} updates - Array of player updates
   * @param {number} updates[].id - Player ID
   * @param {Object} updates[].data - Update data
   * @returns {Promise} Array of update results
   */
  async batchUpdatePlayers(updates) {
    try {
      const updatePromises = updates.map(({ id, data }) => 
        this.updatePlayer(id, data)
      );
      
      const results = await Promise.allSettled(updatePromises);
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      console.log(`📊 Batch update complete: ${successful} successful, ${failed} failed`);
      
      return {
        successful,
        failed,
        results: results.map((result, index) => ({
          id: updates[index].id,
          success: result.status === 'fulfilled',
          data: result.status === 'fulfilled' ? result.value : null,
          error: result.status === 'rejected' ? result.reason.message : null
        }))
      };
    } catch (error) {
      throw new Error('Failed to batch update players');
    }
  }
};

/**
 * Health check endpoint
 */
export const healthApi = {
  async checkHealth() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend is not responding');
    }
  }
};

export default api;

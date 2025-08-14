/**
 * Players Routes - Defines all player-related API endpoints
 * Uses Express Router to organize and modularize routes
 */

const express = require('express');
const router = express.Router();
const { 
  getPlayers, 
  getPlayerById, 
  getPlayersByPosition,
  updatePlayer
} = require('../controllers/playersController');

/**
 * @route   GET /api/players
 * @desc    Get first 50 players ordered by projected points
 * @access  Public
 */
router.get('/', getPlayers);

/**
 * @route   GET /api/players/:id
 * @desc    Get a specific player by ID
 * @access  Public
 */
router.get('/:id', getPlayerById);

/**
 * @route   GET /api/players/position/:position
 * @desc    Get players by position (QB, RB, WR, TE, K, DST)
 * @access  Public
 */
router.get('/position/:position', getPlayersByPosition);

/**
 * @route   PUT /api/players/:id
 * @desc    Update a player's tier, auction_value, and yahoo_value
 * @access  Public
 */
router.put('/:id', updatePlayer);

// Export the router to be used in the main server file
module.exports = router;

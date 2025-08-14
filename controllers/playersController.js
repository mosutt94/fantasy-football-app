/**
 * Players Controller - Handles all player-related business logic
 * Contains functions for retrieving and managing player data from the database
 */

const { pool } = require('../db');

/**
 * Get the first 50 players from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPlayers = async (req, res) => {
  try {
    console.log('📊 Fetching players from database...');
    
    // Query to get first 50 players from the players table
    const query = `
      SELECT 
        id,
        sleeper_id,
        full_name,
        first_name,
        last_name,
        position,
        team,
        status,
        auction_value,
        yahoo_value,
        bye_week,
        tier,
        active
      FROM players 
      WHERE active = true 
        AND position IN ('QB', 'RB', 'WR', 'TE', 'K', 'DST')
        AND auction_value >= 1
      ORDER BY auction_value DESC NULLS LAST
      LIMIT 200
    `;
    
    const result = await pool.query(query);
    
    console.log(`✅ Successfully retrieved ${result.rows.length} players`);
    
    // Return successful response with player data
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
      message: 'Players retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Error fetching players:', error.message);
    
    // Return error response
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve players',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get a specific player by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📊 Fetching player with ID: ${id}`);
    
    const query = `
      SELECT 
        id,
        sleeper_id,
        full_name,
        first_name,
        last_name,
        position,
        team,
        status,
        auction_value,
        yahoo_value,
        bye_week,
        tier,
        active
      FROM players 
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }
    
    console.log(`✅ Successfully retrieved player: ${result.rows[0].full_name}`);
    
    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Player retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Error fetching player:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve player',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get players by position
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPlayersByPosition = async (req, res) => {
  try {
    const { position } = req.params;
    console.log(`📊 Fetching players for position: ${position}`);
    
    const query = `
      SELECT 
        id,
        sleeper_id,
        full_name,
        first_name,
        last_name,
        position,
        team,
        status,
        auction_value,
        yahoo_value,
        bye_week,
        tier,
        active
      FROM players 
      WHERE UPPER(position) = UPPER($1) AND active = true
      ORDER BY auction_value DESC NULLS LAST
      LIMIT 50
    `;
    
    const result = await pool.query(query, [position]);
    
    console.log(`✅ Successfully retrieved ${result.rows.length} ${position} players`);
    
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
      message: `${position} players retrieved successfully`
    });
    
  } catch (error) {
    console.error('❌ Error fetching players by position:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve players by position',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Update a player's tier, auction_value, and yahoo_value
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { tier, auction_value, yahoo_value } = req.body;
    
    console.log(`📝 Updating player ID: ${id}`, { tier, auction_value, yahoo_value });
    
    // Validate input
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid player ID'
      });
    }
    
    // Build dynamic update query based on provided fields
    const updateFields = [];
    const values = [];
    let paramCounter = 1;
    
    if (tier !== undefined && tier !== null) {
      updateFields.push(`tier = $${paramCounter++}`);
      values.push(tier);
    }
    
    if (auction_value !== undefined && auction_value !== null) {
      updateFields.push(`auction_value = $${paramCounter++}`);
      values.push(auction_value);
    }
    
    if (yahoo_value !== undefined && yahoo_value !== null) {
      updateFields.push(`yahoo_value = $${paramCounter++}`);
      values.push(yahoo_value);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }
    
    // Add the ID parameter at the end
    values.push(parseInt(id));
    
    const query = `
      UPDATE players 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING 
        id,
        sleeper_id,
        full_name,
        first_name,
        last_name,
        position,
        team,
        status,
        auction_value,
        yahoo_value,
        bye_week,
        tier,
        active
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }
    
    console.log(`✅ Successfully updated player: ${result.rows[0].full_name}`);
    
    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Player updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Error updating player:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to update player',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getPlayers,
  getPlayerById,
  getPlayersByPosition,
  updatePlayer
};

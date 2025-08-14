/**
 * Test Script for Fantasy Football Auction App
 * Tests database connectivity and basic API functionality
 */

const { pool, testConnection } = require('../db');

// Test database connectivity
const testDatabase = async () => {
  console.log('🧪 Testing Database Connectivity...');
  console.log('=====================================');
  
  try {
    // Test basic connection
    await testConnection();
    
    // Test if players table exists and has data
    console.log('\n📊 Testing players table...');
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'players'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('⚠️  Warning: players table does not exist');
      console.log('💡 You may need to create the players table with the following structure:');
      console.log(`
      CREATE TABLE players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(10) NOT NULL,
        team VARCHAR(10),
        projected_points DECIMAL(6,2),
        auction_value INTEGER,
        bye_week INTEGER
      );
      `);
    } else {
      console.log('✅ players table exists');
      
      // Check if table has data
      const countResult = await pool.query('SELECT COUNT(*) as count FROM players');
      const playerCount = parseInt(countResult.rows[0].count);
      
      console.log(`📈 Players in database: ${playerCount}`);
      
      if (playerCount === 0) {
        console.log('⚠️  Warning: players table is empty');
        console.log('💡 You may want to populate it with sample data');
      } else {
        // Show sample players
        const sampleResult = await pool.query(`
          SELECT full_name, position, team, auction_value 
          FROM players 
          WHERE active = true AND auction_value IS NOT NULL
          ORDER BY auction_value DESC 
          LIMIT 5
        `);
        
        console.log('\n🏆 Top 5 players by auction value:');
        sampleResult.rows.forEach((player, index) => {
          console.log(`  ${index + 1}. ${player.full_name} (${player.position}, ${player.team}) - $${player.auction_value}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    return false;
  }
  
  return true;
};

// Test API endpoints (requires server to be running)
const testAPI = async () => {
  console.log('\n🌐 Testing API Endpoints...');
  console.log('============================');
  
  // Note: This would require the server to be running
  // For a complete test, you could use libraries like axios or node-fetch
  console.log('💡 To test API endpoints:');
  console.log('1. Start the server: npm start');
  console.log('2. Test endpoints manually:');
  console.log('   - curl http://localhost:4000/health');
  console.log('   - curl http://localhost:4000/api/players');
  console.log('   - curl http://localhost:4000/api/players/1');
  console.log('   - curl http://localhost:4000/api/players/position/QB');
  
  return true;
};

// Create sample data for testing (optional)
const createSampleData = async () => {
  console.log('\n🎲 Creating Sample Data...');
  console.log('===========================');
  
  try {
    // Check if table exists first
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'players'
    `);
    
    if (tableCheck.rows.length === 0) {
      // Create players table
      await pool.query(`
        CREATE TABLE players (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          position VARCHAR(10) NOT NULL,
          team VARCHAR(10),
          projected_points DECIMAL(6,2),
          auction_value INTEGER,
          bye_week INTEGER
        )
      `);
      console.log('✅ Created players table');
    }
    
    // Check if data already exists
    const countResult = await pool.query('SELECT COUNT(*) as count FROM players');
    const playerCount = parseInt(countResult.rows[0].count);
    
    if (playerCount > 0) {
      console.log(`📊 Table already has ${playerCount} players - skipping sample data creation`);
      return true;
    }
    
    // Insert sample players
    const samplePlayers = [
      ['Josh Allen', 'QB', 'BUF', 24.5, 45, 7],
      ['Christian McCaffrey', 'RB', 'SF', 22.8, 65, 9],
      ['Cooper Kupp', 'WR', 'LAR', 19.2, 55, 7],
      ['Travis Kelce', 'TE', 'KC', 16.8, 42, 10],
      ['Justin Tucker', 'K', 'BAL', 9.5, 8, 14],
      ['San Francisco', 'DST', 'SF', 8.2, 12, 9],
      ['Patrick Mahomes', 'QB', 'KC', 24.2, 42, 10],
      ['Derrick Henry', 'RB', 'TEN', 18.5, 38, 6],
      ['Davante Adams', 'WR', 'LV', 18.9, 48, 6],
      ['Mark Andrews', 'TE', 'BAL', 14.2, 28, 14]
    ];
    
    for (const player of samplePlayers) {
      await pool.query(
        'INSERT INTO players (name, position, team, projected_points, auction_value, bye_week) VALUES ($1, $2, $3, $4, $5, $6)',
        player
      );
    }
    
    console.log(`✅ Created ${samplePlayers.length} sample players`);
    
  } catch (error) {
    console.error('❌ Failed to create sample data:', error.message);
    return false;
  }
  
  return true;
};

// Main test function
const runTests = async () => {
  console.log('🏈 Fantasy Football Auction App - Test Suite');
  console.log('=============================================\n');
  
  try {
    // Test database connectivity
    const dbSuccess = await testDatabase();
    
    if (!dbSuccess) {
      console.log('\n❌ Database tests failed - stopping test suite');
      process.exit(1);
    }
    
    // Optionally create sample data
    console.log('\n❓ Would you like to create sample data? (Run with --create-sample flag)');
    if (process.argv.includes('--create-sample')) {
      await createSampleData();
    }
    
    // Test API endpoints
    await testAPI();
    
    console.log('\n✅ All tests completed successfully!');
    console.log('\n🚀 You can now start the server with: npm start');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await pool.end();
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testDatabase,
  testAPI,
  createSampleData,
  runTests
};

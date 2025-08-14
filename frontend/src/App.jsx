/**
 * Main App Component - Fantasy Football Auction Draft App
 */

import React from 'react';
import PlayerTable from './components/PlayerTable';
import './App.css';

function App() {
  return (
    <div className="app">
      <PlayerTable />
    </div>
  );
}

export default App;
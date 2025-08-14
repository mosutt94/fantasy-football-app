/**
 * SaveChangesButton Component - Button for saving and managing pending changes
 */

import React from 'react';
import './SaveChangesButton.css';

const SaveChangesButton = ({ hasPendingChanges, onSave, onClear, status }) => {
  const getStatusIcon = () => {
    switch (status.type) {
      case 'loading': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '';
    }
  };

  return (
    <div className="save-changes-container">
      <div className="save-actions">
        <button
          className={`save-btn ${hasPendingChanges ? 'active' : 'disabled'}`}
          onClick={onSave}
          disabled={!hasPendingChanges || status.type === 'loading'}
          title={hasPendingChanges ? 'Save all pending changes' : 'No changes to save'}
        >
          {status.type === 'loading' ? 'Saving...' : 'Save Changes'}
        </button>
        
        {hasPendingChanges && (
          <button
            className="clear-btn"
            onClick={onClear}
            disabled={status.type === 'loading'}
            title="Clear all pending changes"
          >
            Clear
          </button>
        )}
      </div>

      {status.message && (
        <div className={`status-message ${status.type}`}>
          <span className="status-icon">{getStatusIcon()}</span>
          <span className="status-text">{status.message}</span>
        </div>
      )}

      {hasPendingChanges && (
        <div className="pending-indicator">
          <span className="pending-dot"></span>
          <span className="pending-text">You have unsaved changes</span>
        </div>
      )}
    </div>
  );
};

export default SaveChangesButton;

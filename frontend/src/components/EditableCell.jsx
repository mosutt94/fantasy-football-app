/**
 * EditableCell Component - Inline editable cell for player values
 */

import React, { useState, useEffect } from 'react';
import './EditableCell.css';

const EditableCell = ({ 
  value, 
  type = 'text', 
  onChange, 
  placeholder = '', 
  min, 
  max,
  prefix = '',
  suffix = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    setEditValue(value || '');
  }, [value]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue !== value) {
      onChange(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const displayValue = value || value === 0 ? `${prefix}${value}${suffix}` : placeholder;

  if (isEditing) {
    return (
      <div className="editable-cell editing">
        <input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          className="edit-input"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div 
      className="editable-cell clickable"
      onClick={handleEdit}
      title="Click to edit"
    >
      <span className="cell-value">
        {displayValue}
      </span>
      <span className="edit-icon">✏️</span>
    </div>
  );
};

export default EditableCell;

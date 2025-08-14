/**
 * PaginationControls Component - Controls for table pagination and page size
 */

import React from 'react';
import './PaginationControls.css';

const PaginationControls = ({ pagination, onPaginationChange }) => {
  const { currentPage, pageSize, total, totalPages } = pagination;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPaginationChange({ currentPage: newPage });
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    onPaginationChange({ 
      pageSize: newPageSize, 
      currentPage: 1 // Reset to first page when changing page size
    });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const startPage = Math.max(1, currentPage - 3);
      const endPage = Math.min(totalPages, currentPage + 3);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div className="pagination-controls">
      <div className="pagination-info">
        <span className="item-range">
          {total === 0 ? '0' : `${startItem}-${endItem}`} of {total}
        </span>
      </div>

      <div className="page-size-selector">
        <label>
          Show:
          <select 
            value={pageSize} 
            onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
            className="page-size-select"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          per page
        </label>
      </div>

      {totalPages > 1 && (
        <div className="pagination-buttons">
          <button
            className="page-btn"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            title="First page"
          >
            «
          </button>
          
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            title="Previous page"
          >
            ‹
          </button>

          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="page-ellipsis">...</span>
              ) : (
                <button
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            title="Next page"
          >
            ›
          </button>
          
          <button
            className="page-btn"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            title="Last page"
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginationControls;

import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50">
        ‹
      </button>
      {getVisiblePages().map((page, index) => (
        <button key={index} onClick={() => typeof page === 'number' && onPageChange(page)} className={`px-3 py-1 rounded ${page === currentPage ? 'bg-accent text-white' : 'text-gray-600 hover:text-gray-900'}`} disabled={typeof page !== 'number'}>
          {page}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50">
        ›
      </button>
    </div>
  );
};

export default Pagination;

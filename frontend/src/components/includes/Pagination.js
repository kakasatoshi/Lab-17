import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
    // Compute previous and next pages
    const previousPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return (
        <section className="pagination">
            {/* First Page */}
            {currentPage !== 1 && previousPage !== 1 && (
                <a href="#" onClick={() => onPageChange(1)}>1</a>
            )}
            
            {/* Previous Page */}
            {previousPage && (
                <a href="#" onClick={() => onPageChange(previousPage)}>{previousPage}</a>
            )}
            
            {/* Current Page */}
            <a href="#" className="active">{currentPage}</a>
            
            {/* Next Page */}
            {nextPage && (
                <a href="#" onClick={() => onPageChange(nextPage)}>{nextPage}</a>
            )}

            {/* Last Page */}
            {currentPage !== totalPages && nextPage !== totalPages && (
                <a href="#" onClick={() => onPageChange(totalPages)}>{totalPages}</a>
            )}
        </section>
    );
}

export default Pagination;

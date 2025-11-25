import React, { useState } from 'react';
import AvailableInspectorCard from './AvailableInspectorCard';
import '../assign/styles/AvailableInspectors.css';

const AvailableInspectors = ({ availableInspectors }) => {
    // 1. Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Limit to 3 cards per page

    // 2. Calculate Slicing
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInspectors = availableInspectors.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(availableInspectors.length / itemsPerPage);

    // 3. Handlers
    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    return (
        <div className="available-inspectors-container">
            <div className="available-inspectors-header">
                <h2 className="available-inspectors-title">Available Inspectors</h2>
                <span className="ready-badge">{availableInspectors.length} Ready</span>
            </div>

            {/* Show only the SLICED list (currentInspectors) */}
            <div className="available-inspectors-grid">
                {currentInspectors.length > 0 ? (
                    currentInspectors.map(inspector => (
                        <AvailableInspectorCard key={inspector.id} inspector={inspector} />
                    ))
                ) : (
                    <p style={{ color: '#888', fontStyle: 'italic', padding: '10px' }}>
                        No inspectors available.
                    </p>
                )}
            </div>

            {/* Pagination Controls */}
            {availableInspectors.length > itemsPerPage && (
                <div className="pagination-controls-mini" style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>
            Page {currentPage} of {totalPages}
          </span>
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        style={{ padding: '4px 10px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                    >
                        &lt;
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        style={{ padding: '4px 10px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
};

export default AvailableInspectors;
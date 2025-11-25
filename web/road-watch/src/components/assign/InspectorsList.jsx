import React, { useState } from 'react'; // <--- FIXED: Import useState
import InspectorCard from './InspectorCard';
import '../assign/styles/InspectorsList.css';

const InspectorsList = ({ inspectors }) => {
    // 1. Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Change this number to show more/less cards

    // 2. Slicing Logic (Calculates which 3 cards to show)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Ensure we don't crash if inspectors is undefined
    const currentInspectors = (inspectors || []).slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil((inspectors || []).length / itemsPerPage);

    // 3. Navigation Handlers
    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    return (
        <div className="inspectors-list-container">
            <h2 className="inspectors-list-title">Inspectors</h2>

            <div className="inspectors-cards">
                {currentInspectors.length > 0 ? (
                    currentInspectors.map(inspector => (
                        <InspectorCard key={inspector.id} inspector={inspector} />
                    ))
                ) : (
                    <p style={{color: '#888', fontStyle: 'italic'}}>No inspectors found.</p>
                )}
            </div>

            {/* 4. Pagination Controls (Only show if we have more than 1 page) */}
            {(inspectors || []).length > itemsPerPage && (
                <div className="pagination-controls-mini" style={{marginTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px', alignItems: 'center'}}>
           <span style={{fontSize: '12px', color: '#666'}}>
             Page {currentPage} of {totalPages}
           </span>
                    <div style={{display: 'flex', gap: '5px'}}>
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="mini-pagination-btn"
                        >
                            &lt;
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="mini-pagination-btn"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InspectorsList;
// src/components/assign/AssignReportsSection.jsx
import React, { useState, useEffect } from 'react';
import SearchBar from '../reports/SearchBar';
import CategoryFilter from '../reports/CategoryFilter';
import StatusFilter from '../reports/StatusFilter';
import AssignReportsTable from './AssignReportsTable';
import '../assign/styles/AssignReportsSection.css';

const AssignReportsSection = ({
                                  reports,
                                  inspectors,
                                  searchQuery,
                                  onSearchChange,
                                  selectedCategory,
                                  onCategoryChange,
                                  selectedStatus,
                                  onStatusChange,
                                  onAssign
                              }) => {
    // 1. Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // Change this to 10 if you want more rows

    // 2. Filter Logic (Same as before)
    const activeReports = reports.filter(r => {
        const rTitle = r.title ? r.title.toLowerCase() : "";
        const rCategory = r.category || "";
        const rStatus = r.status || "";

        const matchesSearch = rTitle.includes((searchQuery || "").toLowerCase()) ||
            (r.id && r.id.toString().includes(searchQuery));

        const matchesCategory = !selectedCategory || selectedCategory === 'All Categories' || rCategory === selectedCategory;
        const matchesStatus = !selectedStatus || selectedStatus === 'All Statuses' || rStatus === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // 3. Reset Page to 1 if user searches or filters
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, selectedStatus]);

    // 4. Calculate Slicing (The Math)
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = activeReports.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(activeReports.length / rowsPerPage);

    // 5. Button Handlers
    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    return (
        <div className="assign-reports-section">

            {/* Filters */}
            <div className="assign-reports-filters">
                <SearchBar
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by ID, title, or location..."
                />
                <CategoryFilter
                    value={selectedCategory}
                    onChange={onCategoryChange}
                />
                <StatusFilter
                    value={selectedStatus}
                    onChange={onStatusChange}
                />
            </div>

            {/* Table: Pass the SLICED 'currentRows' instead of all reports */}
            <AssignReportsTable
                reports={currentRows}
                inspectors={inspectors}
                onAssign={onAssign}
            />

            {/* Footer / Pagination Controls */}
            <div className="assign-reports-footer">
        <span className="reports-count">
            {/* Logic to show "Showing 1 to 5 of 20" */}
            Showing {activeReports.length > 0 ? indexOfFirstRow + 1 : 0} to {Math.min(indexOfLastRow, activeReports.length)} of {activeReports.length} reports
        </span>

                <div className="reports-pagination">
          <span className="page-info">
             Page {activeReports.length > 0 ? currentPage : 0} of {totalPages}
          </span>
                    <div className="pagination-controls">
                        <button
                            className="pagination-btn"
                            onClick={handlePrevious}
                            disabled={currentPage === 1 || activeReports.length === 0}
                        >
                            Previous
                        </button>
                        <button
                            className="pagination-btn"
                            onClick={handleNext}
                            disabled={currentPage === totalPages || activeReports.length === 0}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignReportsSection;
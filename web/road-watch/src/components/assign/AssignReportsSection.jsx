// src/components/assign/AssignReportsSection.jsx
import React from 'react';
import SearchBar from '../reports/SearchBar';
import CategoryFilter from '../reports/CategoryFilter';
import StatusFilter from '../reports/StatusFilter';
import AssignReportsTable from './AssignReportsTable';
import '../assign/styles/AssignReportsSection.css';

const AssignReportsSection = ({
                                  reports,
                                  inspectors, // 1. Receive inspectors from Parent
                                  searchQuery,
                                  onSearchChange,
                                  selectedCategory,
                                  onCategoryChange,
                                  selectedStatus,
                                  onStatusChange,
                                  onAssign
                              }) => {

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

    return (
        <div className="assign-section-container">
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

            <AssignReportsTable
                reports={activeReports}
                inspectors={inspectors} // 2. PASS IT DOWN! (This was likely missing)
                onAssign={onAssign}
            />

            <div className="assign-reports-footer">
        <span className="reports-count">
            Showing {activeReports.length} reports
        </span>
            </div>
        </div>
    );
};

export default AssignReportsSection;
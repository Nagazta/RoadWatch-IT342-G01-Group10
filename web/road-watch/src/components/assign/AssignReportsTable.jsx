// src/components/assign/AssignReportsTable.jsx
import React, { useState } from 'react';

const AssignReportsTable = ({ reports, inspectors = [], onAssign }) => {
    // Default inspectors to [] to prevent crash

    // Local state to track dropdown selections
    const [selections, setSelections] = useState({});

    return (
        <div className="reports-table-container">
            <table className="reports-table">
                <thead>
                <tr>
                    <th>Report ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th style={{width: '220px'}}>Assigned Inspector</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {reports.map((report) => (
                    <tr key={report.id}>
                        <td>#{report.id}</td>
                        <td>{report.title}</td>
                        <td>{report.category}</td>
                        <td>{report.location}</td>
                        <td>{report.dateSubmitted ? new Date(report.dateSubmitted).toLocaleDateString() : "N/A"}</td>

                        <td>
                <span className={`status-badge ${report.status?.toLowerCase().replace(' ', '-') || 'pending'}`}>
                  {report.status}
                </span>
                        </td>

                        {/* --- DROPDOWN COLUMN --- */}
                        <td>
                            {report.status === 'Resolved' ? (
                                // If Resolved, show Text
                                <span style={{color: '#6b7280', fontSize: '14px'}}>
                       {report.assignedInspector?.user?.name || "—"}
                   </span>
                            ) : (
                                // If Active, show Dropdown
                                <select
                                    className="inspector-select"
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        backgroundColor: 'white'
                                    }}
                                    // CRASH FIX: Handle null/undefined safely
                                    value={selections[report.id] || (report.assignedInspector?.id || "")}
                                    onChange={(e) => setSelections({ ...selections, [report.id]: e.target.value })}
                                >
                                    <option value="">-- Select Inspector --</option>

                                    {/* CRASH FIX: Ensure inspectors is an array before mapping */}
                                    {Array.isArray(inspectors) && inspectors.map((insp) => (
                                        <option key={insp.id} value={insp.id}>
                                            {insp.user ? insp.user.name : `Inspector ${insp.id}`}
                                            {insp.status === 'Busy' ? ' (Busy)' : ''}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </td>

                        {/* --- ACTION BUTTON --- */}
                        <td>
                            {report.status !== 'Resolved' && (
                                <button
                                    className="action-btn assign-btn"
                                    // Pass the SELECTED ID, not just the report ID
                                    onClick={() => onAssign(report.id, selections[report.id])}
                                    // Disable if nothing is selected AND nothing was previously assigned
                                    disabled={!selections[report.id] && !report.assignedInspector}
                                    style={{
                                        opacity: (!selections[report.id] && !report.assignedInspector) ? 0.5 : 1,
                                        cursor: (!selections[report.id] && !report.assignedInspector) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {report.assignedInspector ? "Reassign" : "Assign"}
                                </button>
                            )}
                        </td>
                    </tr>
                ))}

                {reports.length === 0 && (
                    <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                            No reports found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default AssignReportsTable;
import React, { useState } from 'react';
import InspectorsList from '../../components/assign/InspectorsList';
import AvailableInspectors from '../../components/assign/AvailableInspectors';
import AssignReportsSection from '../../components/assign/AssignReportsSection';
import '../admin/styles/AssignInspector.css';

const AssignInspector = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Mock inspectors data
  const inspectors = [
    { id: 1, name: 'Inspector Davis', activeAssignments: 3, status: 'Busy' },
    { id: 2, name: 'Inspector Santos', activeAssignments: 1, status: 'Available' },
    { id: 3, name: 'Inspector Reyes', activeAssignments: 1, status: 'Available' }
  ];

  // Mock available inspectors
  const availableInspectors = [
    { id: 1, name: 'Inspector Sepulveda', assignments: 0 },
    { id: 2, name: 'Inspector Sumucad', assignments: 0 }
  ];

  // Mock reports data
  const reports = [
    { id: '#501', title: 'Large pothole on Osmeña Blvd', category: 'Pothole', location: 'Cebu City', dateSubmitted: '2025-10-21', status: 'Unassigned', assignedInspector: null },
    { id: '#502', title: 'Flooding near Ayala tunnel', category: 'Flooding', location: 'Cebu Business Park', dateSubmitted: '2025-10-20', status: 'Assigned', assignedInspector: 'Inspector Daviz' },
    { id: '#503', title: 'Cracked sidewalk', category: 'Crack', location: 'IT Park', dateSubmitted: '2025-10-19', status: 'In Progress', assignedInspector: 'Inspector Santos' },
    { id: '#504', title: 'Broken street light', category: 'Street Light', location: 'Mandaue City', dateSubmitted: '2025-10-18', status: 'Unassigned', assignedInspector: null },
    { id: '#505', title: 'Road sign missing', category: 'Signage', location: 'Lahuq', dateSubmitted: '2025-10-17', status: 'Resolved', assignedInspector: 'Inspector Reyes' }
  ];

  const handleAssign = (reportId) => {
    console.log('Assign inspector to report:', reportId);
  };

  const handleReassign = (reportId) => {
    console.log('Reassign inspector for report:', reportId);
  };

  return (
    <div className="assign-inspector-container">

      <div className="inspectors-section">
        <InspectorsList inspectors={inspectors} />
        <AvailableInspectors availableInspectors={availableInspectors} />
      </div>

      <AssignReportsSection
        reports={reports}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onAssign={handleAssign}
        onReassign={handleReassign}
      />
    </div>
  );
};

export default AssignInspector;
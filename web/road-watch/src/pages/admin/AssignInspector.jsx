// src/pages/admin/AssignInspector.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InspectorsList from '../../components/assign/InspectorsList';
import AvailableInspectors from '../../components/assign/AvailableInspectors';
import AssignReportsSection from '../../components/assign/AssignReportsSection';
import '../admin/styles/AssignInspector.css';

const AssignInspector = () => {
    const [reports, setReports] = useState([]);
    const [inspectors, setInspectors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');

    // 1. Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true);
            
            // 🔍 DEBUG: Check what tokens exist
            const token1 = localStorage.getItem('token');
            const token2 = localStorage.getItem('accessToken');
            const userRole = localStorage.getItem('userRole');
            
            console.log('🔍 DEBUG TOKEN CHECK:');
            console.log('token:', token1 ? '✅ EXISTS' : '❌ MISSING');
            console.log('accessToken:', token2 ? '✅ EXISTS' : '❌ MISSING');
            console.log('userRole:', userRole);
            
            // Use the correct token
            const token = token1 || token2; // Try both
            
            if (!token) {
                console.error('❌ NO TOKEN FOUND!');
                return;
            }
            
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            const [reportsRes, inspectorsRes] = await Promise.all([
                axios.get('${import.meta.env.VITE_API_BASE_URL}/api/reports/getAll', config),
                axios.get('${import.meta.env.VITE_API_BASE_URL}/api/inspector/getAll', config)
            ]);

            setReports(reportsRes.data);
            setInspectors(inspectorsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            console.error("Error response:", error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Process Inspectors
    const processedInspectors = inspectors.map(inspector => {
        const activeCount = reports.filter(r =>
            r.assignedInspector?.id === inspector.id &&
            r.status !== 'Resolved'
        ).length;

        let status = 'Available';
        if (activeCount >= 3) status = 'Busy';

        return {
            ...inspector,
            name: inspector.user ? inspector.user.name : `Inspector #${inspector.id}`,
            activeAssignments: activeCount,
            status: status
        };
    });

    const availableInspectorsList = processedInspectors.filter(i => i.status === 'Available');

    // 3. Handle Assign
    const handleAssign = async (reportId, inspectorId) => {
        if (!inspectorId) {
            alert("Please select an inspector first.");
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/reports/${reportId}/assign/${inspectorId}`,
                {},
                config
            );

            alert("Inspector assigned successfully!");
            fetchData();
        } catch (error) {
            console.error("Failed to assign:", error);
            alert("Failed to assign inspector.");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="assign-inspector-container">
            <div className="inspectors-section">
                <InspectorsList inspectors={processedInspectors} />
                <AvailableInspectors availableInspectors={availableInspectorsList} />
            </div>

            {/* ✅ THIS IS THE CRITICAL PART
          This forces the app to look at 'src/components/assign/AssignReportsSection.jsx'
          It sends the data there. It does NOT render a table here.
      */}
            <AssignReportsSection
                reports={reports}
                inspectors={processedInspectors}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery} // Note: You need to pass the setter if the search bar is inside the child
                selectedCategory={selectedCategory}
                selectedStatus={selectedStatus}
                onAssign={handleAssign}
            />
        </div>
    );
};

export default AssignInspector;
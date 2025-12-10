// Inspector Service API
// Location: src/services/api/inspectorService.js

const API_URL = `${import.meta.env.VITE_API_URL}/inspector`;

const inspectorService = {
    /**
     * Get inspector by ID
     */
    async getInspectorById(inspectorId) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/getBy/${inspectorId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch inspector data');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('❌ Get inspector error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Update inspector profile
     */
    async updateInspector(inspectorId, inspectorData) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/update/${inspectorId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inspectorData),
            });

            if (!response.ok) {
                throw new Error('Failed to update inspector data');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('❌ Update inspector error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get all inspectors (for admin use)
     */
    async getAllInspectors() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/getAll`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch inspectors');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('❌ Get all inspectors error:', error);
            return { success: false, error: error.message };
        }
    },
};

export default inspectorService;

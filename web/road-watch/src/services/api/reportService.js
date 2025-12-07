import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if(!supabaseUrl || !supabaseAnonKey)
{
    alert('Configuration Error: Missing Supabase keys. Check console for details.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const reportService =
{
    createReport: async(formData, email) =>
    {
        try
        {
            const response = await axios.post
            (
                `${API_URL}/api/reports/add2`, formData, { params: {submittedBy: email} }
            );

            if(response.data)
            {
                // ✅ FIX: Return the created report data including the ID
                return { 
                    success: true, 
                    data: response.data  // This contains the ReportEntity with id
                };
            }
            else
                throw new Error('Failed to create report');
        }
        catch(error)
        {
            console.error('Create report error:', error);
            return { 
                success: false,
                error: error.response?.data?.message || error.message 
            };
        }
    },

    
    getReportsByEmail: async(email) => 
    {
        try 
        {
            const response = await axios.get
            (
                `${API_URL}/api/reports/getAll/name`, { params: {submittedBy: email} }
            );

            if (response.data)
                 return { success: true, data: response.data };
            else
                throw new Error('Failed to fetch reports');
        } 
        catch (error) 
        {
            console.error('Get reports error:', error);
            return { success: false };
        }
    },

    getAllReports: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/reports/getAll`);
            if(response.data && Array.isArray(response.data)) {
                // Optionally sort newest to oldest if backend does not
                return { 
                    success: true, 
                    data: response.data.sort((a,b) => 
                        new Date(b.dateSubmitted || b.createdAt) - 
                        new Date(a.dateSubmitted || a.createdAt)
                    ) 
                };
            } else {
                return { success: false };
            }
        } catch(error) {
            console.error('Get all reports error:', error);
            return { success: false };
        }
    },

    getMyAssignedReports: async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            
            if (!accessToken) {
                console.error('No access token found in localStorage');
                return { success: false, error: 'Authentication required' };
            }

            const response = await axios.get(
                `${API_URL}/api/reports/getMyAssignedReport`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            if (response.data && Array.isArray(response.data)) {
                return { success: true, data: response.data };
            } else {
                return { success: false };
            }
        } catch (error) {
            console.error('Error fetching assigned reports:', error.message);
            if (error.response?.status === 401) {
                return { success: false, error: 'Token expired or invalid' };
            } else if (error.response?.status === 403) {
                return { success: false, error: 'User is not an inspector' };
            }
            return { success: false, error: error.message };
        }
    },

    getReportDetail: async (reportId) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const headers = {};
            
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }

            const response = await axios.get(
                `${API_URL}/api/reports/getDetail/${reportId}`,
                { headers }
            );

            if (response.data) {
                return { success: true, data: response.data };
            } else {
                return { success: false, error: 'Report not found' };
            }
        } catch (error) {
            console.error('Error fetching report detail:', error.message);
            if (error.response?.status === 404) {
                return { success: false, error: 'Report not found' };
            } else if (error.response?.status === 401) {
                return { success: false, error: 'Token expired or invalid' };
            }
            return { success: false, error: error.message };
        }
    },

    updateReportStatus: async (reportId, newStatus) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            
            if (!accessToken) {
                return { success: false, error: 'Authentication required' };
            }

            const response = await axios.put(
                `${API_URL}/api/reports/${reportId}/status`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                return { success: true, data: response.data };
            } else {
                return { success: false, error: 'Failed to update status' };
            }
        } catch (error) {
            console.error('Error updating report status:', error.message);
            if (error.response?.status === 401) {
                return { success: false, error: 'Token expired or invalid' };
            } else if (error.response?.status === 403) {
                return { success: false, error: 'User is not an inspector' };
            } else if (error.response?.status === 404) {
                return { success: false, error: 'Report not found' };
            }
            return { success: false, error: error.message };
        }
    },

    addCommentToReport: async (reportId, comment) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            
            if (!accessToken) {
                return { success: false, error: 'Authentication required' };
            }

            const response = await axios.post(
                `${API_URL}/api/reports/${reportId}/comment`,
                { comment },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                return { success: true, data: response.data };
            } else {
                return { success: false, error: 'Failed to add comment' };
            }
        } catch (error) {
            console.error('Error adding comment:', error.message);
            if (error.response?.status === 401) {
                return { success: false, error: 'Token expired or invalid' };
            } else if (error.response?.status === 403) {
                return { success: false, error: 'User is not an inspector' };
            } else if (error.response?.status === 404) {
                return { success: false, error: 'Report not found' };
            }
            return { success: false, error: error.message };
        }
    }
}

export default reportService;
// src/services/api/feedbackService.js - FIXED FOR PRODUCTION
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

// ✅ FIXED: Use VITE_API_BASE_URL to match Dockerfile
const API_URL = import.meta.env.VITE_API_BASE_URL;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!API_URL) {
    console.error('❌ VITE_API_BASE_URL is not set!');
    throw new Error('API URL configuration is missing');
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase configuration is missing!');
    alert('Configuration Error: Missing Supabase keys. Check console for details.');
}

console.log('🔗 API URL configured:', API_URL);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const reportService = {
    createReport: async(formData, email) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/reports/add2`, 
                formData, 
                { params: {submittedBy: email} }
            );

            if (response.data) {
                return { 
                    success: true, 
                    data: response.data
                };
            } else {
                throw new Error('Failed to create report');
            }
        } catch(error) {
            console.error('Create report error:', error);
            return { 
                success: false,
                error: error.response?.data?.message || error.message 
            };
        }
    },

    getReportsByEmail: async(email) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/reports/getAll/name`, 
                { params: {submittedBy: email} }
            );

            if (response.data) {
                return { success: true, data: response.data };
            } else {
                throw new Error('Failed to fetch reports');
            }
        } catch (error) {
            console.error('Get reports error:', error);
            return { success: false };
        }
    },

    getAllReports: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/reports/getAll`);
            if (response.data && Array.isArray(response.data)) {
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

    getReportImages: async (reportId) => {
        try {
            const response = await axios.get(`${API_URL}/api/reports/${reportId}/images`);
            return {
                success: true,
                data: response.data
            };
        } catch(error) {
            console.error('Get report images error:', error);
            return { success: false, data: [] };
        }
    }
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

const feedbackService = {
    getAllFeedback: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/feedback/all`, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Failed to fetch feedback:', error);
            return { success: false, error: error.message };
        }
    },

    getFeedbackById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/api/feedback/${id}`, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Failed to fetch feedback:', error);
            return { success: false, error: error.message };
        }
    },

    getMyFeedback: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/feedback/my-feedback`, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Failed to fetch my feedback:', error);
            return { success: false, error: error.message };
        }
    },

    submitFeedback: async (feedbackData) => {
        try {
            const response = await axios.post(`${API_URL}/api/feedback/submit`, feedbackData, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            return { success: false, error: error.message };
        }
    },

    updateFeedbackStatus: async (id, updates) => {
        try {
            const response = await axios.put(`${API_URL}/api/feedback/${id}/status`, updates, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Failed to update feedback:', error);
            return { success: false, error: error.message };
        }
    },

    deleteFeedback: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/api/feedback/${id}`, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Failed to delete feedback:', error);
            return { success: false, error: error.message };
        }
    },

    getFeedbackStats: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/feedback/stats`, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Failed to fetch feedback stats:', error);
            return { success: false, error: error.message };
        }
    }
};

export { reportService, feedbackService };
export default feedbackService;

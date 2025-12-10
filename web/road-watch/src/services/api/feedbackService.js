// src/services/api/feedbackService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is not set');
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
  // Get all feedback (Admin)
  getAllFeedback: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/feedback/all`, getAuthHeaders());
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
      return { success: false, error: error.message };
    }
  },

  // Get feedback by ID
  getFeedbackById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/feedback/${id}`, getAuthHeaders());
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
      return { success: false, error: error.message };
    }
  },

  // Get my feedback (Citizen)
  getMyFeedback: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/feedback/my-feedback`, getAuthHeaders());
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to fetch my feedback:', error);
      return { success: false, error: error.message };
    }
  },

  // Submit feedback
  submitFeedback: async (feedbackData) => {
    try {
      const response = await axios.post(`${API_URL}/api/feedback/submit`, feedbackData, getAuthHeaders());
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      return { success: false, error: error.message };
    }
  },

  // Update feedback status (Admin)
  updateFeedbackStatus: async (id, updates) => {
    try {
      const response = await axios.put(`${API_URL}/api/feedback/${id}/status`, updates, getAuthHeaders());
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to update feedback:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete feedback (Admin)
  deleteFeedback: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/feedback/${id}`, getAuthHeaders());
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      return { success: false, error: error.message };
    }
  },

  // Get feedback stats (Admin)
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

export default feedbackService;